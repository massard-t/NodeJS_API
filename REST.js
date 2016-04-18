var mysql = require("mysql");
var md5 = require("md5");

function ExtractJSON(content_json, fields) {
    const parsed_data = JSON.parse(content_json);
    // console.log(parsed_data);
    if (parsed_data === 'undefined')
        return (false);
    var res_array = [];
    if (fields)
    {
        for (var field in parsed_data)
        {
            res_array.push(field);
        }
    } else {
            for (var field in parsed_data)
            {
                if (field == 'id'){res_array.push(parsed_data[field]);}
                else if (field =='mdp' || field == 'password'){`'`+res_array.push(md5(parsed_data[field]))+`'`;}
                else{res_array.push(`'`+parsed_data[field]+`'`);}
            }
    }
    return (res_array);
}

function DefineDB() {
    const connection = mysql.createConnection({
        host     : '0.0.0.0',
        user     : 'robotbobtm',
        database : 'asptt'
    });
    connection.connect();
    return (connection);
}

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

function UserExists(content) {
    const bdd = DefineDB();
    const query = `SELECT id FROM client WHERE (email=?? AND ID=??);`;
    const values = [ExtractJSON(content,true),
                    ExtractJSON(content,false)];
    console.log(values[1]);
    
    const request = bdd.format(query, values[1]);
    console.log(request);
    return;
}

function ErrorJson(err)
{
    return (({"Error" : true, "Message" : `Error executing MySQL query: ${err}`}));
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    router.post("/add", function(req, res){
        const bdd = DefineDB();
        console.log(req.body);
        const values = [ExtractJSON(req.body.json,true),
                        ExtractJSON(req.body.json,false)];
        const rolepos = values[0].indexOf('role');
        console.log(values[0][rolepos] + " : " + values[1][rolepos]);
        const table = (parseInt((values[1][rolepos]).replace('\'', '')) == 1) ? 'coach' : 'client';
        console.log(`ParseInt: ${values[1][rolepos]}\nTable: ${table}`);
        const query = `INSERT INTO ${table} (??) VALUES (?);`;
        values[0].pop(rolepos);
        values[1].pop(rolepos);
        const request = bdd.format(query, values);
        console.log(request);
        connection.query(request, function(err,rows){
            if(err) {res.json(ErrorJson(err));}
            else {res.json({"Error" : false, "Message" : "User Added !"});}
        });
    });
    
    router.post("/connect", function(req, res){
        const bdd = DefineDB();
        const query = `SELECT * FROM users WHERE (email=? and password=?);`;
        const values = [ExtractJSON(req.body.json,true),
                        ExtractJSON(req.body.json,false)];
        // UserExists(req.headers.json);
        const request = bdd.format(query, values[1]);
        connection.query(request, function(err, rows){
            if (err){res.json(ErrorJson(err))} else {
                const items = Object.keys(rows).length;
                console.log(rows);
                if (items >= 1){res.json({"Error": false,"role":rows[0].role})}
                else{res.json({"Error": true, "Message": "No such user", "role":-1})}
            }
        });
    });
    connection.release();
};


module.exports = REST_ROUTER;
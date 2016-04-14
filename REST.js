var mysql = require("mysql");

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
                if (field == 'id'){res_array.push(parsed_data[field]);}else{res_array.push(`'`+parsed_data[field]+`'`);}
            }
    }
    console.log(res_array.join(`,`) + "\nfin extractJSON");
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
    const query = `SELECT id FROM client WHERE (email=?? AND ID=??)`;
    const values = [ExtractJSON(content,true),
                    ExtractJSON(content,false)];
    const request = bdd.format(query, values);
    console.log(request);
    return;
}
REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    const bdd = DefineDB();
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    router.post("/user", function(req, res, bdd){
        console.log(req.headers.json);
        const query = `INSERT INTO client (??) VALUES (?);`;
        const values = [ExtractJSON(req.headers.json,true),
                        ExtractJSON(req.headers.json,false)];
        const request = bdd.format(query, values);
        console.log(request);
        connection.query(request, function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            };
        });
    });
    
    router.post("/connect", function(req, res, bdd){
        console.log(req.headers.json);
        UserExists(req.headers.json);
        res.json({"email":true});
    });
    connection.end();
}

module.exports = REST_ROUTER;
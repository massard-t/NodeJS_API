var mysql = require("mysql");
var md5 = require("md5");

function ExtractJSON(content_json, fields) {
    const parsed_data = JSON.parse(content_json);
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

function Foreach_Add(js_obj, query) {
    const bdd = DefineDB();
    const values = js_obj;
    const request = bdd.format(query, values);
    console.log(request);
    bdd.query(request, function(err, rows){
        if (err){throw err}
        else {console.log("worked fine")}
    });
    bdd.end();
}

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

// function UserExists(content) {
//     const bdd = DefineDB();
//     const query = `SELECT id FROM client WHERE (email=?? AND ID=??);`;
//     const values = [ExtractJSON(content,true),
//                     ExtractJSON(content,false)];
//     console.log(values[1]);
    
//     const request = bdd.format(query, values[1]);
//     console.log(request);
//     return;
// }

function ErrorJson(err)
{
    return (({"Error" : true, "Message" : `Error executing MySQL query: ${err}`}));
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });


    router.post("/newrel", function(req, res){
        const bdd = DefineDB();
        const values = [ExtractJSON(req.body.json,true),
                        ExtractJSON(req.body.json,false)];
        const query = `INSERT INTO relations (??) VALUES (?);`;
        const request = bdd.format(query, values);
        console.log(request);
        connection.query(request, function(err, rows){
            if (err){res.json({"Error":true, "Message":"Probleme interne"})}
            else {res.json({"Error":false, "Message":"Nouvelle relation"})}
        });
    });
    
    
    router.post("/reponseQuestion", function(req, res){
        const bdd = DefineDB();
        const values = [ExtractJSON(req.body.json, true),
                        ExtractJSON(req.body.json, false)];
        const email = values[1][values[0].indexOf('email')];
        values[1].pop(values[0].indexOf('email'));
        values[0].pop(values[0].indexOf('email'));
        const query = `INSERT INTO question (client, numero, reponse) VALUES (${email}, ?, ?);`;
        var count = 0;
        const size = values[1].length;
        var error = false;
        try {
            while (count < size) {
            console.log(`Passage ${count}`);
            Foreach_Add([values[0][count],values[1][count]], query);
            count = count + 1;
            }
        } catch (err) {
            res.json({"Error":true,"Message":err});
            error = true;
        }
        console.log(values);
        if (!error){
            res.json({"Error":false,"Message":"Ajout reponses ok"});
        }
    });
    
    
    router.post("/add", function(req, res){
        const bdd = DefineDB();
        var table;
        const values = [ExtractJSON(req.body.json,true),
                        ExtractJSON(req.body.json,false)];
        const rolepos = values[0].indexOf('role');
        if ((values[1][rolepos]) !== undefined){
            table = (parseInt((values[1][rolepos]).replace('\'', ''),
                                                10) == 1) ? 'coach' : 'client';
            values[0].pop(rolepos);
            values[1].pop(rolepos);
        } else {
            table = 'client';
        }
        const query = `INSERT INTO ${table} (??, new) VALUES (?, 0);`;
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
    
    router.post("/getmyclients", function(req, res) {
        const bdd = DefineDB();
        const query = `SELECT client FROM relations WHERE (coach=?);`;
        const values = [ExtractJSON(req.body.json, true),
                        ExtractJSON(req.body.json, false)];
        const request = bdd.format(query, values[1]);
        console.log(request);
        connection.query(request, function(err, rows){
            if (err){res.json({"Error":true, "clients":-1})}
            else{
                var clients_id = [];
                for (var row in rows) {
                    clients_id.push(rows[row]);
                }
                res.json({"Error":false, "clients":clients_id})}
        });
    });
    
    router.post("/getclientinfo", function(req, res) {
        const bdd = DefineDB();
        const query = `SELECT * FROM client WHERE (email=?);`;
        const values = [ExtractJSON(req.body.json, true),
                        ExtractJSON(req.body.json, false)];
        const request = bdd.format(query, values[1]);
        console.log(request);
        connection.query(request, function(err, rows) {
            if (err){res.json({"Error":true})}
            else{
                var client_info = [];
                console.log(rows[0]);
                const row = rows[0];
                res.json({"email":row.email, "nom":row.nom, "prenom":row.prenom,"phone":row.phone,"taille":row.taille,"poids":row.poids});
                for (var element in rows[0]){
                    client_info[element] = rows[0].element;
                }
                console.log(client_info);
            }
        });
    });
    
    router.post("/planning", function(req, res){
        const bdd = DefineDB();
        const query = `INSERT INTO planning (??) VALUES (?);`;
        const values = [ExtractJSON(req.body.json,true),
                        ExtractJSON(req.body.json,false)];
        const request = bdd.format(query, values);
        console.log(request);
        connection.query(request, function(err, rows){
            if (err){res.json({"Error":true, "Message":"Probleme interne"})}
            else(res.json({"Error":false}));
        });
    });
    
    router.post("/print_planning", function(req, res) {
        const bdd = DefineDB();
        const query = `SELECT * FROM planning WHERE (client=?);`;
        const values = [ExtractJSON(req.body.json, true),
                        ExtractJSON(req.body.json, false)];
        const request = bdd.format(query, values[1]);
        console.log(request);
        connection.query(request, function(err, rows){
            if (err){res.json({"Error":true, "clients":-1})}
            else{
                var count = 0;
                const size = rows.length;
                const planning = {}
                while (count < size) {
                    var row_ = {
                        date : rows[count].date,
                        heure : rows[count].heure,
                        temps : rows[count].temps,
                        coach : rows[count].coach
                    };
                    planning[count] = row_;
                    count++;
                }
                res.json({"Error":false, "content":planning});
            }
        });
    });
    
    connection.release();
};


module.exports = REST_ROUTER;
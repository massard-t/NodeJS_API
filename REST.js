var mysql = require("mysql");
var md5 = require("md5");


function ExtractJSON(content_json, fields) {
    const parsed_data = JSON.parse(content_json);
    if (parsed_data === 'undefined')
        return (false);
    var res_array = [];
    if (fields){
        for (var field in parsed_data){
            res_array.push(field);
        }
    } else{
            for (var field in parsed_data){
                if (field == 'id'){
                    res_array.push(parsed_data[field]);
                }
                else if (field =='mdp' || field == 'password'){
                    `'`+res_array.push(md5(parsed_data[field]))+`'`;
                }
                else{
                    res_array.push(parsed_data[field]);
                }
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
    bdd.query(request, function(err, rows) {
        if (err){
            throw err;
        }
        else {
            console.log("Not a single error");
        }
    });
    bdd.end();
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
    const request = bdd.format(query, values[1]);
    console.log(request);
    return;
}

function ErrorJson(err) {
    return ({
        "Error":true,
        "Message":`Error executing MySQL query: ${err}`
    });
}

REST_ROUTER.prototype.handleRoutes = function(router,connection,md5) {
    router.get("/",function(req,res) {
        res.json({
            "Error":false,
            "Message" : "API ASPTT Online"
        });
    });

    router.post("/newrel", function(req, res) {
        const bdd = DefineDB();
        const values = [ExtractJSON(req.body.json,true),
                        ExtractJSON(req.body.json,false)];
        const query = `INSERT INTO relations (??) VALUES (?);`;
        const request = bdd.format(query, values);
        console.log(request);
        connection.query(request, function(err, rows) {
            if (err){
                res.json({
                    "Error":true,
                    "Message":"Probleme interne"
                });
            }
            else {
                res.json({
                    "Error":false,
                    "Message":"Nouvelle relation"
                });
            }
        });
    });
    
    router.post("/info_coach", function(req, res) {
        const bdd = DefineDB();
        const values = [ExtractJSON(req.body.json, true),
                        ExtractJSON(req.body.json, false)];
        var nb_clients;
        const query_clients = `SELECT * FROM relations WHERE (coach=?);`;
        const req_clients = bdd.format(query_clients, values[1]);
        console.log(req_clients);
        connection.query(req_clients, function(err, rows) {
            if (err){
                res.json({
                    "Error":true,
                    "Message":err
                });
            } else{
                nb_clients = rows.length;
                const query_planning = `SELECT * FROM planning WHERE (coach=?);`;
                const req_planning = bdd.format(query_planning, values[1]);
                connection.query(req_planning, function(err, rows) {
                    if (err){
                        res.json({
                            "Error":true,
                            "Message":err
                        });
                    }
                   else{
                       res.json({
                           "clients":nb_clients,
                           "seances":rows.length
                       });
                   }
                });
            }
        });
    });
    
    router.post("/reponseQuestion", function(req, res) {
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
            res.json({
                "Error":true,
                "Message":err
            });
            error = true;
        }
        console.log(values);
        if (!error){
            res.json({
                "Error":false,
                "Message":"Ajout reponses ok"
            });
        }
    });
    
    router.post("/add", function(req, res) {
        const bdd = DefineDB();
        var table;
        console.log(req.body.json);
        const values = [ExtractJSON(req.body.json,true),
                        ExtractJSON(req.body.json,false)];
        const rolepos = values[0].indexOf('role');
        if ((values[1][rolepos]) !== undefined){
            table = (parseInt((values[1][rolepos]).replace('\'', ''),
                        10) == 1) ? 'coach' : 'client';
            values[0].pop(rolepos);
            values[1].pop(rolepos);
        } else{
            table = 'client';
        }
        const query = `INSERT INTO ${table} (??${table == 'client' ? ',new':''}) VALUES (?${table == 'client' ? ',0':''});`;
        const request = bdd.format(query, values);
        console.log(request);
        connection.query(request, function(err,rows) {
            if(err){
                res.json(ErrorJson(err));
            }
            else{
                if (values[1][values[0].indexOf('coach')]){
                    const query_rel = `INSERT INTO relations (coach, client) VALUES (?, ?)`;
                    const requ_rel = DefineDB().format(query_rel,
                                     [values[1][values[0].indexOf('coach')],
                                      values[1][values[0].indexOf('email')]]);
                    console.log(requ_rel);
                    connection.query(requ_rel, function(err, rows) {
                        if (err){
                            res.json({
                                "Error":true,
                                "Message":err
                            });
                        }
                        else{
                            res.json({
                                "Error":false,
                                "Message":"Not a single error"
                            });
                        }
                    });
                } else{
                    res.json({
                        "Error" : false,
                        "Message" : "User Added !"
                    });
                }
            }
        });
    });


    router.post("/connect", function(req, res) {
        const bdd = DefineDB();
        const query = `SELECT * FROM users WHERE (email=? and password=?);`;
        const values = [ExtractJSON(req.body.json,true),
                        ExtractJSON(req.body.json,false)];
        const request = bdd.format(query, values[1]);
        connection.query(request, function(err, rows) {
            if (err){
                res.json(ErrorJson(err));
            } else{
                const items = Object.keys(rows).length;
                if (items < 1){
                    res.json({
                        "Error": true,
                        "Message": "No such user",
                        "role":-1
                    });
                } else{
                    var role = rows[0].role;
                    if (role == 0) { // CLIENT ( + requete coach)
                        const bdd = DefineDB();
                        const query_coach = `SELECT * FROM relations WHERE (client=?);`;
                        const request_coach = bdd.format(query_coach, values[1]);
                        console.log("REQUEST COACH : " + request_coach);
                        connection.query(request_coach, function(err, rows) {
                            if (err){
                                res.json({
                                    "Error": true,
                                    "Message":err
                                });
                            } else{
                                res.json({
                                    "Error": false,
                                    "Message": "OK",
                                    "role":role,
                                    "coach": rows.length > 0 ? rows[0].coach : "0"
                                });
                            }
                        });
                    } else { // COACH
                        res.json({
                            "Error": false,
                            "Message": "OK",
                            "role":role
                        });
                    }
                }
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
        connection.query(request, function(err, rows) {
            if (err){
                res.json({
                    "Error":true,
                    "clients":-1
                });
            } else{
                var clients_id = [];
                for (var row in rows){
                    clients_id.push(rows[row]);
                }
                res.json({
                    "Error":false,
                    "clients":clients_id
                });
            }
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
            if (err){
                res.json({
                    "Error":true,
                    "Message":"Something went wrong"
                });
            } else{
                var client_info = [];
                console.log(rows[0]);
                const row = rows[0];
                res.json({
                    "email":row.email,
                    "nom":row.nom,
                    "prenom":row.prenom,
                    "phone":row.phone,
                    "taille":row.taille,
                    "poids":row.poids
                });
                for (var element in rows[0]){
                    client_info[element] = rows[0].element;
                }
                console.log(client_info);
            }
        });
    });
    
    router.post("/planning", function(req, res) {
        const bdd = DefineDB();
        const query = `INSERT INTO planning (??) VALUES (?);`;
        const values = [ExtractJSON(req.body.json,true),
                        ExtractJSON(req.body.json,false)];
        const request = bdd.format(query, values);
        console.log(request);
        connection.query(request, function(err, rows){
            if (err){
                res.json({
                    "Error":true,
                    "Message":"Probleme interne"
                });
            } else{
                res.json({
                    "Error":false,
                    "Message":"Success"
                });
            }
        });
    });
    
    router.post("/print_planningcoach", function(req, res){
        const bdd = DefineDB();
        const query = `SELECT * FROM planning WHERE (coach=?);`;
        const values = [ExtractJSON(req.body.json, true),
                        ExtractJSON(req.body.json, false)];
        const request = bdd.format(query, values[1]);
        console.log(request);
        connection.query(request, function(err, rows){
            if (err){
                res.json({
                    "Error":true,
                    "clients":-1
                });
            } else{
                var count = 0;
                const size = rows.length;
                const planning = {};
                while (count < size){
                    var row_ = [
                        rows[count].date,
                        rows[count].heure,
                        rows[count].temps,
                        rows[count].coach
                    ];
                    planning[count] = row_;
                    count++;
                }
                res.json(planning);
            }
        });
    });
    
    router.post("/print_planning", function(req, res) {
        const bdd = DefineDB();
        const query = `SELECT * FROM planning WHERE (client=?);`;
        const values = [ExtractJSON(req.body.json, true),
                        ExtractJSON(req.body.json, false)];
        const request = bdd.format(query, values[1]);
        console.log(request);
        connection.query(request, function(err, rows) {
            if (err){
                res.json({
                    "Error":true,
                    "clients":-1
                });
            } else{
                var count = 0;
                const size = rows.length;
                const planning = {};
                while (count < size){
                    var row_ = [
                        rows[count].date,
                        rows[count].heure,
                        rows[count].temps,
                        rows[count].coach
                    ];
                    planning[count] = row_;
                    count++;
                }
                res.json(planning);
            }
        });
    });
    connection.release();
};

module.exports = REST_ROUTER;
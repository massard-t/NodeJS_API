var mysql = require("mysql");
var query = `INSERT INTO question (numero, intitule) VALUES (?, ?);`;
const question = {"email": "sulli@theo.com", "1": "vacation", "2": "test", "3": "test3", "4": "", "5": "something"};

function TransformJSONarrayBi(js_obj, fields) {
    console.log(js_obj)
    const parsed_data = js_obj;
    console.log("DE" + parsed_data + "FI");
    if (parsed_data === 'undefined')
        return (false);
    var res_final = [];
    for (var field in parsed_data)
    {
        if (field != "email"){
            var res_array = [];
            res_array.push(field);
            res_array.push(parsed_data[field]);
            res_final.push(res_array);
        }
    }
    return (res_final);
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

function MultipleQueries(question, client){
    var count = 0;
    var email = question.email;
    const js_obj = TransformJSONarrayBi(question);
    const query = `INSERT INTO question (numero, intitule, client) VALUES (?, ?, '${email}');`;
    console.log(js_obj);
    console.log(email);
    const size = Object.keys(js_obj).length;
    while (count < size) {
        console.log(`Passage ${count}`);
        Foreach_Add(js_obj[count], query);
        count = count + 1;
    }
}
MultipleQueries(question);
console.log("EVERYTHING WORKED FINE YAY");

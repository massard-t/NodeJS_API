function GetSelectData(connect, table, content) {
    content = content || '*';
    connect.query(`SELECT ${content} from ${table}`, function(err, rows, fields) {
      if (!err)
        console.log('The solution is: ', rows);
      else
        console.log('Error while performing Query.');
    });
    return (connect);
}

function LoginIsConform(data_received) {
    if (!(data_received))
        return (false);
    ExtractJSON(data_received, 1);
    return; // !!
    const parsed_data = JSON.parse(data_received);
    return; // !!
    if (parsed_data === 'undefined')
        return (false);
    var concat = "(";
    for (var field in parsed_data)
    {
        if (typeof(parsed_data[field]) == 'string') {
            if (field == 'password' || field == 'email')
                concat += `\`` + md5(parsed_data[field]) + `\`,`;
            else
                concat += `\`` + parsed_data[field] + `\`,`;
        }
        else
            concat += parsed_data[field] + `,`;
    }
    concat = concat.slice(0, -1) + `)`;
    console.log(concat + '\ndone, starting to add');
    return (concat);
}






function ExtractJSON(content_json, fields) {
    fields = fields || false;
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
    }
    console.log(res_array + "\nfin extractJSON");
    return (res_array.join(`,`))
}






function AddData(connect, table, content) {
    content = content || false;
    return true;
    if (!content)
        return false;
    const request = `INSERT INTO ${table} (${content[0]}) VALUES (${content[1]});`;
    console.log(request);
    connect.query(request, function(err, rows, fields) {
      if (!err)
        console.log('The solution is: ', rows);
      else
        console.log('Error while performing Query.');
    });
}


const express    = require('express');
const mysql      = require('mysql');
const md5        = require('md5');
var string_to_test = "{\"email\":\"bob@test.com\", \"id\": 8,\"nom\":\"monsi";
string_to_test += "eurtest\", \"password\":\"123456\",\"prenom\":\"pat\"}";
const connection = mysql.createConnection({
  host     : '0.0.0.0',
  user     : 'node',
  password : 'nodejs',
  database : 'asptt'
});

//console.log(string_to_test);
var test;
if ((test = LoginIsConform(string_to_test)))
{
    if (AddData(connection, `coach`, test))
        console.log("everything ok");
    else
        console.log("Failed");
}

console.log("fin");
connection.connect();
/*const result = GetSelectData(connection, "client", "id");
const app = express();*/
connection.end();

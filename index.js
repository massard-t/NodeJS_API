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
    const parsed_data = JSON.parse(data_received);
    if (parsed_data === 'undefined')
        return (false);
    console.log(parsed_data);
    var concat = "(";
    for (var field in parsed_data)
    {
        console.log(field + ' : ' +parsed_data[field]);
        if (typeof(parsed_data[field]) == 'string') 
            concat += `\`` + parsed_data[field] + `\`,`;
        else
            concat += parsed_data[field] + `,`;
    }
    concat = concat.slice(0, -1) + `)`;
    console.log(concat);
}

function AddData(connect, table, content) {
    content = content || false;
    if (!content)
        return false;
    connect.query(`INSERT INTO ${table} VALUES `);
}

const string_to_test = "{\"email\":\"bob@test.com\",\"password\":\"123456\", \"id\": 8}";
console.log(string_to_test);
LoginIsConform(string_to_test);

const express    = require('express');
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : '0.0.0.0',
  user     : 'node',
  password : 'nodejs',
  database : 'asptt'
});




console.log("fin");
connection.connect();
/*const result = GetSelectData(connection, "client", "id");
const app = express();*/
connection.end();

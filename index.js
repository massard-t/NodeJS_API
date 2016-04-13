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
    console.log(parsed_data);
    for (var field in parsed_data)
    {
        console.log(field + ' : ' +parsed_data[field]);
    }
}

function AddData(connect, table, content) {
    content = content || false;
    if (!content)
        return false;
    connect.query(`INSERT INTO ${table} VALUE `);
}

const string_to_test = "{\"login\":\"bob\",\"password\":\"123456\", \"id\": 8}";
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

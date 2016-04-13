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

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : '0.0.0.0',
  user     : 'node',
  password : 'nodejs',
  database : 'asptt'
});
console.log("test");
connection.connect();
const result = GetSelectData(connection, "client", "id");
connection.end();
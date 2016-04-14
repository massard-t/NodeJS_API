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
                res_array.push(`'`+parsed_data[field]+`'`);
            }
    }
    console.log(res_array.join(`,`) + "\nfin extractJSON");
    return (res_array.join(`,`));
}






function AddData(connect, table, content) {
    content = content || false;
    if (!content)
        return false;
    const request = `INSERT INTO ${table} (${content[0]}) VALUES (${content[1]});`;
    console.log(request);
    connect.query(request, function(err, rows, fields) {
        if (err) throw err;
      if (!err)
        console.log('The solution is: ', rows);
      else
        console.log('Error while performing Query.');
    });
}



const mysql      = require('mysql');
const md5        = require('md5');
/*const id         = 10;
var string_to_test = `{\"email\":\"bob@test.com\", \"id\": ${id},\"nom\":\"monsi`;
string_to_test += "eurtest\", \"passwd\":\"123456\",\"prenom\":\"pat\"}";*/


//console.log(string_to_test);

/*const ee = [ExtractJSON(string_to_test, true),ExtractJSON(string_to_test, false)];
console.log(ee[0]);
console.log(ee[1]);
*/

function DefineDB() {
    const connection = mysql.createConnection({
        host     : '0.0.0.0',
        user     : 'robotbobtm',
        database : 'asptt'
    });
    connection.connect();
    return (connection);
}

function AddUser(req, res, next) {
    const requested_data = [ExtractJSON(req, true),ExtractJSON(req, false)];
    const connection = DefineDB();
    try {
        if (AddData(connection, `coach`, requested_data)) {
            res.status(200).json({
                status: "success",
                message: "User added"
            });
            connection.end();
        }
        else
            console.log("Failed");
    } catch (e) {
        connection.end();
        res.status(100).json({
            status: "error",
            message: "Something went wrong"
        });
        console.log(`error ${e}`);
    }
    console.log("fin");
}

/*const result = GetSelectData(connection, "client", "id");
const app = express();
connection.end();
*/
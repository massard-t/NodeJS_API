const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const md5 = require('md5');
const rest = require("./REST.js");
const app = express();

function REST(){
    const self = this;
    self.connectMysql();
}

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'robotbobtm',
        password : '',
        database : 'asptt',
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
};

REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,connection,md5);
      self.startServer();
};


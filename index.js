var express = require('express');
var router = express.Router();
var db = require('./requests');

router.get('/Node_Api/adduser', db.Adduser);
module.exports = router;

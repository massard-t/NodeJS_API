var express = require('express');
var router = express.Router();

var db = require('./requests');


router.get('/Node_Api/adduser', db.Adduser);
/*router.get('/Node_Api/puppies/:id', db.getSinglePuppy);
router.post('/Node_Api/puppies', db.createPuppy);
router.put('/Node_Api/puppies/:id', db.updatePuppy);
router.delete('/Node_Api/puppies/:id', db.removePuppy);
*/

module.exports = router;

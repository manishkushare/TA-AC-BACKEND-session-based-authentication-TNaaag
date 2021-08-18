var express = require('express');
var router = express.Router();
const cookieParser = require('cookie-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('username', 'Manish');
  res.send(req.cookies);
});


module.exports = router;

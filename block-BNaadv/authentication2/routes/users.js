var express = require('express');
var router = express.Router();
var User = require('../models/User');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user');
});

router.get('/register', async (req,res,next)=> {
  try{
    res.render('register');
  }
  catch(err){
    next(err);
  }
});

router.post('/register', async (req,res,next)=> {
  try {
    let user = await User.create(req.body);
  } catch (error) {
    return next(error);
  }
})

module.exports = router;

var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register',async (req,res,next)=>{
    res.render('register');
})
router.post('/register', async (req,res,next)=> {
  console.log(req.body);
  try{
    const user = await User.create(req.body);
    console.log(user);
    res.render('login');
  }
  catch(err){
    next(err)
  }
})


module.exports = router;

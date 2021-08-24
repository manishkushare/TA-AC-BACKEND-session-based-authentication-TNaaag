var express = require('express');
var router = express.Router();
const User = require('../models/Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('user');
});
router.get('/register', async (req,res,next)=> {
  res.render('registration');
})

router.post('/register', async (req,res,next)=> {
  try{
    console.log(req.body);
    const user = await User.create(req.body);
    res.redirect('/users/login');
  }   
  catch(err){
    return next(err);
  }
});

router.get('/login', async (req,res,next)=> {
  try{
    console.log(req.session);
    const info = req.flash('info')[0];
    res.render('login',{info});
  }
  catch(err){
    return next(err);
  }
});

router.post('/login', async (req,res,next)=> {
  try{
    const {email,password} = req.body;
    if(!email || !password){
      req.flash('info','Email/Password required');
      return res.redirect('/users/login');
    }
    const user = await User.findOne({email});
    if(!user){
      req.flash('info','Email is not registered');
      return res.redirect('/users/login');
    }
    const result = await user.verifyPassword(password);
    if(!result){
      req.flash('info','Password is in-correct');
      return res.redirect('/users/login');
    }
    // create session
    req.session.userId = user.id;
    res.redirect('/users')
  }
  catch(err){
    return next(err);
  }
});

router.get('/logout', async (req,res,next)=> {
  try{
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/users/login');
  }
  catch(err){
    return next(err);
  }
});



module.exports = router;

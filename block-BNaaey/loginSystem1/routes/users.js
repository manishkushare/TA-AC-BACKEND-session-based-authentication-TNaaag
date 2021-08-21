var express = require('express');
var router = express.Router();
const User = require('../models/User');
/* GET users listing. */
router.get('/',async (req,res,next)=> {
  console.log(req.session);
  res.render('user')
});

router.get('/register',async (req,res,next)=> {
  try{
    res.render('register');
  }
  catch(err){
    return next(err);
  }
})

router.post('/register', async(req,res,next)=> {
  try {
    const user = await User.create(req.body);
    res.redirect('/users/login');
  }
  catch(err){
    return next(err);
  }
});

router.get('/login',async (req,res,next)=> {
  try{
    res.render('login');
  }
  catch(err){
    return next(err);
  }
});

router.post('/login', async (req,res,next)=> {
  try{
    const {email,password} = req.body;
    if(!email || !password){
      return res.redirect('/users/login');
    }
    else {
      const user = await User.findOne({email});
      if(!user){
        return res.redirect('/users/login');
      }
      else{
        const isVerified = await user.verifyPassword(password);
        console.log(isVerified);
        if(!isVerified){
          return res.redirect('/users/login');
        }
        req.session.userId = user.id;
        return res.redirect('/users');
      }
    }
  }
  catch(err){
    return next(err);
  }
})



module.exports = router;

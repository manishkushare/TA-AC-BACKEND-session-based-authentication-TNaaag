var express = require('express');
var router = express.Router();
var User = require('../models/User');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user');
});

router.get('/register', async (req,res,next)=> {
  try {
    res.render('register');
  } catch (error) {
    return next(error);
  }
});

router.post('/register', async (req,res,next)=> {
  try {
    const user = await User.create(req.body);
    res.render('login');
  } catch (error) {
    return next(error);
  }
});

router.get('/login', async (req,res,next)=> {
  try {
    res.render('login');
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req,res,next)=>{
  try {
    const {email,password} = req.body;
    if(!password || !email){
      req.flash('error', 'email/password required');
      return res.redirect('/users/login');
    }
    const user = await User.findOne({email});
    if(!user){
      req.flash('error', 'email is not registered');
      return res.redirect('/users/login');
    }
    const verify = await user.verifyPassword(password);
    if(!verify){
      req.flash('error', 'Incorrect Password');
      return res.redirect('/users/login');
    }
    req.session.userId =user.id;
    res.redirect('/users');



  } catch (error) {
    return next(error);
  }
});

router.get('/logout', async (req,res,next)=> {
  try {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/users/login');    
  } catch (error) {
    return next(error);
  }
})



module.exports = router;

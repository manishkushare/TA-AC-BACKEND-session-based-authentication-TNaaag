var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Product = require('../models/Product');
var Comment = require('../models/Comment');

/* GET users listing. */
router.get('/', async (req,res,next)=>{
  try {
    const userId = req.session.userId;
    if(userId){
      const user = await User.findById(userId);
      const products = await Product.find({});
      res.render('userDashboard',{user,products});
    }else {
      res.redirect('/users/login');
    }
  } catch (error) {
    return next(error);
  }
})


router.get('/register', async (req,res,next)=> {
  try {
    const info = req.flash('info')[0];
    console.log(info);
    res.render('createUserForm', {info}); 
  } catch (error) {
    return next(error)
  }
})

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
    const info =  req.flash('info')[0];
    console.log(info);
    res.render('login', {info});
    
  } catch (error) {
    return next(error);
  }
});



router.post('/login', async (req,res,next)=> {
  try {
    const {email , password} = req.body;
    if(!email || !password){
      req.flash('info', "Email and Password requried");
      res.redirect('/users/login');
    }
    const user = await User.findOne({email});
    if(!user){
      req.flash('info', "Email is not registered, Please register and then try!!");
      res.redirect('/users/register');
    }
    const isPasswordVerified = await user.verifyPassword(password);
    if(!isPasswordVerified){
      req.flash('info', "Password is In-Correct !!");
      res.redirect('/users/login');
    }
    req.session.userId = user.id;
    res.redirect('/isAdmin');

  } catch (error) {
    return next(error);
  }
})

router.get('/logout', async (req,res,next)=> {
  try {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/users/login');
  } catch (error) {
    return next(error);
  }
});

router.get('/mylikes', async (req,res,next)=> {
  try {
    const userId = req.session.userId;
    if(userId){
      const user = await User.findById(userId).populate('likedProduct');
      res.render('mylikes',{user});
    }else{
      return res.redirect('/users/login');
    }
  } catch (error) {
    return next(error);
  }
});

router.get('/myCart', async (req,res,next)=> {
  try {
    const userId = req.session.userId;
    if(userId){
      const user = await User.findById(userId).populate('cart');
      console.log(user);
      res.render('myCart',{user});
    }else{
      return res.redirect('/users/login');
    }
  } catch (error) {
    return next(error);
  }
});



router.get('/:id/likes', async (req,res,next)=> {
  try {
    const id = req.params.id;
    const userId = req.session.userId;
    const user = await User.findByIdAndUpdate(userId,{$push : {likedProduct : id}});
    const product = await Product.findByIdAndUpdate(id, {$inc : {likes_of_product : 1,dislikes_of_product : -1}});
    return res.redirect('/users/'+ id);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id/dislike', async (req,res,next)=> {
  try {
    const id = req.params.id;
    const userId = req.session.userId;
    const user = await User.findByIdAndUpdate(userId,{$pull : {likedProduct : id}});
    const product = await Product.findByIdAndUpdate
    (id, {$inc : {dislikes_of_product : 1, likes_of_product: -1}});
    return res.redirect('/users/'+ id);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id/addtocart', async(req,res,next)=> {
  try {
    const id = req.params.id;
    const userId = req.session.userId;
    if(userId){
      const user = await User.findByIdAndUpdate(userId, {$push: {cart : id}});
      res.redirect('/users/myCart');
    }else{
      return res.redirect('/users/login');
    }
  } catch (error) {
    return next(error);
  }
});

router.get('/:id/removeFromCart', async (req,res,next)=> {
  try {
    const id = req.params.id;
    const userId = req.session.userId;
    const user = await User.findById(userId).populate('cart').updateOne({$pull : {cart: id}});
    console.log(user);
    res.redirect('/users/myCart');
  } catch (error) {
    return next(error);
  }
})


router.get('/:id', async (req,res,next)=> {
  try {
    const userId = req.session.userId;
    if(userId){
      const id = req.params.id;
      const user = await User.findById(userId);
      const product = await Product.findById(id).populate('comments_of_product');
      res.render('userDashboardSingleProduct', {user,product});
    }else {
      return res.redirect('/users/login');
    }
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/comment' , async(req,res,next)=> {
  try { 
    const id = req.params.id;
    const userId = req.session.userId;
    if(userId){
      const user = await User.findById(userId);
      req.body.userId = userId;
      req.body.productId = id;
      req.body.author = user.name;
      const comment = await Comment.create(req.body);
      const product = await Product.findByIdAndUpdate(id,{$push : {comments_of_product: comment.id}});
      res.redirect('/users/'+ id);
    }else{
      return res.redirect('/users/login');
    }
  } catch (error) {
    return next(error);
  }
})

module.exports = router;

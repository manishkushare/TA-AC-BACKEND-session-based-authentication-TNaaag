const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const multer = require('multer');
const path = require('path');
  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,"../","public/uploads"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
})
  
const upload = multer({ storage: storage })
  


router.get('/', async (req,res,next)=> {
    try {
        console.log('welcome to admin dashboard');
        const userId = req.session.userId;
        if(userId){
            const user = await User.findById(userId);
            const products = await Product.find({});
            console.log(products);
            res.render('adminDashboard',{user, products});
        }
        else {
            res.redirect('/users/login');
        }
        
    } catch (error) {
        return next(error);
    }
});

router.get('/:id/edit', async (req,res,next)=> {
    try {
        const userId = req.session.userId;
        const id = req.params.id;
        if(userId){
            const product = await Product.findById(id);
            const user = await User.findById(userId);
            return res.render('productEditForm', {product,user});
        } else {
            return res.redirect('/users/login');
        }
    } catch (error) {
        return next(error);
    }
});
router.get('/:id/edit', async (req,res,next)=> {
    try {
        const userId = req.session.userId;
        const id = req.params.id;
        if(userId){
            const product = await Product.findById(id);
            const user = await User.findById(userId);
            return res.render('productEditForm', {product,user});
        } else {
            return res.redirect('/users/login');
        }
    } catch (error) {
        return next(error);
    }
});
router.post('/:id',upload.single('avatar_of_product') ,async (req,res,next)=> {
    try {
        req.body.avatar_of_product = req.file.filename;
        const userId = req.session.userId;
        const id = req.params.id;
        if(userId){
            const product = await Product.findByIdAndUpdate(id, req.body, {new: true});
            const user = await User.findById(userId);
            return res.redirect('/admin/' + id);
        } else {
            return res.redirect('/users/login');
        }
        
    } catch (error) {
        return next(error);
    }
})


router.get('/product/new', async (req,res,next)=> {
    try {
        res.render('createProductForm')
    } catch (error) {
        return next(error);
    }
})

router.post('/product',upload.single('avatar_of_product'), async (req,res,next)=> {
    try {
        req.body.avatar_of_product = req.file.filename;
        const product = await Product.create(req.body);
        res.redirect('/admin');
    } catch (error) {
        return next(error);
    }
});




router.get('/:id', async (req,res,next)=> {
    try {
        const userId = req.session.userId;
        if(userId){
            const id = req.params.id;
            const user = await User.findById(userId);
            const product = await Product.findById(id);
            console.log(product.id);
            res.render('adminDashboardSingleProduct', {user,product});
        }else{
            res.redirect('/users/login');
        }
        
    } catch (error) {
        return next(error);
    }
})



module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req,res,next)=> {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        if(user.isAdmin === "Admin"){
            return res.redirect('/admin');
        } else{
            return res.redirect('/users');
        }

    } catch (error) {
        return next(error);
    }

})

module.exports = router;
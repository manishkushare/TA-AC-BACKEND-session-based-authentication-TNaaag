const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
router.get('/:id/edit', async (req,res,next)=> {
    try {
        const id = req.params.id;
        const comment = await Comment.findById(id);
        res.render('editComment',{comment});
    } catch (error) {
        return next(error);
    }
})

router.get('/:id/delete', async (req,res,next)=> {
    try {
        const id = req.params.id;
        const populateComment = await Comment.findById(id);
    } catch (error) {
        return next(error);
    }
})

router.post('/:id', async (req,res,next)=> {
    try {
        const id = req.params.id;
        console.log(id);
        const updatedComment = await Comment.findByIdAndUpdate(id,req.body);
        const comment = await Comment.findById(id).populate('productId');
        res.redirect('/users/' + comment.productId.id);
    } catch (error) {
        return next(error);
    }
})

module.exports = router;
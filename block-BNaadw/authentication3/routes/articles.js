var express = require('express');
var router = express.Router();
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Slug = require('slug');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const articles = await Article.find({});
        res.render('allArticles', {articles});
    } catch (error) {
        return next(error);
    }
});

router.get('/new', async (Req,res,next)=> {
    try {
        res.render('createArticle')
    } catch (error) {
        return netx(error);
    }
});

router.post('/', async (req,res,next)=> {
    try {
        req.body.slug = await Slug(req.body.title);
        const article = await Article.create(req.body);
        res.redirect('/articles');
    } catch (error) {
        return next(error)
    }
});

router.get('/:slug/edit',async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        const article = await Article.findOne({slug});
        console.log(article);
        res.render('editArticleForm',{article});
    } catch (error) {
     return enxt(error);   
    }
})

router.post('/:slug', async (req,res,next)=> {
    const slug = req.params.slug;
    try {
        req.body.slug = await Slug(req.body.title);
        const article = await Article.findOneAndUpdate({slug}, req.body, {new : true});
        // console.log(article ,"artcile inside post");
        // console.log(article.slug,"inside post after updadting slug");
        res.redirect('/articles/' + article.slug);
    } catch (error) {
        return next(error);
    }
});

router.get('/:slug/delete', async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        const deletedArticle = await Article.findOneAndDelete({Slug});
        const deleteComment = await Comment.deleteMany({articleId : deletedArticle.id});
        res.redirect('/articles');
    } catch (error) {
        return next(error);
    }
})

router.get('/:slug', async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        // console.log(slug, "insdie get ");
        const article =await Article.findOne({slug}).populate('comments')
        // console.log(article, "Artcile inside get");
        res.render('article', {article});
    } catch (error) {
        return next(error);
    }
})


router.get('/:slug/likes/increment', async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        const article = await Article.findOneAndUpdate({slug}, {$inc : {likes : 1}}, {new : true});
        res.redirect('/articles/' + slug)
    } catch (error) {
        return next(error);
    }
})

router.get('/:slug/likes/decrement', async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        const article = await Article.findOneAndUpdate({slug}, {$inc : {likes : -1}}, {new : true});
        res.redirect('/articles/'+ slug)
    } catch (error) {
        return next(error);
    }
});

router.post('/:slug/comment', async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        const article = await Article.findOne({slug});
        req.body.articleId =   article.id;
        const comment = await Comment.create(req.body);
        const updatedArticle = await Article.findByIdAndUpdate(article.id, {$push : {comments : comment.id}})
        res.redirect('/articles/' + slug);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;

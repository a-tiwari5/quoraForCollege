const express = require('express')
const router = express.Router();
const expressError = require('../utilities/expressError')
const { catchAsync } = require('../utilities/catchAsync')
const Post = require('../models/posts')
const { isLoggedIn, postValidation, isAuthor } = require('../middlewares')



//INDEX PAGE
router.get('/', catchAsync(async (req, res) => {
    const posts = await Post.find()
    res.render('posts/index', { posts })
}))


//NEW PAGE
router.get('/new', isLoggedIn, (req, res) => {
    res.render('posts/new')
})

router.post('/', isLoggedIn, postValidation, catchAsync(async (req, res, next) => {
    const post = new Post(req.body.post)
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Added a new Question!')
    res.redirect('/posts')
}))

//SHOW PAGE

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('comments').populate('author')
    if (!post) {
        req.flash('error', 'Post Not Found!')
        return res.redirect('/posts')
    }
    res.render('posts/show', { post })
}))


//EDIT POST

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Post Not Found!')
        return res.redirect('/posts')
    }
    res.render('posts/edit', { post })
}))

router.put('/:id', isLoggedIn, postValidation, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { post } = req.body;
    await Post.findByIdAndUpdate(id, post)
    req.flash('success', 'Successfully Updated Your Question!')
    res.redirect(`/posts/${id}`)
}))


//DELETE

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted your Question!')
    res.redirect('/posts')
}))

module.exports = router;

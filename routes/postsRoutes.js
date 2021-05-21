const express = require('express')
const router = express.Router();
const expressError = require('../utilities/expressError')
const { catchAsync } = require('../utilities/catchAsync')
const Post = require('../models/posts')
const { postSchema } = require('../schemas')



const postValidation = async (req, res, next) => {
    const { error } = await postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new expressError(401, msg))

    } else {
        next();
    }

}

//INDEX PAGE
router.get('/', catchAsync(async (req, res) => {
    const posts = await Post.find()
    res.render('posts/index', { posts })
}))


//NEW PAGE
router.get('/new', (req, res) => {
    res.render('posts/new')
})

router.post('/', postValidation, catchAsync(async (req, res, next) => {
    const post = new Post(req.body.post)
    await post.save();
    res.redirect('/posts')
}))

//SHOW PAGE

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('comments')
    res.render('posts/show', { post })
}))


//EDIT POST

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render('posts/edit', { post })
}))

router.put('/:id', postValidation, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { post } = req.body;
    await Post.findByIdAndUpdate(id, post)
    res.redirect(`/posts/${id}`)
}))


//DELETE

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    res.redirect('/posts')
}))

module.exports = router;

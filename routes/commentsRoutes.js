const express = require('express')
const router = express.Router({ mergeParams: true });
const Post = require('../models/posts')
const Comment = require('../models/comments')
const { catchAsync } = require('../utilities/catchAsync')
const expressError = require('../utilities/expressError')
const { commentSchema } = require('../schemas')


const validateComment = async (req, res, next) => {
    const comment = commentSchema.validate(req.body)
    if (comment) {
        const msg = error.details.map(el => el.message).join(',')
        next(new expressError(400, msg))
    }
    else { next() }
}


//COMMENTS

// POST COMMENTS
router.post('/', catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('comments');
    const comment = await Comment.create(req.body.comment)
    post.comments.push(comment._id)
    await post.save()
    req.flash('success', 'Successfully Added A Comment!')
    res.redirect(`/posts/${post._id}`)
}))


//DELETE COMMENTS
router.delete('/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId)
    res.redirect(`/posts/${id}`)
}))

module.exports = router
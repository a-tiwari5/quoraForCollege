const express = require('express')
const router = express.Router({ mergeParams: true });
const Post = require('../models/posts')
const Comment = require('../models/comments')
const { catchAsync } = require('../utilities/catchAsync')
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middlewares')




//COMMENTS

// POST COMMENTS
router.post('/', isLoggedIn, validateComment, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('comments');
    const comment = await Comment.create(req.body.comment)
    post.comments.unshift(comment._id)
    comment.author = req.user._id
    await comment.save()
    await post.save()
    req.flash('success', 'Successfully Added A Comment!')
    res.redirect(`/posts/${post._id}`)
}))


//DELETE COMMENTS
router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => {
    const { id, commentId } = req.params
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId)
    res.redirect(`/posts/${id}`)
}))

module.exports = router
const Comment = require('../models/comments')
const Post = require('../models/posts')



module.exports.createComment = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('comments');
    const comment = await Comment.create(req.body.comment)
    post.comments.unshift(comment._id)
    comment.author = req.user._id
    await comment.save()
    await post.save()
    req.flash('success', 'Successfully Added A Comment!')
    res.redirect(`/posts/${post._id}`)
}

module.exports.destroyComment = async (req, res) => {
    console.log('In comment route')
    const { id, commentId } = req.params
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId)
    res.redirect(`/posts/${id}`)
}
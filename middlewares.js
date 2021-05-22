const expressError = require('./utilities/expressError')
const { commentSchema } = require('./schemas')
const { postSchema } = require('./schemas')
const Post = require('./models/posts')
const Comment = require('./models/comments')
module.exports.isLoggedIn = ((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must Login first!')
        return res.redirect('/login')
    }
    next();
})


module.exports.validateComment = async (req, res, next) => {
    const { error } = commentSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new expressError(400, msg))
    }
    else { next() }
}

module.exports.postValidation = async (req, res, next) => {
    const { error } = await postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new expressError(401, msg))

    } else {
        next();
    }

}


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You are not autorized to do this')
        return res.redirect(`/posts/${id}`)
    }
    next();
}


module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params
    const comment = await Comment.findById(commentId)
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to delete this comment!')
        return res.redirect(`/posts/${id}`)
    }
    next();
}
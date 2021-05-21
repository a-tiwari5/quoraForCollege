const expressError = require('./utilities/expressError')
const { commentSchema } = require('./schemas')
const { postSchema } = require('./schemas')
const Post = require('./models/posts')

module.exports.isLoggedIn = ((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Login first!')
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

const Post = require('../models/posts')


module.exports.index = async (req, res) => {
    const posts = await Post.find()
    res.render('posts/index', { posts })
}

module.exports.renderNewForm = (req, res) => {
    res.render('posts/new')
}

module.exports.createPost = async (req, res, next) => {
    const post = new Post(req.body.post)
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Added a new Question!')
    res.redirect('/posts')
}

module.exports.showPost = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!post) {
        req.flash('error', 'Post Not Found!')
        return res.redirect('/posts')
    }
    res.render('posts/show', { post })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Post Not Found!')
        return res.redirect('/posts')
    }
    res.render('posts/edit', { post })
}

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { post } = req.body;
    await Post.findByIdAndUpdate(id, post)
    req.flash('success', 'Successfully Updated Your Question!')
    res.redirect(`/posts/${id}`)
}


module.exports.destroyPost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted your Question!')
    res.redirect('/posts')
}
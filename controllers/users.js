const User = require('../models/users')

module.exports.registerUser = (req, res) => {
    res.render('users/register')
}

module.exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({
            username, email
        })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) return next(err)
            req.flash('success', 'Welcome to QuoraForCollege')
            res.redirect('/posts')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', `Welcome Back! ${req.user.username} `)
    const redirectUrl = req.session.returnTo || '/posts'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Logged You Out!')
    res.redirect('/posts')
}
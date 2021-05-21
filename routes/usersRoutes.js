const express = require('express')
const passport = require('passport')
const { isLoggedIn } = require('../middlewares')
const router = express.Router()
const User = require('../models/users')
const { catchAsync } = require('../utilities/catchAsync')
// const expressError = require('../utilities/expressError')
router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
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
}))


router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Welcome Back! ${req.user.username} `)
    const redirectUrl = req.session.returnTo || '/posts'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})


router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Logged You Out!')
    res.redirect('/posts')
})



module.exports = router
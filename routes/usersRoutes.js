const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/users')
const { catchAsync } = require('../utilities/catchAsync')
const users = require('../controllers/users')


router.get('/register', users.registerUser)

router.post('/register', catchAsync(users.createUser))


router.get('/login', users.renderLoginForm)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)


router.get('/logout', users.logout)



module.exports = router
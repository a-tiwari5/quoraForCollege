const express = require('express')
const path = require('path')
const app = express();
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const expressError = require('./utilities/expressError');
const session = require('express-session')
const flash = require('connect-flash')
const db = mongoose.connection;
const User = require('./models/users')
const passport = require('passport')
const LocalStrategy = require('passport-local')

mongoose.connect('mongodb://localhost:27017/Quora', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
db.on('error', console.error.bind(console, 'CONNECTION PROBLEM'))
db.once('open', () => {
    console.log("CONNECTED TO THE DATABASE")
})
const postRoutes = require('./routes/postsRoutes')
const commentRoutes = require('./routes/commentsRoutes')
const userRoutes = require('./routes/usersRoutes')

app.engine('ejs', ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: "thisisnotagudsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        HttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.send('WHAT THE FUCK IS DIS?')
})


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next();
})

app.use('/', userRoutes)
app.use('/posts', postRoutes)
app.use('/posts/:id/comments', commentRoutes)

app.all('*', (req, res, next) => {
    next(new expressError(404, 'Page Not Found'))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('SERVING TO PORT 3000!')
})
const express = require('express')
const router = express.Router();
const { catchAsync } = require('../utilities/catchAsync')
const { isLoggedIn, postValidation, isAuthor } = require('../middlewares');
const posts = require('../controllers/posts')


router.route('/')
    .get(catchAsync(posts.index))
    .post(isLoggedIn, postValidation, catchAsync(posts.createPost))


router.get('/new', isLoggedIn, posts.renderNewForm)


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.renderEditForm))

router.route('/:id')
    .get(catchAsync(posts.showPost))
    .put(isLoggedIn, postValidation, isAuthor, catchAsync(posts.updatePost))
    .delete(isLoggedIn, isAuthor, catchAsync(posts.destroyPost))

module.exports = router;

const express = require('express')
const router = express.Router({ mergeParams: true });
const { catchAsync } = require('../utilities/catchAsync')
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middlewares')
const comments = require('../controllers/comments')


//COMMENTS

// POST COMMENTS
router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment))


//DELETE COMMENTS
router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.destroyComment))

module.exports = router
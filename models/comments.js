const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body:
    {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: {
        type: Number
    },
    dislikes: {
        type: Number
    }

}, { timestamps: true })


module.exports = mongoose.model('Comment', commentSchema)


const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Comment = require('./comments')

const postSchema = new Schema({
    question: {
        type: String,
        required: [true, 'question is required']
    },
    subject: {
        type: String,
        required: [true, 'subject is required']
    },
    body: {
        type: String,
    },
    image: {
        type: String,
    },
    upVotes: {
        type: Number
    },
    downVotes: {
        type: Number
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

postSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})


module.exports = mongoose.model('Post', postSchema)
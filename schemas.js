const joi = require('joi')

module.exports.postSchema = joi.object({
    post: joi.object({
        question: joi.string().required(),
        subject: joi.string().required(),
        image: joi.string().required(),
        body: joi.string().required(),
    }).required()
})

module.exports.commentSchema = joi.object({
    comment: joi.object({
        body: joi.string().required()
    }).required()
})
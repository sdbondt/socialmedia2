const mongoose = require('mongoose')
const { Schema, model } = mongoose

const CommentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'You must add some content.'],
        maxLength: [140, 'Your post cannot be longer than 140 characters.'],
        trim: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'User must be provided']
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Comment must belong to a post.']
    }
}, { timestamps: true })

const Comment = model('Comment', CommentSchema)
module.exports = Comment
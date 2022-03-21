const mongoose = require('mongoose')
const { Schema, model } = mongoose

const LikeSchema = new Schema({
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

const Like = model('Like', LikeSchema)
module.exports = Like
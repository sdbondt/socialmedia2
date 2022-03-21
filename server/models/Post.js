const mongoose = require('mongoose')
const { Schema, model } = mongoose

const PostSchema = new Schema({
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
    }
}, {
    timestamps: true
})

PostSchema.pre('remove', async function (next) {
    await this.model('Comment').deleteMany({ post: this._id })
    await this.model('Like').deleteMany({ post: this._id })
    next()
})

PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false
})
  
PostSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'post',
    justOne: false
})

const Post = model('Post', PostSchema)

module.exports = Post

const mongoose = require('mongoose')
const { Schema, model } = mongoose

const FriendRequestSchema = new Schema({
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'User must be provided']
    },
    invitee: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'User must be provided']
    }
}, { timestamps: true })

const FriendRequest = model('FriendRequest', FriendRequestSchema)

module.exports = FriendRequest
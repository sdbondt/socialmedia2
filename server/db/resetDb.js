require("dotenv").config()
const Comment = require("../models/Comment")
const FriendRequest = require("../models/FriendRequest")
const Like = require("../models/Like")
const Post = require("../models/Post")
const User = require('../models/User')
const connectToDb = require('./connectDb')

connectToDb(process.env.MONGO_URI)
const resetDb = async () => {
    try {
      await User.deleteMany({})
      await Post.deleteMany({})
      await Comment.deleteMany({})
      await Like.deleteMany({})
      await FriendRequest.deleteMany({})
      console.log('Data got deleted.')
    } catch (e) {
        console.log(e)
    }
}

module.exports = resetDb
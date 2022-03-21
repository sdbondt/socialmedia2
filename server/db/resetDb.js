require("dotenv").config()
const Comment = require("../models/Comment")
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
    } catch (e) {
        console.log(e)
    }
}

module.exports = resetDb
const asyncHandler = require("../errorhandlers/asyncHandler")
const Post = require("../models/Post")
const Like = require('../models/Like')
const CustomError = require('../errorhandlers/customError')
const { StatusCodes } = require("http-status-codes")

exports.getLikes = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const post = await Post.findById(postId).populate('likes')
    if (!post) {
        throw new CustomError('No such post exists', StatusCodes.BAD_REQUEST)
    } else {
        res.status(StatusCodes.OK).json({
            data: {
                likes: post.likes
            }
        })
    }
})

exports.like = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const like = await Like.findOne({ creator: req.user._id, post: postId })

    if (!like) {
        const newLike = await Like.create({ creator: req.user._id, post: postId })
        res.status(StatusCodes.CREATED).json({
            data: {
                like: newLike,
                msg: 'add'
            }
        })
    } else {
        const removeLike = await Like.findOneAndDelete({ creator: req.user._id, post: postId })
        res.status(StatusCodes.OK).json({
            data: {
                like,
                msg: 'deleted'
            }
        })
    }
})


const asyncHandler = require("../errorhandlers/asyncHandler")
const CustomError = require('../errorhandlers/customError')
const { StatusCodes } = require('http-status-codes')
const Comment = require("../models/Comment")

exports.createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const { content } = req.body
    console.log('post '+postId)
    if (!content) {
        throw new CustomError('You must add some content.', StatusCodes.BAD_REQUEST)
    }

    req.body.creator = req.user._id
    req.body.post = postId
    const comment = await Comment.create(req.body)
    res.status(StatusCodes.CREATED).json({
        data: {
            comment
        }
    })
    
})

exports.getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const comments = await Comment.find({ post: postId })
    res.status(StatusCodes.OK).json({
        data: {
            comments
        }
    })
})

exports.updateComment = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params
    const { content } = req.body

    if (!content) {
        throw new CustomError('You must add some content.', StatusCodes.BAD_REQUEST)
    }

    const comment = await Comment.findOneAndUpdate({ post: postId, creator: req.user._id, _id: commentId }, req.body, { new: true, runValidators: true })
    if (!comment) {
        throw new CustomError('No such comment has been found', StatusCodes.BAD_REQUEST)
    } else {
        res.status(StatusCodes.OK).json({
            data: {
                comment
            }
        })
    }
})

exports.deleteComment = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params
    const comment = await Comment.findOneAndDelete({ _id: commentId, creator: req.user._id, post: postId })
    
    if (!comment) {
        throw new CustomError('No such comment has been found', StatusCodes.BAD_REQUEST)
    } else {
        res.status(StatusCodes.ACCEPTED).json({
            data: {
                comment
            }
        })
    }
})
const asyncHandler = require("../errorhandlers/asyncHandler")
const CustomError = require('../errorhandlers/customError')
const { StatusCodes } = require('http-status-codes')
const Post = require("../models/Post")

exports.createPost = asyncHandler(async (req, res) => {
    if (!req.body.content) {
        throw new CustomError('You must add some content.', StatusCodes.BAD_REQUEST)
    }
    req.body.creator = req.user._id
    const post = await Post.create(req.body)
    res.status(StatusCodes.CREATED).json({
        data: {
            post
        }
    })
})

exports.getPost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const post = await Post.findById(postId).populate('likes comments')
    
    if (!post) {
        throw new CustomError("No post found.", StatusCodes.NOT_FOUND)
    } else {
        res.status(StatusCodes.OK).json({
            data: {
                post,
                likes: post.likes,
                comments: post.comments
        } })
    }
})

exports.getPosts = asyncHandler(async (req, res) => {
    let { page, limit, direction } = req.query
    direction = direction === 'asc' ? 'createdAt': '-createdAt'
    page = Number(page) || 1
    limit = Number(limit) || 10
    const skip = (page - 1) * limit
    const posts = await Post.find().sort(direction).skip(skip).limit(limit)
    res.status(StatusCodes.OK).json({
        data: {
            posts
        }
    })
})

exports.updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params

    if (!req.body.content) {
        throw new CustomError('You must add some new content if you want to update the post.', StatusCodes.BAD_REQUEST)
    }

    const post = await Post.findOneAndUpdate({ _id: postId, creator: req.user._id }, req.body, { new: true, runValidators: true })
    if (!post) {
        throw new CustomError("No post found.", StatusCodes.NOT_FOUND)
    } else {
        res.status(StatusCodes.OK).json({
            data: {
            post
        } })
    }
})

exports.deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const post = await Post.findOneAndDelete({ _id: postId, creator: req.user._id })
    
    if (!post) {
        throw new CustomError("No post found.", StatusCodes.NOT_FOUND)
    }
    
    res.status(StatusCodes.OK).json({
        data: {
        post
    } })
})
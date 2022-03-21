const { StatusCodes } = require("http-status-codes")
const asyncHandler = require("../errorhandlers/asyncHandler")
const User = require("../models/User")
const CustomError = require('../errorhandlers/customError')

exports.getMyProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('comments posts likes')
    res.status(StatusCodes.OK).json({
        data: {
            user
        }
        
    })
})

exports.getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.status(StatusCodes.OK).json({
        data: {
            users
        }
    })
})

exports.sendRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const myUser = await User.findById(req.user._id)
    const otherUser = await User.findById(userId)
    if (!myUser.sentRequests.includes(userId)) {
        const arr = [...myUser.sentRequests, userId]
        await User.findByIdAndUpdate(req.user._id, { sentRequests: arr })
    }
    if (!otherUser.receivedRequests.includes(req.user._id)) {
        const arr = [...otherUser.receivedRequests, req.user._id]
        await User.findByIdAndUpdate(userId, { receivedRequests: arr})
    }
    
    res.status().json({
        data: {
           user: myUser
       }
    })
})

exports.acceptRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const myUser = await User.findById(req.user._id)
    const otherUser = await User.findById(userId)

    if (!otherUser) {
        throw new CustomError('User no longer exists', StatusCodes.BAD_REQUEST)
    }
    if (!myUser.friend.includes(userId)) {
        const arr = [...myUser.friends, userId]
        const arrTwo = myUser.sentRequests.filter(r => r._id.toString() !== userId.toString())
        const arrThree = myUser.receivedRequests.filter(r => r._id.toString() !== userId.toString())
        await User.findByIdAndUpdate(req.user._id, { friends: arr, sentRequests: arrTwo, receivedRequests: arrThree })
    }

    if (!otherUser.friends.includes(req.user._id)) {
        const arr = [...otherUser.friends, req.user._id]
        const arrTwo = otherUser.sentRequests.filter(r => r._id.toString() !== req.user._id.toString())
        const arrThree = otherUser.receivedRequests.filter(r => r._id.toString() !== req.user._id.toString())
        await User.findByIdAndUpdate(userId, { friends: arr, sentRequests: arrTwo, receivedRequests: arrThree})
    }

    res.status(StatusCodes.OK).json({
        data: {
            user: myUser
        }
    })
})
const { StatusCodes } = require("http-status-codes")
const asyncHandler = require("../errorhandlers/asyncHandler")
const User = require("../models/User")
const CustomError = require('../errorhandlers/customError')
const FriendRequest = require("../models/FriendRequest")

exports.getMyProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('comments posts likes sentrequests receivedrequests')
    res.status(StatusCodes.OK).json({
        data: {
            user
        }        
    })
})

exports.deleteProfile = asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.user._id)
    res.status(StatusCodes.ACCEPTED).json({
        data: {
            msg: 'Your profile got deleted.'
        }
    })
})

exports.getUsers = asyncHandler(async (req, res) => {
    const { q } = req.query
    const queryObj = {}

    if (q) {
        queryObj.name = { $regex: q, $options: 'i'}
    }
    const users = await User.find(queryObj)
    res.status(StatusCodes.OK).json({
        data: {
            users
        }
    })
})

exports.sendRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params
    
    const promiseOne = FriendRequest.findOne({ creator: userId, invitee: req.user._id })
    const promiseTwo = FriendRequest.findOne({ creator: req.user._id, invitee: userId })
    const promiseThree = User.findById(userId)

    const [inviteeRequestExists, userRequestExists, userExists] = await Promise.all([promiseOne, promiseTwo, promiseThree])
    if (inviteeRequestExists) {
        throw new CustomError('That user already sent you a friend request.', StatusCodes.BAD_REQUEST)
    } else if (userRequestExists) {
        throw new CustomError('You already sent that user a friend request.', StatusCodes.BAD_REQUEST)
    } else if (!userExists) {
        throw new CustomError('No user with that id exists.', StatusCodes.BAD_REQUEST)
    } else if (req.user.friends.includes(userId)) {
        throw new CustomError('You are already friends.', StatusCodes.BAD_REQUEST)
    } else {
        const newFriendRequest = await FriendRequest.create({ creator: req.user._id, invitee: userId })
        res.status(StatusCodes.CREATED).json({
            data: {
                request: newFriendRequest
            }
        })
    }
})

exports.acceptRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params
    
    const promiseOne = FriendRequest.findOne({ creator: userId, invitee: req.user._id })
    const promiseTwo = User.findById(userId)

    const [friendRequest, inviter] = await Promise.all([promiseOne, promiseTwo])
    if (!friendRequest) {
        throw new CustomError('This user didn\'t invite you to be his/her friend.', StatusCodes.BAD_REQUEST)
    } else if (!inviter) {
        throw new CustomError('That user doesn\'t or no longer exists.', StatusCodes.BAD_REQUEST)
    } else {
        const myFriendsArr = [...req.user.friends, userId]
        const inviterFriendsArr = [...inviter.friends, req.user._id]
        const promiseThree = User.findByIdAndUpdate(req.user._id, { friends: myFriendsArr }, { new: true})
        const promiseFour = User.findByIdAndUpdate(userId, { friends: inviterFriendsArr }, { new: true})
        const promiseFive = FriendRequest.findByIdAndDelete(friendRequest._id)
        const [updatedUser] = await Promise.all([promiseThree, promiseFour, promiseFive])
        res.status(StatusCodes.ACCEPTED).json({
            data: {
                user: updatedUser
            }
        })
    }
})

exports.refuseRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params    
    const friendRequest = await FriendRequest.findOne({ creator: userId, invitee: req.user._id })

    if (!friendRequest) {
        throw new CustomError('This user didn\'t invite you to be his/her friend.', StatusCodes.BAD_REQUEST)
    } else {
        await FriendRequest.findByIdAndDelete(friendRequest._id)
        res.status(StatusCodes.ACCEPTED).json({
            data: {
                user: req.user
            }
        })
    }
})

exports.cancelRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params    
    const friendRequest = await FriendRequest.findOne({ creator: req.user._id, invitee: userId })

    if (!friendRequest) {
        throw new CustomError('You didn\'t invite this user.', StatusCodes.BAD_REQUEST)
    } else {
        await FriendRequest.findByIdAndDelete(friendRequest._id)
        res.status(StatusCodes.ACCEPTED).json({
            data: {
                user: req.user
            }
        })
    }
})

exports.deleteFriend = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const friend = await User.findById(userId)

    if (!friend) {
        const arr = req.user.friends.filter(f => f._id.toString() !== userId)
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { friends: arr }, { new: true})
        res.status(StatusCodes.OK).json({
            data: {
                user: updatedUser
            }
        })
    } else {
        const arrOne = req.user.friends.filter(f => f._id.toString() !== userId)
        const arrTwo = friend.friends.filter(f => f._id.toString() !== req.user._id.toString())
        const promiseOne = User.findByIdAndUpdate(req.user._id, { friends: arrOne }, { new: true})
        const promiseTwo = User.findByIdAndUpdate(userId, { friends: arrTwo }, { new: true})
        const [updatedUser] = await Promise.all([promiseOne, promiseTwo])
        res.status(StatusCodes.OK).json({
            data: {
                user: updatedUser
            }
        })
    }
})
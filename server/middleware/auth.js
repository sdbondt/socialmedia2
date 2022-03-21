const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errorhandlers/customError')
const User = require('../models/User')


const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new CustomError('Authentication invalid.', StatusCodes.UNAUTHORIZED)
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(payload.userId).select('-password')
        if (!user) {
            throw new CustomError('Authentication invalid.', StatusCodes.UNAUTHORIZED)
        }
        req.user = user
        next()
    } catch (e) {
        throw new CustomError('Authentication invalid.', StatusCodes.UNAUTHORIZED)
    }
}

module.exports = auth
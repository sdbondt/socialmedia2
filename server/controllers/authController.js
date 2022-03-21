const User = require('../models/User')
const asyncHandler = require('../errorhandlers/asyncHandler')
const CustomError = require('../errorhandlers/customError')
const { StatusCodes } = require('http-status-codes')

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        throw new CustomError('Please provide an email and password.', StatusCodes.BAD_REQUEST)
    }

    const user = await User.findOne({ email })
    
    if (!user) {
        throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
    }
    
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
    } else {
        const token = user.getJWT()
        res.status(StatusCodes.OK).json({
            data: {
                token,
                name: user.name,
                email: user.email
            }
        })
    }
})

exports.signup = asyncHandler(async (req, res) => {
    const { password, confirmPassword, email } = req.body

    if (password !== confirmPassword) {
        throw new CustomError('Passwords should match.', StatusCodes.BAD_REQUEST)
    }

    const findUser = await User.findOne({ email,  })

    if (findUser) {
        throw new CustomError('This email address is already in use', StatusCodes.BAD_REQUEST)
    } else {
        const user = await User.create({ ...req.body })
        const token = user.getJWT()
        res.status(StatusCodes.CREATED).json({
            data: {
                token,
                name: user.name,
                email: user.email
            }
        })
    }
})
const { StatusCodes } = require('http-status-codes')
const errorHandler = (err, req, res, next) => {
  console.log(err.stack)
  
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

  if (err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`
        customError.statusCode = 404
  }
  
  if (err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors)
          .map((item) => item.message)
          .join(',')
        customError.statusCode = 400
      }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandler
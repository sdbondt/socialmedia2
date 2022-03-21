// import dependencies & utilities
require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const morgan = require('morgan')
const rateLimiter = require('express-rate-limit')
const connectDb = require('./db/connectDb')
const auth = require('./middleware/auth')

// import errorhandlers
const errorHandler = require('./errorhandlers/errorHandler')
const notFoundHandler = require('./errorhandlers/notfoundHandler')

// import routers
const authRouter = require('./routes/authRoutes')
const postRouter = require('./routes/postRouter')
const userRouter = require('./routes/userRouter')

// create app & port
const app = express()
const PORT = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(morgan('dev'))
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
  }))

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/posts', auth, postRouter)
app.use('/api/v1/users', auth, userRouter)
app.use('/', (req, res) => {
    res.redirect('/api/v1')
})

// errorhandling
app.use(notFoundHandler)
app.use(errorHandler)

// connect to db
const start = async () => {
    try {
      await connectDb(process.env.MONGO_URI)
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
      );
    } catch (e) {
        console.log("Connection error.")
        console.log(e.message)
    }
}

start()
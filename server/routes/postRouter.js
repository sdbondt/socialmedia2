const express = require('express')
const { createPost, getPost, updatePost, deletePost, getPosts } = require('../controllers/postController')
const commentRouter = require('./commentRouter')
const likeRouter = require('./likeRouter')
const router = express.Router()

router.use('/:postId/comments', commentRouter)
router.use('/:postId/likes', likeRouter)
router.post('/', createPost)
router.get('/', getPosts)
router.get('/:postId', getPost)
router.patch('/:postId', updatePost)
router.delete('/:postId', deletePost)



module.exports = router
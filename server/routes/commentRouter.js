const express = require('express')
const { getComments, createComment, deleteComment, updateComment } = require('../controllers/commentController')
const router = express.Router({ mergeParams: true })

router.get('/', getComments)
router.post('/', createComment)
router.delete('/:commentId', deleteComment)
router.patch('/:commentId', updateComment)

module.exports = router
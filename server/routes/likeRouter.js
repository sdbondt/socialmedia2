const express = require('express')
const { getLikes,  like } = require('../controllers/likeController')
const router = express.Router({ mergeParams: true })

router.get('/', getLikes)
router.post('/', like)


module.exports = router
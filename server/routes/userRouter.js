const express = require('express')
const { getMyProfile, getUsers, sendRequest, acceptRequest } = require('../controllers/userController')
const router = express.Router()

router.get('/myprofile', getMyProfile)

router.post('/:userId/send', sendRequest)
router.post('/:userId/accept', acceptRequest)
router.get('/', getUsers)

module.exports = router
const express = require('express')
const { getMyProfile, getUsers, sendRequest, acceptRequest, refuseRequest, cancelRequest, deleteProfile, deleteFriend } = require('../controllers/userController')
const router = express.Router()

router.get('/myprofile', getMyProfile)
router.post('/myprofile/delete', deleteProfile)
router.post('/:userId/send', sendRequest)
router.post('/:userId/accept', acceptRequest)
router.post('/:userId/refuse', refuseRequest)
router.post('/:userId/cancelrequest', cancelRequest)
router.post('/:userId/deletefriend', deleteFriend)
router.get('/', getUsers)

module.exports = router
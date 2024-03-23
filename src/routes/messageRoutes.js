const express = require('express')
const { isAuth } = require('../middleware/authMiddleware')
const { sendMessage, allMessage } = require('../controllers/messageController')
const router = express.Router()

router.route('/').post(isAuth, sendMessage)
router.route('/:chatId').get(isAuth, allMessage)

module.exports = router

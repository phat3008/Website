const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/ChatBotController');

// Route để xử lý streaming message
router.post('/stream', chatbotController.streamMessage);

module.exports = router;
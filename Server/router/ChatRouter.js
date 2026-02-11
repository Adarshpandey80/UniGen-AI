const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/chatController");

router.post("/request" , ChatController.getChatResult);

module.exports = router;
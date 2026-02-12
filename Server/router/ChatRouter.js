const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/chatController");

router.post("/request/text" , ChatController.getChatResult);
router.post("/request/image" , ChatController.getImageResult);



module.exports = router;
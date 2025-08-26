const { addMessage, getMessages, deleteMessage, deleteAllMessages } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/deletemsg/:messageId/:userId", deleteMessage);
router.post("/deleteallmsg/", deleteAllMessages);

module.exports = router;

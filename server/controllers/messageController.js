const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    // Find messages but exclude ones that the user has deleted for themselves
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
      // Don't show messages that the current user has deleted for themselves
      deletedFor: { $ne: from }
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        messageId: msg._id,
        timestamp: msg.createdAt,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId, userId } = req.params;
    const { deleteType } = req.body; // 'forMe' or 'forEveryone'
    
    // Find the message first to validate
    const message = await Messages.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }
    
    // For "delete for everyone", only allow if user is the sender
    if (deleteType === 'forEveryone' && message.sender.toString() !== userId) {
      return res.status(403).json({ msg: "You can only delete your own messages for everyone" });
    }
    
    let result;
    
    // Handle different delete types
    if (deleteType === 'forEveryone') {
      // Hard delete - removes message for everyone
      result = await Messages.findByIdAndDelete(messageId);
    } else {
      // Delete for me only - add the user to "deletedFor" array
      if (!message.deletedFor) {
        message.deletedFor = [];
      }
      
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        result = await message.save();
      } else {
        return res.json({ msg: "Message already deleted for you", messageId });
      }
    }
    
    if (result) {
      return res.json({ 
        msg: deleteType === 'forEveryone' 
          ? "Message deleted for everyone" 
          : "Message deleted for you",
        messageId,
        deleteType
      });
    } else {
      return res.status(500).json({ msg: "Failed to delete message" });
    }
  } catch (ex) {
    console.error("Error deleting message:", ex);
    return res.status(500).json({ msg: "Server error when deleting message" });
  }
};

module.exports.deleteAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    
    if (!from || !to) {
      return res.status(400).json({ msg: "Missing required parameters" });
    }
    
    // Delete all messages between these users
    const result = await Messages.deleteMany({
      users: {
        $all: [from, to],
      },
    });
    
    if (result.deletedCount > 0) {
      return res.json({ 
        msg: "All messages deleted successfully",
        deletedCount: result.deletedCount 
      });
    } else {
      return res.json({ msg: "No messages found to delete" });
    }
  } catch (ex) {
    console.error("Error deleting all messages:", ex);
    return res.status(500).json({ msg: "Server error when clearing chat" });
  }
};

const User = require("../models/userModel");
const fs = require('fs');
const path = require('path');

module.exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: false, msg: "No file uploaded" });
    }

    const userId = req.params.id;
    
    // Create the avatar URL (relative path that will be served by express static middleware)
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    // Update user in database
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage: avatarUrl,
      },
      { new: true }
    ).select(['_id', 'username', 'email', 'avatarImage', 'isAvatarImageSet']);

    if (!userData) {
      // If user not found, delete the uploaded file to avoid orphaned files
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    // Broadcast the avatar change to all connected clients
    if (global.chatSocket) {
      global.chatSocket.broadcast.emit("avatar-updated", {
        userId: userData._id,
        avatarImage: userData.avatarImage,
      });
    }

    return res.json({
      status: true,
      user: userData,
      msg: "Avatar updated successfully"
    });
  } catch (ex) {
    console.error("Upload avatar error:", ex);
    next(ex);
  }
};

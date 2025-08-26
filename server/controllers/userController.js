const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already registered", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already registered", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { username, email, age } = req.body;
    
    // Check if username or email already exists for another user
    if (username) {
      const usernameCheck = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      
      if (usernameCheck) {
        return res.json({ 
          msg: "Username already in use by another account", 
          status: false 
        });
      }
    }
    
    if (email) {
      const emailCheck = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      
      if (emailCheck) {
        return res.json({ 
          msg: "Email already in use by another account", 
          status: false 
        });
      }
    }
    
    // Update the user data
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select([
      "email",
      "username",
      "avatarImage",
      "isAvatarImageSet",
      "age",
      "_id",
    ]);
    
    if (!user) {
      return res.json({ msg: "User not found", status: false });
    }
    
    return res.json({ 
      status: true, 
      user,
      msg: "Profile updated successfully" 
    });
  } catch (ex) {
    console.error("Update user error:", ex);
    next(ex);
  }
};

module.exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ msg: "User not found", status: false });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Current password is incorrect", status: false });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password
    await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword }
    );
    
    return res.json({ 
      status: true, 
      msg: "Password changed successfully" 
    });
  } catch (ex) {
    console.error("Change password error:", ex);
    next(ex);
  }
};

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: function() {
      // Password is required only if no social login is used
      return !this.googleId && !this.facebookId && !this.githubId;
    },
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  age: {
    type: Number,
    required: false,
  },
  // Social login fields
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  facebookId: {
    type: String,
    sparse: true,
    unique: true,
  },
  githubId: {
    type: String,
    sparse: true,
    unique: true,
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'facebook', 'github'],
    default: 'local'
  }
});

module.exports = mongoose.model("Users", userSchema);

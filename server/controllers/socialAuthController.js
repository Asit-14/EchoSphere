const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, provider: user.provider },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Process successful OAuth authentication
const processOAuthCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
    }
    
    const token = generateToken(req.user);
    
    // Create a user object without password
    const user = await User.findById(req.user._id).select('-password');
    
    // Redirect to the client with token
    return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};

// Verify token and return user
module.exports.verifyToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.json({ status: false, msg: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.json({ status: false, msg: 'User not found' });
    }
    
    return res.json({ status: true, user });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.json({ status: false, msg: 'Invalid token' });
  }
};

// Google callback handler
module.exports.googleCallback = (req, res) => {
  return processOAuthCallback(req, res);
};

// GitHub callback handler
module.exports.githubCallback = (req, res) => {
  return processOAuthCallback(req, res);
};

// Facebook callback handler
module.exports.facebookCallback = (req, res) => {
  return processOAuthCallback(req, res);
};

import express from 'express';
import { auth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users except the current user
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status
router.patch('/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    req.user.status = status;
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
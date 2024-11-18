import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { verifyToken } from './middleware/auth.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Enhanced user tracking
const userSessions = new Map(); // userId -> Set of socketIds
const onlineUsers = new Map(); // userId -> user data with status

const updateUserStatus = async () => {
  // Get all users from database to include offline users
  const allUsers = await User.find({}, 'username');
  const userStatuses = allUsers.map(dbUser => {
    const userId = dbUser._id.toString();
    const onlineUser = onlineUsers.get(userId);
    const sessions = userSessions.get(userId);
    
    return {
      id: userId,
      username: dbUser.username,
      status: sessions?.size > 0 ? 'online' : 'offline',
      lastSeen: onlineUser?.lastSeen || null,
      devices: sessions?.size || 0
    };
  });

  io.emit('userStatus', userStatuses);
};

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error('User not found'));
    }
    socket.userId = user._id.toString();
    socket.username = user.username;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', async (socket) => {
  console.log('User connected:', socket.username);
  
  // Initialize or update user sessions
  if (!userSessions.has(socket.userId)) {
    userSessions.set(socket.userId, new Set());
  }
  userSessions.get(socket.userId).add(socket.id);
  
  // Update user status
  onlineUsers.set(socket.userId, {
    id: socket.userId,
    username: socket.username,
    lastSeen: new Date(),
  });

  await updateUserStatus();

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('message', (data) => {
    io.to(data.room).emit('message', {
      ...data,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', async () => {
    const userSession = userSessions.get(socket.userId);
    if (userSession) {
      userSession.delete(socket.id);
      
      // Update last seen only if all sessions are closed
      if (userSession.size === 0) {
        const user = onlineUsers.get(socket.userId);
        if (user) {
          user.lastSeen = new Date();
        }
      }
    }
    
    await updateUserStatus();
    console.log('User disconnected:', socket.username);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
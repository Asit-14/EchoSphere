const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const path = require("path");
require("dotenv").config();

// Configure CORS for production
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? ["https://echosphere-frontend.onrender.com", "https://echosphere-frontend.onrender.app", 
       "https://echosphere.onrender.com", "https://next-js-ai-chatbot.vercel.app",
       "https://echo-spheres.vercel.app"]
    : "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// No session or passport initialization required anymore

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Handle client-side routing in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../public/build')));

  // For any request that doesn't match an API route, send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/build/index.html'));
  });
}

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" 
      ? ["https://echosphere-frontend.onrender.com", "https://echosphere-frontend.onrender.app", 
         "https://echosphere.onrender.com", "https://next-js-ai-chatbot.vercel.app",
         "https://echo-spheres.vercel.app"]
      : "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  
  // Handle user coming online
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    
    // Broadcast to all clients that this user is online
    socket.broadcast.emit("user-status-change", {
      userId: userId,
      status: "online"
    });
    
    // Send the current list of online users to this newly connected user
    const onlineUsersList = Array.from(onlineUsers.keys());
    socket.emit("get-online-users", onlineUsersList);
  });

  // New socket event to handle avatar updates
  socket.on("avatar-change", (data) => {
    socket.broadcast.emit("avatar-updated", data);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", {
        fromSelf: false,
        message: data.msg,
        timestamp: new Date().toISOString(),
        sender: data.from
      });
    }
  });
  
  // Handle message deletion notification
  socket.on("delete-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-deleted", data.messageId);
    }
  });
  
  // Handle clear chat notification
  socket.on("clear-chat", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("chat-cleared", data.from);
    }
  });
  
  socket.on("typing", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("typing");
    }
  });
  
  socket.on("stop-typing", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("stop-typing");
    }
  });
  
  // Handle user going offline
  socket.on("disconnect", () => {
    // Find the user ID associated with this socket
    let disconnectedUserId = null;
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
      }
    });
    
    if (disconnectedUserId) {
      // Remove user from online users
      onlineUsers.delete(disconnectedUserId);
      
      // Broadcast to all clients that this user is offline
      socket.broadcast.emit("user-status-change", {
        userId: disconnectedUserId,
        status: "offline"
      });
    }
  });
  
  // Handle explicit logout
  socket.on("logout", (userId) => {
    if (userId) {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user-status-change", {
        userId: userId,
        status: "offline"
      });
    }
  });
});
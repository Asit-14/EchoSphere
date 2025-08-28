import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, deleteMessageRoute, deleteAllMessagesRoute } from "../utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAvatarUrl } from "../utils/helpers";

export default function ChatContainer({ currentChat: initialChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(initialChat);
  const scrollRef = useRef();
  const messagesEndRef = useRef(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [showClearChatModal, setShowClearChatModal] = useState(false);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(socket?.connected || false);
  
  // Update currentChat when initialChat changes
  useEffect(() => {
    if (initialChat) {
      setCurrentChat(initialChat);
    }
  }, [initialChat]);

  // Fetch messages when chat changes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        
        if (data && currentChat) {
          const response = await axios.post(recieveMessageRoute, {
            from: data._id,
            to: currentChat._id,
          });
          
          setMessages(response.data);
          setTimeout(() => scrollToBottom(), 100);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    
    loadMessages();
  }, [currentChat]);
  
  // Listen for avatar updates
  useEffect(() => {
    if (socket) {
      socket.on("avatar-updated", (data) => {
        if (currentChat && currentChat._id === data.userId) {
          setCurrentChat(prev => ({
            ...prev,
            avatarImage: data.avatarImage
          }));
        }
      });
    }
    
    return () => {
      if (socket) {
        socket.off("avatar-updated");
      }
    };
  }, [socket, currentChat]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      try {
        messagesEndRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "end" 
        });
      } catch (error) {
        // Fallback for browsers that don't support smooth scrolling
        messagesEndRef.current.scrollIntoView(false);
      }
    }
  };
  
  // Set up socket when chat changes
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat && socket) {
        try {
          const userData = JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          );
          
          // Tell the server which chat we're in
          socket.emit("join-chat", {
            chatId: currentChat._id,
            userId: userData._id
          });
        } catch (error) {
          console.error("Error setting up chat:", error);
        }
      }
    };
    
    getCurrentChat();
    // Including socket in the dependency array
  }, [currentChat, socket]);

  // Handle sending messages
  const handleSendMsg = async (msg) => {
    try {
      const data = JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      
      // Generate message ID and timestamp
      const messageId = uuidv4();
      const timestamp = new Date().toISOString();
      
      // Create message object
      const messageObj = {
        to: currentChat._id,
        from: data._id,
        msg,
        messageId,
        timestamp
      };
      
      // Check if socket is connected
      if (socket && isConnected) {
        // Emit the message via socket
        socket.emit("send-msg", messageObj);
        
        // Stop typing indicator
        socket.emit("stop-typing", {
          to: currentChat._id,
          from: data._id,
        });
      } else {
        // Store message in pending queue
        setPendingMessages(prev => [...prev, messageObj]);
        
        // Show notification
        toast.info("Message will be sent when connection is restored", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
      
      // Save the message to the database
      try {
        await axios.post(sendMessageRoute, {
          from: data._id,
          to: currentChat._id,
          message: msg,
          messageId
        });
      } catch (error) {
        console.error("Error saving message to database:", error);
        // Show notification
        toast.warning("Message saved locally. It may not persist if you close the app.", {
          position: "bottom-right",
        });
      }
  
      // Update local message state
      const newMsg = { 
        fromSelf: true, 
        message: msg,
        timestamp,
        messageId,
        pending: !isConnected // Mark message as pending if not connected
      };
      
      setMessages(prevMessages => [...prevMessages, newMsg]);
      
      // Scroll to bottom
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        position: "bottom-right",
      });
    }
  };

  // Handle typing indicator
  const handleTyping = (isTyping) => {
    try {
      const data = JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      
      if (socket) {
        socket.emit(isTyping ? "typing" : "stop-typing", {
          to: currentChat._id,
          from: data._id,
        });
      }
    } catch (error) {
      console.error("Error handling typing indicator:", error);
    }
  };

  // Track socket connection status and handle reconnection
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log("Socket connected");
        setIsConnected(true);
        
        // Try to send any pending messages
        if (pendingMessages.length > 0) {
          pendingMessages.forEach(msg => {
            socket.emit("send-msg", msg);
          });
          setPendingMessages([]);
        }
      };
      
      const handleDisconnect = () => {
        console.log("Socket disconnected");
        setIsConnected(false);
        
        // Show notification
        toast.error("Connection lost. Trying to reconnect...", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      };
      
      const handleReconnect = (attemptNumber) => {
        console.log(`Reconnection attempt #${attemptNumber}`);
        toast.info(`Reconnecting... (Attempt ${attemptNumber})`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      };
      
      const handleReconnectSuccess = () => {
        console.log("Reconnected successfully!");
        toast.success("Reconnected successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      };
      
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("reconnect_attempt", handleReconnect);
      socket.on("reconnect", handleReconnectSuccess);
      
      // Set initial connection state
      setIsConnected(socket.connected);
      
      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("reconnect_attempt", handleReconnect);
        socket.off("reconnect", handleReconnectSuccess);
      };
    }
  }, [socket, pendingMessages]);
  
  // Listen for incoming messages and other socket events
  useEffect(() => {
    if (socket) {
      socket.on("msg-receive", (messageData) => {
        console.log("Message received:", messageData);
        // Enhanced message object with more properties
        setArrivalMessage({ 
          fromSelf: false, 
          message: messageData.message,
          timestamp: messageData.timestamp || new Date().toISOString(),
          sender: messageData.sender,
          messageId: messageData.messageId || uuidv4() // Ensure messages have IDs
        });
        setIsTyping(false);
        
        // Force scroll to bottom on message arrival
        setTimeout(() => scrollToBottom(), 100);
      });
      
      // Handle message deletion from other clients
      socket.on("msg-deleted", (messageId) => {
        setMessages(prev => prev.filter(msg => msg.messageId !== messageId));
        toast.info("A message was deleted");
      });
      
      // Handle chat cleared from other clients
      socket.on("chat-cleared", (fromUserId) => {
        setMessages([]);
        toast.info("Chat history was cleared");
      });
      
      socket.on("typing", () => {
        setIsTyping(true);
      });
      
      socket.on("stop-typing", () => {
        setIsTyping(false);
      });
    }
    
    // Cleanup listeners on unmount
    return () => {
      if (socket) {
        socket.off("msg-receive");
        socket.off("msg-deleted");
        socket.off("chat-cleared");
        socket.off("typing");
        socket.off("stop-typing");
      }
    };
  }, [socket]);

  // Update messages when a new one arrives
  useEffect(() => {
    if (arrivalMessage) {
      // Check if the message isn't already in the array (prevent duplicates)
      const messageExists = messages.some(
        msg => msg.timestamp === arrivalMessage.timestamp && 
              msg.message === arrivalMessage.message
      );
      
      if (!messageExists) {
        setMessages(prev => [...prev, arrivalMessage]);
        setTimeout(() => scrollToBottom(), 100);
      }
    }
  }, [arrivalMessage, messages]);

  // Delete a message
  const handleDeleteMessage = async (messageId) => {
    try {
      const userData = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      
      // Delete from database
      const response = await axios.delete(`${deleteMessageRoute}/${messageId}/${userData._id}`);
      
      if (response.data.msg === "Message deleted successfully") {
        // Update local state
        setMessages(prev => prev.filter(msg => msg.messageId !== messageId));
        setShowMessageActions(false);
        setSelectedMessage(null);
        
        // Notify other users about deletion via socket
        if (socket.current) {
          socket.current.emit("delete-msg", {
            to: currentChat._id,
            from: userData._id,
            messageId: messageId,
          });
        }
        
        toast.success("Message deleted successfully");
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };
  
  // Delete all messages in the chat
  const handleClearChat = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      
      const response = await axios.post(deleteAllMessagesRoute, {
        from: userData._id,
        to: currentChat._id,
      });
      
      if (response.data.msg === "All messages deleted successfully" || 
          response.data.msg === "No messages found to delete") {
        // Clear all messages locally
        setMessages([]);
        setShowClearChatModal(false);
        
        // Notify the other user that the chat was cleared
        if (socket.current) {
          socket.current.emit("clear-chat", {
            to: currentChat._id,
            from: userData._id,
          });
        }
        
        toast.success("Chat cleared successfully");
      } else {
        toast.error("Failed to clear chat");
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Failed to clear chat");
    }
  };
  
  // Handle message selection for contextual actions
  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
    setShowMessageActions(true);
  };
  
  // Close message actions menu
  const handleCloseMessageActions = () => {
    setShowMessageActions(false);
    setSelectedMessage(null);
  };
  
  // Format timestamp for display
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={getAvatarUrl(currentChat.avatarImage)}
              alt={`${currentChat.username}'s avatar`}
              onError={(e) => {
                console.error("Failed to load avatar image");
                // Use a simple colored circle with first letter of username as fallback
                const colors = ["#3498db", "#e74c3c", "#2ecc71", "#9b59b6"];
                const colorIndex = currentChat.username.charCodeAt(0) % colors.length;
                const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${colors[colorIndex]}"/><text x="50" y="62" font-family="Arial" font-size="40" text-anchor="middle" fill="white">${currentChat.username[0].toUpperCase()}</text></svg>`;
                e.target.src = fallbackSvg;
              }}
            />
            <span className="status-indicator online"></span>
          </div>
          <div className="user-info">
            <h3>{currentChat.username}</h3>
            <span className="status">
              {isTyping ? "typing..." : isConnected ? "online" : "disconnected"}
              <span className={`connection-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
            </span>
          </div>
        </div>
        
        <div className="chat-actions">
          {!isConnected && (
            <button 
              className="action-btn reconnect-btn" 
              aria-label="Reconnect"
              onClick={() => {
                if (socket) {
                  toast.info("Attempting to reconnect...", {
                    position: "bottom-right",
                  });
                  socket.connect();
                }
              }}
              title="Reconnect"
            >
              <i className="fas fa-sync"></i>
            </button>
          )}
          <button className="action-btn" aria-label="Call">
            <i className="fas fa-phone"></i>
          </button>
          <button className="action-btn" aria-label="Video call">
            <i className="fas fa-video"></i>
          </button>
          <button 
            className="action-btn" 
            aria-label="Clear Chat"
            onClick={() => setShowClearChatModal(true)}
            title="Clear chat"
          >
            <i className="fas fa-trash"></i>
          </button>
          <button className="action-btn" aria-label="More options">
            <i className="fas fa-ellipsis-h"></i>
          </button>
          <Logout socket={socket} />
        </div>
      </div>
      
      <div className="chat-messages" aria-live="polite">
        <div className="chat-date">
          <span>Today</span>
        </div>
        
        {messages.map((message, index) => {
          return (
            <div 
              key={uuidv4()} 
              ref={index === messages.length - 1 ? scrollRef : null}
              className={`message-wrapper ${
                message.fromSelf ? "outgoing" : "incoming"
              }`}
            >
              <div
                className={`message ${
                  message.fromSelf ? "sent" : "received"
                } ${selectedMessage?.messageId === message.messageId ? "selected" : ""}`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (message.fromSelf) {
                    handleMessageSelect(message);
                  }
                }}
                onLongPress={() => {
                  if (message.fromSelf) {
                    handleMessageSelect(message);
                  }
                }}
              >
                <div className="content">
                  <p>{message.message}</p>
                  <span className="timestamp" aria-label="Sent at">
                    {formatTime(message.timestamp)}
                    {message.pending && (
                      <i 
                        className="fas fa-clock message-pending" 
                        title="Pending - Will be sent when connection is restored"
                      ></i>
                    )}
                    {message.fromSelf && (
                      <i 
                        className="fas fa-ellipsis-v message-options"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessageSelect(message);
                        }}
                      ></i>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
        
        {/* Message actions popup */}
        {showMessageActions && selectedMessage && (
          <div className="message-actions-popup">
            <button onClick={() => handleDeleteMessage(selectedMessage.messageId)}>
              <i className="fas fa-trash"></i> Delete message
            </button>
            <button onClick={handleCloseMessageActions}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        )}
      </div>
      
      {/* Clear chat confirmation modal */}
      {showClearChatModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Clear all messages</h3>
            <p>Are you sure you want to delete all messages in this chat? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowClearChatModal(false)}>Cancel</button>
              <button className="modal-btn delete" onClick={handleClearChat}>Clear Chat</button>
            </div>
          </div>
        </div>
      )}
      
      <ChatInput 
        handleSendMsg={handleSendMsg} 
        onTyping={handleTyping}
        showEmoji={showEmoji}
        setShowEmoji={setShowEmoji}
      />
      
      <ToastContainer position="bottom-right" theme="dark" />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 0 16px 16px 0;
  background: var(--background-light);
  width: 100%;
  max-height: 100%;
  margin: 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  @media screen and (max-width: 768px) {
    border-radius: 0;
    max-height: 100vh;
    height: calc(100vh - 60px); /* Account for navigation */
  }
  
  @media screen and (max-width: 480px) {
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background-color: rgba(30, 30, 46, 0.5);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 10;
    
    .user-details {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      
    .avatar {
      position: relative;
      height: 3rem;
      width: 3rem;
      border-radius: 50%;
      overflow: hidden;
      
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid transparent;
        background-color: rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        
        &:hover {
          border: 2px solid var(--primary-color);
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.5);
        }
      }        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--background-medium);
          
          &.online {
            background-color: var(--success);
          }
        }
      }
      
      .user-info {
        display: flex;
        flex-direction: column;
        
        h3 {
          color: var(--text-primary);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.1rem;
        }
        
        .status {
          color: var(--text-tertiary);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 5px;
          
          .connection-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            transition: background-color 0.3s ease;
            
            &.connected {
              background-color: var(--success);
            }
            
            &.disconnected {
              background-color: var(--error);
            }
          }
          
          &:empty::before {
            content: "online";
            color: var(--success);
          }
        }
      }
    }
    
    .chat-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.8rem;
      margin-left: auto; /* Push to right side */
      
      .action-btn {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: var(--text-secondary);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.4rem;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-fast);
        
        &.reconnect-btn {
          background-color: rgba(255, 0, 0, 0.15);
          color: var(--error);
          animation: pulse 1.5s infinite;
          
          i {
            animation: rotate 2s infinite linear;
          }
        }
        
        &:hover, &:focus {
          background-color: rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
          transform: scale(1.1);
        }
        
        &.reconnect-btn:hover, &.reconnect-btn:focus {
          background-color: rgba(255, 0, 0, 0.25);
          color: var(--error);
        }
      }
    }
  }
  
  .chat-messages {
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    overflow-y: auto;
    background-color: var(--background-light);
    height: 100%;
    scrollbar-width: thin;
    margin: 0;
    
    @media screen and (max-width: 480px) {
      padding-bottom: 80px; /* Make room for the fixed input */
      flex: 1;
      height: calc(100% - 130px);
    }
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    
    /* Chat date header */
    .chat-date {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.5rem 0 1.5rem;
      
      span {
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--text-tertiary);
        font-size: 0.8rem;
        padding: 0.3rem 1rem;
        border-radius: 20px;
      }
    }
    
    /* Message wrapper */
    .message-wrapper {
      display: flex;
      width: 100%;
      margin-bottom: 0.5rem;
      
      &.outgoing {
        justify-content: flex-end;
      }
      
      &.incoming {
        justify-content: flex-start;
      }
    }
    
    .message {
      display: flex;
      max-width: 65%;
      
      @media screen and (max-width: 768px) {
        max-width: 80%;
      }
      
      .content {
        overflow-wrap: break-word;
        padding: 1rem 1.2rem;
        font-size: 0.95rem;
        position: relative;
        border-radius: 16px;
        color: var(--text-primary);
        box-shadow: var(--box-shadow);
        transition: transform 0.2s ease;
        
        &:hover {
          transform: translateY(-2px);
        }
        
        p {
          margin-bottom: 0.5rem;
          line-height: 1.5;
          letter-spacing: 0.01em;
        }
        
        .timestamp {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          font-size: 0.7rem;
          color: var(--text-tertiary);
          text-align: right;
          margin-top: 0.2rem;
          
          .message-pending {
            color: var(--warning);
            font-size: 0.8rem;
            margin-left: 3px;
            animation: pulse 1.5s infinite;
          }
          
          .message-options {
            cursor: pointer;
            padding: 2px;
            margin-left: 3px;
            visibility: hidden;
            opacity: 0;
            transition: all 0.2s ease;
          }
        }
      }
    }
    
    .sent {
      .content {
        background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
        border-bottom-right-radius: 2px;
      }
    }
    
    .received {
      .content {
        background-color: rgba(255, 255, 255, 0.05);
        border-bottom-left-radius: 2px;
      }
    }
    
    /* Typing indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      padding: 0.7rem;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      width: fit-content;
      margin: 0.5rem 0;
      
      .dot {
        width: 8px;
        height: 8px;
        background-color: var(--text-tertiary);
        border-radius: 50%;
        margin: 0 2px;
        animation: bounce 1.4s infinite ease-in-out;
        
        &:nth-child(1) {
          animation-delay: 0s;
        }
        
        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: translateY(0);
      opacity: 0.8;
    }
    40% {
      transform: translateY(-8px);
      opacity: 1;
    }
  }
  
  /* Message options icon */
  .message-options {
    margin-left: 8px;
    cursor: pointer;
    opacity: 0;
    transition: var(--transition-fast);
    font-size: 0.9rem;
    vertical-align: middle;
  }
  
  .message:hover .message-options {
    opacity: 0.7;
    transform: scale(1);
  }
  
  .message:hover .message-options:hover {
    opacity: 1;
    transform: scale(1.15);
  }
  
  .message.selected {
    box-shadow: 0 0 0 2px var(--primary-color);
  }
  
  /* Message actions popup */
  .message-actions-popup {
    position: absolute;
    background: var(--background-medium);
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    padding: 0.5rem;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: fadeIn 0.2s ease;
    
    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.7rem 1rem;
      background: none;
      border: none;
      color: var(--text-primary);
      text-align: left;
      cursor: pointer;
      border-radius: 4px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      &:first-child {
        color: var(--error);
      }
    }
  }
  
  /* Modal styling */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: var(--background-medium);
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    box-shadow: var(--box-shadow);
    animation: slideIn 0.3s ease;
    
    h3 {
      margin-bottom: 1rem;
      color: var(--text-primary);
    }
    
    p {
      margin-bottom: 1.5rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    
    .modal-btn {
      padding: 0.7rem 1.2rem;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: var(--transition-fast);
      
      &.cancel {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        border: none;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
      
      &.delete {
        background: var(--error);
        color: white;
        border: none;
        
        &:hover {
          background: var(--error-hover, #e53935);
          transform: translateY(-2px);
        }
      }
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.6); }
    70% { box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
    100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Users, Send, Image as ImageIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ChatMessage from '../components/ChatMessage';
import UsersList from '../components/UsersList';
import GroupsList from '../components/GroupsList';

const Chat = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState('general');
  const [showUsers, setShowUsers] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (socket) {
      socket.on('message', (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        scrollToBottom();
      });
    }
  }, [socket]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('message', {
        content: message,
        room: activeChat,
        sender: user.username,
      });
      setMessage('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && socket) {
      const reader = new FileReader();
      reader.onloadend = () => {
        socket.emit('message', {
          content: reader.result as string,
          type: 'image',
          room: activeChat,
          sender: user.username,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Chat App</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {showUsers ? <MessageSquare size={20} /> : <Users size={20} />}
              <span>{showUsers ? 'Show Chats' : 'Show Users'}</span>
            </button>
            
            {showUsers ? <UsersList /> : <GroupsList activeChat={activeChat} setActiveChat={setActiveChat} />}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} isOwn={msg.sender === user.username} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <ImageIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </label>
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            
            <button
              type="submit"
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Moon, Sun } from 'lucide-react';
import { useStore } from './store/useStore';
import { ChatMessage } from './components/Chat/ChatMessage';
import { ChatInput } from './components/Chat/ChatInput';
import { UserList } from './components/Sidebar/UserList';
import { AuthForm } from './components/Auth/AuthForm';
import axios from 'axios';

function App() {
  const { darkMode, toggleDarkMode } = useStore();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchCurrentUser = async (token: string) => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  const handleAuthSuccess = (token: string, user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="h-screen flex dark:bg-gray-900 dark:text-white">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <div className="w-80 border-r dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Modern Chat</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <UserList users={users} onUserSelect={() => {}} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.sender === currentUser?._id}
              onDelete={() => {}}
              onEdit={() => {}}
              onReact={() => {}}
            />
          ))}
        </div>
        <ChatInput
          onSend={() => {}}
          isTyping={false}
          setIsTyping={() => {}}
        />
      </div>
    </div>
  );
}

export default App;
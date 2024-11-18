import React, { useEffect, useState } from 'react';
import { User, Circle, Search } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import { motion, AnimatePresence } from 'framer-motion';

type OnlineUser = {
  id: string;
  username: string;
  lastSeen: Date | null;
  status: 'online' | 'offline';
  devices: number;
};

const UsersList = () => {
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('userStatus', (updatedUsers: OnlineUser[]) => {
      setUsers(updatedUsers.sort((a, b) => {
        // Sort online users first, then by username
        if (a.status === 'online' && b.status === 'offline') return -1;
        if (a.status === 'offline' && b.status === 'online') return 1;
        return a.username.localeCompare(b.username);
      }));
    });

    return () => {
      socket.off('userStatus');
    };
  }, [socket]);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = users.filter(user => user.status === 'online').length;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors duration-200"
        />
      </div>

      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
        <div className="flex items-center space-x-2">
          <User size={20} className="text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">Users</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {onlineCount} online
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            / {users.length} total
          </span>
        </div>
      </div>
      
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.button
              key={user.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              onClick={() => setSelectedUser(user)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <Circle
                  size={8}
                  className={`${
                    user.status === 'online' ? 'text-green-500' : 'text-gray-400'
                  } fill-current transition-colors duration-200`}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {user.username} {user.id === currentUser?.id ? '(You)' : ''}
                </span>
              </div>
              {user.devices > 1 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user.devices} devices
                </span>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {selectedUser && (
        <UserProfile user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default UsersList;
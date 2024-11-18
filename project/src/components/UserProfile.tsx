import React from 'react';
import { X, Monitor, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type UserProfileProps = {
  user: {
    username: string;
    status: 'online' | 'offline';
    lastSeen: Date | null;
    devices: number;
  };
  onClose: () => void;
};

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'Yesterday';
    return new Date(date).toLocaleDateString();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.username}
            </h2>
            <p className={`mt-2 text-sm ${
              user.status === 'online' ? 'text-green-500' : 'text-gray-500'
            }`}>
              {user.status === 'online' ? 'Online now' : 'Offline'}
            </p>
          </div>

          <div className="space-y-4">
            {user.status === 'offline' && user.lastSeen && (
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <Clock size={18} />
                <span>Last seen: {formatLastSeen(user.lastSeen)}</span>
              </div>
            )}

            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <Monitor size={18} />
              <span>Active on {user.devices} device{user.devices !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserProfile;
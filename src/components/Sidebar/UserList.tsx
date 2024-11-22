import React from 'react';
import { User } from 'firebase/auth';
import { Circle } from 'lucide-react';

interface UserListProps {
  users: {
    user: User;
    online: boolean;
    status?: string;
  }[];
  onUserSelect: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onUserSelect }) => {
  return (
    <div className="space-y-2">
      {users.map(({ user, online, status }) => (
        <div
          key={user.uid}
          onClick={() => onUserSelect(user.uid)}
          className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
        >
          <div className="relative">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
              alt={user.displayName || 'User'}
              className="w-10 h-10 rounded-full"
            />
            <Circle
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                online ? 'text-green-500' : 'text-gray-400'
              }`}
              fill="currentColor"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{user.displayName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
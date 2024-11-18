import React from 'react';
import { Hash } from 'lucide-react';

type GroupsListProps = {
  activeChat: string;
  setActiveChat: (chat: string) => void;
};

const GroupsList: React.FC<GroupsListProps> = ({ activeChat, setActiveChat }) => {
  const groups = ['general', 'random', 'announcements'];

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <button
          key={group}
          onClick={() => setActiveChat(group)}
          className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
            activeChat === group
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Hash size={20} />
          <span className="capitalize">{group}</span>
        </button>
      ))}
    </div>
  );
};

export default GroupsList;
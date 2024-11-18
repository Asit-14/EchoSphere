import React from 'react';
import { motion } from 'framer-motion';

type MessageProps = {
  message: {
    content: string;
    sender: string;
    type?: string;
    timestamp: Date;
  };
  isOwn: boolean;
};

const ChatMessage: React.FC<MessageProps> = ({ message, isOwn }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwn
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
        }`}
      >
        {message.type === 'image' ? (
          <img
            src={message.content}
            alt="Shared image"
            className="max-w-full rounded"
          />
        ) : (
          <p>{message.content}</p>
        )}
        <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'} block mt-1`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
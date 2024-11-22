import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Edit, SmilePlus } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
    attachments?: { url: string; type: string }[];
  };
  isOwn: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onReact: (id: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwn,
  onDelete,
  onEdit,
  onReact,
}) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-sm">{message.text}</p>
            {message.attachments?.map((attachment, index) => (
              <div key={index} className="mt-2">
                {attachment.type.startsWith('image/') ? (
                  <img
                    src={attachment.url}
                    alt="attachment"
                    className="max-w-full rounded"
                  />
                ) : (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View attachment
                  </a>
                )}
              </div>
            ))}
            <span className="text-xs opacity-75 mt-1 block">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </div>
          {isOwn && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(message.id)}
                className="opacity-50 hover:opacity-100"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(message.id)}
                className="opacity-50 hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => onReact(message.id)}
                className="opacity-50 hover:opacity-100"
              >
                <SmilePlus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
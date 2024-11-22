import React, { useState, useRef } from 'react';
import { Paperclip, Send, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface ChatInputProps {
  onSend: (text: string, files?: File[]) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isTyping,
  setIsTyping,
}) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || fileInputRef.current?.files?.length) {
      onSend(message, Array.from(fileInputRef.current?.files || []));
      setMessage('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
      <div className="relative flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*,video/*,application/*"
        />
        <div className="relative flex-1">
          <textarea
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="w-full p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800 resize-none"
            rows={1}
          />
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className="absolute right-2 bottom-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Smile className="w-5 h-5" />
          </button>
          {showEmoji && (
            <div className="absolute bottom-full right-0 mb-2">
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setMessage((prev) => prev + emoji.emoji);
                  setShowEmoji(false);
                }}
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
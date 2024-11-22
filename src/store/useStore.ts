import { create } from 'zustand';

interface ChatStore {
  activeChat: string | null;
  setActiveChat: (chatId: string | null) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useStore = create<ChatStore>((set) => ({
  activeChat: null,
  setActiveChat: (chatId) => set({ activeChat: chatId }),
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
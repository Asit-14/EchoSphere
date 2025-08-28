import { host } from './APIRoutes';

/**
 * Helper function to get the complete avatar URL
 * @param {string} avatarPath - The avatar path from the user object
 * @returns {string} - The full URL to the avatar image
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  
  // If the path is already a complete URL, return it as is
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  // If it's a relative path (from uploads folder), prefix with the API host
  return `${host}${avatarPath}`;
};

// Get the local storage key with fallback
export const getLocalStorageKey = () => {
  return process.env.REACT_APP_LOCALHOST_KEY || "echosphere-user";
};

// Get user from localStorage
export const getUserFromStorage = () => {
  const key = getLocalStorageKey();
  const user = localStorage.getItem(key);
  return user ? JSON.parse(user) : null;
};

// Save user to localStorage
export const saveUserToStorage = (user) => {
  const key = getLocalStorageKey();
  localStorage.setItem(key, JSON.stringify(user));
};

// Remove user from localStorage
export const removeUserFromStorage = () => {
  const key = getLocalStorageKey();
  localStorage.removeItem(key);
};

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

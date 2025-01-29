import { PlaylistData } from '../types';

const STORAGE_KEY = 'youtube-playlist-data';

export const saveToStorage = (data: PlaylistData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadFromStorage = (): PlaylistData | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
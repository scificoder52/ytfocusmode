import React from 'react';
import { Video } from '../types';

interface PlaylistProgressProps {
  videos: Video[];
  currentIndex: number;
}

export const PlaylistProgress: React.FC<PlaylistProgressProps> = ({ videos, currentIndex }) => {
  const completedCount = videos.filter(v => v.completed).length;
  const progress = (completedCount / videos.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl shadow-lg">
      <div className="flex justify-between mb-3 text-sm font-medium">
        <span className="text-emerald-600 dark:text-emerald-400">
          Progress: {completedCount}/{videos.length} videos
        </span>
        <span className="text-gray-600 dark:text-gray-300">
          Video {currentIndex + 1} of {videos.length}
        </span>
        <span className="text-emerald-600 dark:text-emerald-400">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
import React from 'react';
import { Video } from '../types';
import { CheckCircle, PlayCircle } from 'lucide-react';

interface PlaylistSidebarProps {
  videos: Video[];
  currentIndex: number;
  onVideoSelect: (index: number) => void;
}

export const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({
  videos,
  currentIndex,
  onVideoSelect,
}) => {
  return (
    <div className="w-full h-[600px] bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <PlayCircle size={20} />
          Playlist Videos
        </h3>
      </div>
      <div className="overflow-y-auto h-[calc(600px-60px)] custom-scrollbar">
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => onVideoSelect(index)}
            className={`w-full p-4 flex items-start gap-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors ${
              currentIndex === index ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''
            }`}
          >
            <div className="relative flex-shrink-0 group">
              <img
                src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                alt={video.title}
                className="w-32 h-20 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
              />
              {video.completed ? (
                <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1 shadow-lg">
                  <CheckCircle size={16} className="text-white" />
                </div>
              ) : currentIndex === index && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <PlayCircle size={24} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium line-clamp-2 text-left ${
                currentIndex === index 
                  ? 'text-emerald-700 dark:text-emerald-400' 
                  : 'text-gray-800 dark:text-gray-200'
              }`}>
                {video.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {video.completed ? 'Completed' : index === currentIndex ? 'Now Playing' : 'Not Started'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
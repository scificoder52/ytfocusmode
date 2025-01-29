import React from 'react';
import YouTube from 'react-youtube';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Video } from '../types';
import { VideoSummary } from './VideoSummary';

interface VideoPlayerProps {
  video: Video;
  onComplete: () => void;
  onSkip: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  onComplete,
  onSkip,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) => {
  return (
    <div className="w-full space-y-4">
      <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-xl">
        <YouTube
          videoId={video.id}
          className="w-full h-full"
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
            },
          }}
        />
      </div>
      
      <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          {video.title}
        </h2>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:shadow-lg disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <CheckCircle size={20} />
            Mark as Complete
          </button>
          
          <button
            onClick={onSkip}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow-lg hover:shadow-xl transition-all"
          >
            <XCircle size={20} />
            Skip Video
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:shadow-lg disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <VideoSummary videoId={video.id} />
    </div>
  );
};
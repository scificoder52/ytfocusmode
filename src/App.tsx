import React, { useState, useEffect } from 'react';
import { Laptop2, Github, Coffee, Trash2 } from 'lucide-react';
import { PlaylistInput } from './components/PlaylistInput';
import { VideoPlayer } from './components/VideoPlayer';
import { PlaylistProgress } from './components/PlaylistProgress';
import { PlaylistSidebar } from './components/PlaylistSidebar';
import { PlaylistData, Video } from './types';
import { saveToStorage, loadFromStorage, clearStorage } from './utils/storage';
import { fetchPlaylistVideos } from './utils/youtube';

function App() {
  const [playlistData, setPlaylistData] = useState<PlaylistData>({
    videos: [],
    currentIndex: 0,
    darkMode: true,
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      setPlaylistData(savedData);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (playlistData.videos.length > 0) {
      saveToStorage(playlistData);
    }
  }, [playlistData]);

  const handlePlaylistSubmit = async (url: string) => {
    setError('');
    setLoading(true);
    try {
      const videos = await fetchPlaylistVideos(url);
      setPlaylistData(prev => ({
        ...prev,
        videos,
        currentIndex: 0,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoComplete = () => {
    setPlaylistData(prev => {
      const updatedVideos = [...prev.videos];
      updatedVideos[prev.currentIndex].completed = true;
      return {
        ...prev,
        videos: updatedVideos,
        currentIndex: Math.min(prev.currentIndex + 1, prev.videos.length - 1),
      };
    });
  };

  const handleVideoSelect = (index: number) => {
    setPlaylistData(prev => ({
      ...prev,
      currentIndex: index,
    }));
  };

  const handleVideoSkip = () => {
    setPlaylistData(prev => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, prev.videos.length - 1),
    }));
  };

  const handleClearData = () => {
    clearStorage();
    setPlaylistData({
      videos: [],
      currentIndex: 0,
      darkMode: true,
    });
    setError('');
  };

  const currentVideo = playlistData.videos[playlistData.currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8 animate-slide-in">
          <div className="flex items-center gap-3">
            <Laptop2 className="w-8 h-8 text-emerald-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
              YouTube Focus Learner
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleClearData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              title="Clear all data"
            >
              <Trash2 className="w-4 h-4" />
              Clear Data
            </button>
            <a
              href="https://buymeacoffee.com/amitchaudhary"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFDD00] hover:bg-[#FFED4F] text-black text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Coffee className="w-4 h-4" />
              <span>Buy me a coffee</span>
            </a>
          </div>
        </div>

        <PlaylistInput onSubmit={handlePlaylistSubmit} loading={loading} />

        {error && (
          <div className="w-full max-w-4xl mx-auto mb-8 p-4 bg-red-100/90 backdrop-blur border border-red-200 text-red-700 rounded-xl shadow-lg animate-slide-in">
            {error}
          </div>
        )}

        {playlistData.videos.length > 0 ? (
          <div className="space-y-6 animate-slide-in">
            <PlaylistProgress 
              videos={playlistData.videos} 
              currentIndex={playlistData.currentIndex}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VideoPlayer
                  video={currentVideo}
                  onComplete={handleVideoComplete}
                  onSkip={handleVideoSkip}
                  onPrevious={() => handleVideoSelect(Math.max(0, playlistData.currentIndex - 1))}
                  onNext={() => handleVideoSelect(Math.min(playlistData.videos.length - 1, playlistData.currentIndex + 1))}
                  hasPrevious={playlistData.currentIndex > 0}
                  hasNext={playlistData.currentIndex < playlistData.videos.length - 1}
                />
              </div>
              <div>
                <PlaylistSidebar
                  videos={playlistData.videos}
                  currentIndex={playlistData.currentIndex}
                  onVideoSelect={handleVideoSelect}
                />
              </div>
            </div>
          </div>
        ) : !loading && !error && (
          <div className="text-center mt-16 space-y-4 animate-slide-in">
            <div className="inline-block p-6 rounded-2xl bg-gray-800/50 backdrop-blur shadow-xl">
              <p className="text-2xl font-semibold text-white mb-3">
                Ready to Start Learning?
              </p>
              <p className="text-gray-300">
                Paste a YouTube playlist URL to begin your focused learning journey
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 py-6 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-800/80 backdrop-blur shadow-lg">
            <span className="text-gray-300">Made with ❤️ by Amit</span>
            <a
              href="https://github.com/scificoder52"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-emerald-900/30 transition-colors"
            >
              <Github className="w-5 h-5 text-gray-300" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
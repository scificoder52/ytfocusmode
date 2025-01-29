import React, { useState } from 'react';
import { PlayCircle, Loader2 } from 'lucide-react';

interface PlaylistInputProps {
  onSubmit: (url: string) => void;
  loading?: boolean;
}

export const PlaylistInput: React.FC<PlaylistInputProps> = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto mb-8 animate-slide-in">
      <div className="flex gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube video or playlist URL here..."
          disabled={loading}
          className="flex-1 px-6 py-3 rounded-xl border-2 border-emerald-200 dark:border-emerald-900 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg focus:shadow-emerald-200/30 dark:focus:shadow-emerald-900/30 focus:border-emerald-500 dark:focus:border-emerald-600 outline-none transition-all duration-300 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-lg"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <PlayCircle size={20} />
          )}
          {loading ? 'Loading...' : 'Load Video'}
        </button>
      </div>
    </form>
  );
};
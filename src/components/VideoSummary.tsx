import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import { generateVideoSummary } from '../utils/gemini';
import { fetchVideoTranscript } from '../utils/youtube';

interface VideoSummaryProps {
  videoId: string;
}

export const VideoSummary: React.FC<VideoSummaryProps> = ({ videoId }) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [videoInfo, setVideoInfo] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadVideoInfo = async () => {
      try {
        const info = await fetchVideoTranscript(videoId);
        setVideoInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video information');
      }
    };

    loadVideoInfo();
  }, [videoId]);

  const cleanText = (text: string) => {
    return text.replace(/[*_`~]/g, '').trim();
  };

  const handleGenerateSummary = async () => {
    if (!videoInfo) {
      setError('No video information available.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let generatedSummary = await generateVideoSummary(videoInfo);
      let cleanedSummary = cleanText(generatedSummary);
      let pointwiseSummary = cleanedSummary.split('\n').map(line => `• ${line}`).join('\n');
      setSummary(pointwiseSummary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary';
      setError(errorMessage);
      
      if (errorMessage.includes('API quota exceeded') || errorMessage.includes('Invalid Gemini API key')) {
        setSummary('');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="mt-6 p-6 bg-transparent backdrop-blur rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          Smart Notes
        </h3>
        <div className="flex gap-2">
          {summary && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all"
              title={copied ? 'Copied!' : 'Copy notes'}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
          <button
            onClick={handleGenerateSummary}
            disabled={loading || !videoInfo}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Notes...
              </>
            ) : (
              'Generate Notes'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{error}</p>
            {(error.includes('API quota exceeded') || error.includes('Invalid Gemini API key')) && (
              <p className="mt-2 text-sm">
                To fix this:
                <ul className="list-disc ml-5 mt-1">
                  <li>Check if your Gemini API key is valid</li>
                  <li>Ensure you have available quota</li>
                  <li>Try again in a few minutes if quota is exceeded</li>
                </ul>
              </p>
            )}
          </div>
        </div>
      )}

      {summary && (
        <div className="prose dark:prose-invert max-w-none">
          <div className="p-4 bg-transparent rounded-lg">
            {summary.split('\n').map((line, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300 mb-2">{line}</p>
            ))}
          </div>
        </div>
      )}

      {!summary && !error && !loading && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Click "Generate Notes" to get AI-powered study notes for this video
        </p>
      )}
    </div>
  );
};

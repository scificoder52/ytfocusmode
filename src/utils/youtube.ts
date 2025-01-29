import { Video } from '../types';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY?.trim();

const extractVideoOrPlaylistId = (url: string): { id: string; type: 'video' | 'playlist' } => {
  if (!url) {
    throw new Error('Please provide a YouTube URL');
  }

  // Check for playlist
  const playlistRegex = /[?&]list=([^&]+)/;
  const playlistMatch = url.match(playlistRegex);
  if (playlistMatch) {
    return { id: playlistMatch[1], type: 'playlist' };
  }

  // Check for video ID
  const videoRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const videoMatch = url.match(videoRegex);
  if (videoMatch) {
    return { id: videoMatch[1], type: 'video' };
  }

  throw new Error('Invalid YouTube URL. Please provide a valid YouTube video or playlist URL.');
};

async function fetchVideoDetails(videoId: string): Promise<Video> {
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured. Please check your environment variables.');
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error('YouTube API Error:', error);
      if (error.error?.code === 403) {
        throw new Error('YouTube API key is invalid or has exceeded its quota. Please check your API key.');
      }
      throw new Error(error.error?.message || 'Failed to fetch video data');
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found or is private/unavailable');
    }
    
    return {
      id: videoId,
      title: data.items[0].snippet.title,
      completed: false,
    };
  } catch (error) {
    console.error('Error in fetchVideoDetails:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch video details');
  }
}

async function fetchPlaylistItems(playlistId: string, pageToken = ''): Promise<any> {
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured. Please check your environment variables.');
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error('YouTube API Error:', error);
      if (error.error?.code === 403) {
        throw new Error('YouTube API key is invalid or has exceeded its quota. Please check your API key.');
      } else if (error.error?.code === 404) {
        throw new Error('Playlist not found or is private/unavailable');
      }
      throw new Error(error.error?.message || 'Failed to fetch playlist data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in fetchPlaylistItems:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch playlist items');
  }
}

export const fetchPlaylistVideos = async (url: string): Promise<Video[]> => {
  try {
    const { id, type } = extractVideoOrPlaylistId(url);
    
    if (type === 'video') {
      const video = await fetchVideoDetails(id);
      return [video];
    }
    
    // Handle playlist
    const videos: Video[] = [];
    let nextPageToken = '';
    
    do {
      const data = await fetchPlaylistItems(id, nextPageToken);
      
      const newVideos = data.items
        .filter((item: any) => 
          item.snippet.title !== 'Private video' && 
          item.snippet.title !== 'Deleted video' &&
          item.snippet.resourceId?.videoId
        )
        .map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          completed: false,
        }));
      
      videos.push(...newVideos);
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);
    
    if (videos.length === 0) {
      throw new Error('No accessible videos found in this playlist');
    }
    
    return videos;
  } catch (error) {
    console.error('Error in fetchPlaylistVideos:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to load playlist. Please check the URL and try again.');
  }
};

export const fetchVideoTranscript = async (videoId: string): Promise<string> => {
  if (!videoId) {
    throw new Error('Video ID is required');
  }

  if (!API_KEY) {
    throw new Error('YouTube API key is not configured. Please check your environment variables.');
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('YouTube API Error:', error);
      
      if (error.error?.code === 403) {
        throw new Error('YouTube API key is invalid or has exceeded its quota. Please check your API key.');
      }
      if (error.error?.code === 404) {
        throw new Error('Video not found or is private/unavailable');
      }
      throw new Error(error.error?.message || 'Failed to fetch video details');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found or is private/unavailable');
    }

    const videoData = data.items[0].snippet;
    const contentDetails = data.items[0].contentDetails;

    // Format the video information in a structured way
    const formattedInfo = [
      `Title: ${videoData.title}`,
      `Duration: ${formatDuration(contentDetails.duration)}`,
      `Published: ${new Date(videoData.publishedAt).toLocaleDateString()}`,
      `Channel: ${videoData.channelTitle}`,
      '',
      'Description:',
      videoData.description || 'No description available'
    ].join('\n');

    return formattedInfo;
  } catch (error) {
    console.error('Error in fetchVideoTranscript:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to load video details. Please try again.');
  }
};

// Helper function to format ISO 8601 duration to human-readable format
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'Unknown duration';

  const [, hours, minutes, seconds] = match;
  const parts = [];

  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
}
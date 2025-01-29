# YouTube Playlist Summarizer & Ad-Free Player

## Overview
This project allows users to paste a YouTube playlist link, watch videos without ads or trackers, and receive AI-generated summaries for each video using Gemini API and YouTube API.

## Features
- **Ad-free video playback**: Watch YouTube videos without ads or trackers.
- **Playlist support**: Paste a YouTube playlist URL and load all videos.
- **AI-powered summaries**: Get a concise summary of each video using Gemini API.
- **Clean UI**: Minimalist design for an optimal viewing experience.

## Tech Stack
- **Frontend**: Next.js + TypeScript (for UI & video player)
- **Backend**: Node.js + Express
- **APIs Used**:
  - [YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com) (for fetching video data & streaming links)
  - [Gemini API](https://ai.google.dev/) (for advanced AI-based text processing)

## Setup Instructions

### Prerequisites
- Node.js installed (>=16.x recommended)
- API keys for:
  - [YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com)
  - [Gemini API](https://ai.google.dev/)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/yt-playlist-summarizer.git
   cd yt-playlist-summarizer
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):
   ```sh
   YOUTUBE_API_KEY=your_youtube_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend server:
   ```sh
   node server.js
   ```
5. Start the frontend:
   ```sh
   npm run dev
   ```

## Usage
1. Paste a YouTube playlist link into the input field.
2. The app will fetch all videos from the playlist.
3. Click on any video to watch it ad-free.
4. The AI will generate and display a summary of the video content.

## Future Enhancements
- Support for downloading transcripts
- Multi-language support
- User authentication & history tracking

## License
This project is licensed under the [MIT License](LICENSE).


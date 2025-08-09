import React, { useState } from "react";

export default function VideoInput({ onSubmit }) {
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    if (!url) return;
    const videoId = extractVideoId(url);
    onSubmit(videoId);
    setUrl("");
  };

  const extractVideoId = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow flex space-x-2">
      <input
        type="text"
        placeholder="Enter YouTube URL or ID"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Load
      </button>
    </div>
  );
}

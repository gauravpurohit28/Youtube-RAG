import React, { useState } from "react";

export default function VideoInput({ onSubmit }) {
  const [url, setUrl] = useState("");
  const [previewId, setPreviewId] = useState("");

  const handleSubmit = () => {
    if (!url) return;
    const videoId = extractVideoId(url);
    if (!videoId) return;
    setPreviewId(videoId);
    onSubmit(videoId);
    setUrl("");
  };

  const extractVideoId = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : url.length === 11 ? url : null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 w-full">
      <div className="flex space-x-2">
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

      {previewId && (
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${previewId}`}
            title="YouTube video preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      )}
    </div>
  );
}

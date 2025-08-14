import React, { useState } from "react";

export default function VideoInput({ onSubmit, disabled }) {
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
    <div className="card p-4 md:p-5 space-y-4 w-full">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Paste YouTube URL or ID"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={disabled}
          className="input-dark flex-grow rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff0000]/60 transition disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="btn-red px-4 md:px-5 py-2.5 rounded-md font-medium whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Load Video
        </button>
      </div>

      {previewId && (
        <div className="rounded-lg overflow-hidden border border-[#2a2a2a]">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${previewId}`}
            title="YouTube video preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          >
          </iframe>
        </div>
      )}
    </div>
  );
}

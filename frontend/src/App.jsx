import React, { useState, useRef } from "react";
import Header from "./components/header";
import VideoInput from "./components/VideoInput";
import QuestionInput from "./components/QuestionInput";
import AnswerBox from "./components/AnswerBox";
import Loader from "./components/Loader";
import VideoPlayer from "./components/VideoPlayer";
import SearchBar from "./components/SearchBar";

const API_BASE = "http://127.0.0.1:5000/api";

function App() {
  const [videoId, setVideoId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const playerRef = useRef(null); 

  const handleVideoSubmit = async (id) => {
    if (!id) return setStatus("Invalid video ID");

    setLoading(true);
    setStatus("Loading video...");
    try {
      const res = await fetch(`${API_BASE}/load_video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: id }),
      });

      const data = await res.json();
      if (!res.ok) return setStatus(data.error || "Failed to load video");

      setVideoId(data.videoId || id);
      setStatus("Video loaded successfully!");
      setAnswer("");
      setSources([]);
    } catch (err) {
      console.error("load_video error:", err);
      setStatus("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!videoId) return setStatus("Load a video first.");
    if (!question.trim()) return setStatus("Enter a question.");

    setLoading(true);
    setAnswer("");
    setSources([]);
    setStatus("Fetching answer...");
    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, question }),
      });

      const data = await res.json();
      if (!res.ok) return setStatus(data.error || "Failed to get answer");

      setAnswer(data.answer || "No answer returned");
      setSources(data.sources || []);
      setStatus("Answer received!");
    } catch (err) {
      console.error("ask error:", err);
      setStatus("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  const seekTo = (seconds) => {
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(seconds);
    } else {
      const url = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(seconds)}s`;
      window.open(url, "_blank");
    }
  };

  const handleSearchSelect = (selectedVideoId) => {
    handleVideoSubmit(selectedVideoId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mt-6">
        
        
        <div className="bg-white rounded-lg shadow p-4 min-h-[300px] flex items-center justify-center">
          {videoId ? (
            <div className="w-full">
              <VideoPlayer ref={playerRef} videoId={videoId} />
            </div>
          ) : (
            <p className="text-gray-400">No video loaded</p>
          )}
        </div>

        
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
          <SearchBar apiBase={API_BASE} onSelect={handleSearchSelect} disabled={loading} />
          <VideoInput onSubmit={handleVideoSubmit} disabled={loading} />
          {status && <p className="text-sm text-gray-700">{status}</p>}
          {loading && <Loader />}
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
          <QuestionInput
            question={question}
            setQuestion={setQuestion}
            onAsk={handleAskQuestion}
            disabled={loading}
          />
          {answer ? (
            <AnswerBox answer={answer} sources={sources} onSeek={seekTo} />
          ) : (
            <p className="text-gray-400">No answer yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

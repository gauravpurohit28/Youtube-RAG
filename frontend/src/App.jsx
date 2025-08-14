import React, { useState, useRef } from "react";
import Header from "./components/header";
import VideoPlayer from "./components/VideoPlayer";
import SearchBar from "./components/SearchBar";
import VideoInput from "./components/VideoInput";
import QuestionInput from "./components/QuestionInput";
import AnswerBox from "./components/AnswerBox";
import Loader from "./components/Loader";

const API_BASE = "https://youtube-rag-jyg1.onrender.com/api";

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

    // setLoading(true);
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row gap-6 px-4 pt-24 pb-8 max-w-7xl mx-auto w-full">
        <section className="flex-1 flex flex-col items-center">
          <div className="relative w-full max-w-2xl mb-4">
            {videoId ? (
              <VideoPlayer ref={playerRef} videoId={videoId} />
            ) : (
              <div className="w-full aspect-video bg-[#101010] rounded-xl border border-[#2a2a2a] grid place-items-center text-[#666666]">
                {!loading && <p>No video loaded</p>}
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/50 grid place-items-center text-white gap-3 z-10 rounded-xl">
                <Loader />
              </div>
            )}
          </div>
          <div className="w-full max-w-2xl space-y-3">
            <SearchBar apiBase={API_BASE} onSelect={handleSearchSelect} disabled={loading} />
            <VideoInput onSubmit={handleVideoSubmit} disabled={loading} />
            {status && <p className="text-sm text-[#aaaaaa]">{status}</p>}
          </div>
        </section>

        <aside className="flex-1 flex flex-col space-y-4">
          <QuestionInput
            question={question}
            setQuestion={setQuestion}
            onAsk={handleAskQuestion}
            disabled={loading}
          />
          <div className="card p-4 flex-1 overflow-y-auto">
            {answer ? (
              <AnswerBox answer={answer} sources={sources} onSeek={seekTo} />
            ) : (
              <p className="text-[#777777]">No answer yet</p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;

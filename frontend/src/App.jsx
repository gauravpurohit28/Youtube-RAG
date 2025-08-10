import React, { useState } from "react";
import Header from "./components/header";
import VideoInput from "./components/VideoInput";
import QuestionInput from "./components/QuestionInput";
import AnswerBox from "./components/AnswerBox";
import Loader from "./components/Loader";

const API_BASE = "https://youtube-rag-backend-8j6y.onrender.com/api";

function App() {
  const [videoId, setVideoId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleVideoSubmit = async (id) => {
    if (!id) {
      setStatus("Invalid video ID");
      return;
    }
    setLoading(true);
    setStatus("Loading video...");
    try {
      const res = await fetch(`${API_BASE}/load_video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Failed to load video");
        return;
      }

      setVideoId(data.videoId || id);
      setStatus("Video loaded successfully!");
    } catch (err) {
      console.error("load_video error:", err);
      setStatus("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!videoId) {
      setStatus("Load a video first.");
      return;
    }
    if (!question.trim()) {
      setStatus("Enter a question.");
      return;
    }

    setLoading(true);
    setAnswer("");
    setStatus("Fetching answer...");
    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, question }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Failed to get answer");
        return;
      }

      setAnswer(data.answer || "No answer returned");
      setStatus("Answer received!");
    } catch (err) {
      console.error("ask error:", err);
      setStatus("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Header />
      <div className="w-full max-w-2xl space-y-6">
        <VideoInput onSubmit={handleVideoSubmit} disabled={loading} />
        <QuestionInput
          question={question}
          setQuestion={setQuestion}
          onAsk={handleAskQuestion}
          disabled={loading}
        />
        {status && <p className="text-sm text-gray-700">{status}</p>}
        {loading && <Loader />}
        {answer && <AnswerBox answer={answer} />}
      </div>
    </div>
  );
}

export default App;

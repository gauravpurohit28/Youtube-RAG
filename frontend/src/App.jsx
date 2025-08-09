import React ,{ useState } from "react";
import Header from "./components/Header";
import VideoInput from "./components/VideoInput";
import QuestionInput from "./components/QuestionInput";
import AnswerBox from "./components/AnswerBox";
import Loader from "./components/Loader";

function App() {
  const [videoId, setVideoId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVideoSubmit = (id) => {
    setVideoId(id);
    toast.success("Video loaded successfully!");
  };

  const handleAskQuestion = async () => {
    if (!videoId || !question) {
      toast.error("Please provide both video and question.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_id: videoId, question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      toast.error("Error getting answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Header />
      <div className="w-full max-w-2xl space-y-6">
        <VideoInput onSubmit={handleVideoSubmit} />
        <QuestionInput
          question={question}
          setQuestion={setQuestion}
          onAsk={handleAskQuestion}
        />
        {loading && <Loader />}
        {answer && <AnswerBox answer={answer} />}
      </div>
    </div>
  );
}

export default App;

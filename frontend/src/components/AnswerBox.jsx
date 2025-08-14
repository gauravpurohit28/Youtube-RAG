import React from "react";
import ReactMarkdown from "react-markdown";

export default function AnswerBox({ answer = "", sources, onSeek }) {
  const safeSources = Array.isArray(sources) ? sources : [];

  // format seconds -> mm:ss
  const fmt = (s) => {
    if (s == null || isNaN(s)) return "";
    const sec = Math.floor(s);
    const m = Math.floor(sec / 60);
    const ss = sec % 60;
    return `${m}:${ss.toString().padStart(2, "0")}`;
  };

  return (
    <div className="card p-5 md:p-6 max-h-[900px] flex flex-col overflow-y-auto fade-in">
      <h3 className="text-xl font-bold text-white border-b border-[#2a2a2a] pb-2">Answer</h3>

      <div className="mt-4 flex-1 prose prose-invert prose-p:leading-relaxed prose-headings:text-white prose-strong:text-white prose-a:text-[#ff4d4d]">
        {answer ? <ReactMarkdown>{answer}</ReactMarkdown> : "No answer available."}
      </div>

      {safeSources.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-[#dddddd] mb-3 border-b border-[#2a2a2a] pb-1">Sources</h4>
          <div className="space-y-3">
            {safeSources.map((s, idx) => (
              <div
                key={idx}
                className="p-3 border border-[#2a2a2a] rounded-lg bg-[#1c1c1c] hover:bg-[#232323] transition"
              >
                <div className="text-sm text-[#c7c7c7]">{s.text || "No source text"}</div>
                {typeof s.start === "number" && (
                  <div className="mt-2">
                    <button
                      className="link-red text-sm font-medium"
                      onClick={() => onSeek(Math.floor(s.start))}
                    >
                      Jump to {fmt(s.start)}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

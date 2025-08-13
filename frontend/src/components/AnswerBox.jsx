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
    <div className="bg-white p-6 rounded-xl shadow-lg max-h-[900px] flex flex-col overflow-y-auto">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Answer</h3>

      <div className="mt-4 flex-1 prose prose-sm sm:prose-base">
        {answer ? <ReactMarkdown>{answer}</ReactMarkdown> : "No answer available."}
      </div>

      {safeSources.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-3 border-b pb-1">Sources</h4>
          <div className="space-y-3">
            {safeSources.map((s, idx) => (
              <div
                key={idx}
                className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="text-sm text-gray-600">{s.text || "No source text"}</div>
                {typeof s.start === "number" && (
                  <div className="mt-2">
                    <button
                      className="text-blue-600 text-sm font-medium hover:underline"
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

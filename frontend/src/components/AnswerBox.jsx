import React from "react";

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
    <div className="bg-white p-4 rounded shadow">
      <h4 className="font-semibold">Answer</h4>

      <div className="mt-2 whitespace-pre-wrap">
        {answer || "No answer available."}
      </div>

      {safeSources.length > 0 && (
        <>
          <h5 className="mt-4 font-medium">Sources</h5>
          <div className="mt-2 space-y-2">
            {safeSources.map((s, idx) => (
              <div key={idx} className="p-2 border rounded">
                <div className="text-sm text-gray-600">
                  {s.text || "No source text"}
                </div>
                {typeof s.start === "number" && (
                  <div className="mt-2">
                    <button
                      className="text-blue-600 text-sm"
                      onClick={() => onSeek(Math.floor(s.start))}
                    >
                      Jump to {fmt(s.start)}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

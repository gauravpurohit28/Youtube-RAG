import React from "react";

export default function QuestionInput({ question, setQuestion, onAsk }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex space-x-2">
      <input
        type="text"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={onAsk}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Ask
      </button>
    </div>
  );
}

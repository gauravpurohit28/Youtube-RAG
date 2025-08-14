import React from "react";

export default function QuestionInput({ question, setQuestion, onAsk, disabled }) {
  return (
    <div className="card p-4 md:p-5">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-[#aaaaaa]">Your question</label>
        <textarea
          placeholder="Ask something about the video..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          disabled={disabled}
          className="input-dark w-full rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff0000]/60 transition disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <div className="flex justify-end">
          <button
            onClick={onAsk}
            disabled={disabled}
            className="btn-red px-5 py-2.5 rounded-md font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

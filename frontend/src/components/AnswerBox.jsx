import React from "react";
import ReactMarkdown from "react-markdown";

function AnswerBox({ answer }) {
  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h2 className="font-bold mb-2 text-lg">Answer:</h2>
      <div className="prose">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </div>
  );
}

export default AnswerBox;

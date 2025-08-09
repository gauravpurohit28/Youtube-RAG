export default function AnswerBox({ answer }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold text-gray-700 mb-2">Answer:</h2>
      <p className="text-gray-800">{answer}</p>
    </div>
  );
}

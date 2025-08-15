export default function Loader() {
  return (
    <div className="flex flex-col items-center">
      <svg className="animate-spin h-8 w-8 text-red-500 mb-2" viewBox="0 0 24 24">
        {/* spinner svg */}
      </svg>
      <span className="text-gray-300">Loading...</span>
    </div>
  );
}
import { PlayCircleIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

export default function Header() {
  return (
    <header className="flex flex-col items-center gap-3 py-6 bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg rounded-b-2xl">
      {/* Icon Row */}
      <div className="flex items-center gap-2">
        <PlayCircleIcon className="w-12 h-12 text-white drop-shadow-md" />
        <ChatBubbleLeftRightIcon className="w-10 h-10 text-white drop-shadow-md" />
      

      {/* Title */}
      <div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm">
        YouTube RAG Assistant
      </h1>
      <p className="text-lg md:text-xl text-gray-100 max-w-2xl text-center">
        Ask context-aware questions about any YouTube video — powered by AI.
      </p>
      </div>
      </div>

      {/* Subtitle */}
      
    </header>
  );
}

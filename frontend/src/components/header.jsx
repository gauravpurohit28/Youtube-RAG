import { PlayCircleIcon } from "@heroicons/react/24/solid";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[#202020]/70 bg-[#202020]/90 border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#ff0000] grid place-items-center shadow-[0_0_24px_rgba(255,0,0,0.35)]">
            <PlayCircleIcon className="w-6 h-6 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-white font-bold text-lg tracking-tight">YouTube RAG</div>
            <div className="text-[#aaaaaa] text-[12px]">Ask questions with AI + transcripts</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-sm text-[#aaaaaa]">
          <a href="https://github.com/gauravpurohit28/Youtube-RAG"className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </header>
  );
}

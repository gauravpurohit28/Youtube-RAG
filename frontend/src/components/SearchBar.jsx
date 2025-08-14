import React, { useState } from "react";

export default function SearchBar({ apiBase, onSelect, disabled }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      if (res.ok) setResults(data.items || []);
      else setResults([]);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 md:p-5">
      <div className="flex gap-2">
        <input
          className="input-dark flex-1 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff0000]/60 transition disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder="Search YouTube videos..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={disabled}
        />
        <button className="btn-red px-4 py-2.5 rounded-md font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={doSearch} disabled={disabled || loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
        {results.map((it) => (
          <div key={it.videoId} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-[#2a2a2a] transition" onClick={() => onSelect(it.videoId)}>
            <img src={it.thumbnail} alt="" className="w-20 h-12 object-cover rounded" />
            <div>
              <div className="font-medium text-white line-clamp-2">{it.title}</div>
              <div className="text-sm text-[#aaaaaa]">{it.channelTitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

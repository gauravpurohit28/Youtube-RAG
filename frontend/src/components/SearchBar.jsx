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
    <div className="bg-white p-3 rounded shadow">
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Search YouTube videos..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={disabled}
        />
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={doSearch} disabled={disabled || loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {results.map((it) => (
          <div key={it.videoId} className="flex items-center gap-3 cursor-pointer" onClick={() => onSelect(it.videoId)}>
            <img src={it.thumbnail} alt="" className="w-20 h-12 object-cover rounded" />
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-gray-500">{it.channelTitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

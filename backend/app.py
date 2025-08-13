from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, CouldNotRetrieveTranscript
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
import faiss
import numpy as np 
import dotenv
import os
import requests
import re

dotenv.load_dotenv()  

# Gemini API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

app = Flask(__name__)
CORS(app)

video_store = {}
EMBED_MODEL_NAME = 'all-MiniLM-L6-v2'
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

def fetch_transcript_entries(video_id):
    try:
        ytt_api = YouTubeTranscriptApi()
        entries = ytt_api.fetch(video_id, languages=['en'])
        return entries

    except TranscriptsDisabled:
        raise Exception("Transcript fetch error: Captions are disabled for this video.")
    except NoTranscriptFound:
        raise Exception("Transcript fetch error: No transcript available in the requested language.")
    except CouldNotRetrieveTranscript:
        raise Exception("Transcript fetch error: YouTube is blocking requests from your IP. "
                        "Consider using a proxy or run locally.")
    except Exception as e:
        raise Exception(f"Transcript fetch error: {e}")

import re

def build_chunks_with_timestamps(entries, chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP):
    """
    Build transcript chunks with timestamps.
    Ensures chunks end at sentence boundaries, avoids cutting words,
    and preserves overlap using whole sentences for context.
    """

    sentences_with_time = []
    for entry in entries:
        if isinstance(entry, dict):
            text = entry.get("text", "").strip()
            start = entry.get("start", 0)
        else:
            text = getattr(entry, "text", "").strip()
            start = getattr(entry, "start", 0)
        if not text:
            continue

        # Split transcript text into sentences
        sentences = re.split(r'(?<=[.!?]) +', text)
        for s in sentences:
            if s.strip():
                sentences_with_time.append((s.strip(), start))

    chunks = []
    current_sentences = []
    current_start = None
    current_length = 0

    i = 0
    while i < len(sentences_with_time):
        sentence, start = sentences_with_time[i]
        if current_start is None:
            current_start = start

        if current_length + len(sentence) + 1 <= chunk_size:
            current_sentences.append(sentence)
            current_length += len(sentence) + 1
            i += 1
        else:
            # Save current chunk
            chunks.append({"text": " ".join(current_sentences), "start": current_start})

            # Overlap: keep last N characters worth of sentences
            overlap_chars = 0
            overlap_sentences = []
            for s_text in reversed(current_sentences):
                if overlap_chars + len(s_text) + 1 <= chunk_overlap:
                    overlap_sentences.insert(0, s_text)
                    overlap_chars += len(s_text) + 1
                else:
                    break

            current_sentences = overlap_sentences
            current_length = sum(len(s) + 1 for s in current_sentences)
            current_start = start if current_sentences else None

    if current_sentences:
        chunks.append({"text": " ".join(current_sentences), "start": current_start or 0})

    return chunks

def process_video(video_id):
    entries = fetch_transcript_entries(video_id)
    chunks_with_ts = build_chunks_with_timestamps(entries)

    texts = [c["text"] for c in chunks_with_ts]
    starts = [c["start"] for c in chunks_with_ts]

    model = SentenceTransformer(EMBED_MODEL_NAME)
    embeddings = model.encode(texts, show_progress_bar=False)

    # FAISS 
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings).astype('float32'))

    video_store[video_id] = {
        "chunks": texts,
        "starts": starts,
        "model": model,
        "index": index
    }

def get_relevant_chunks(video_id, query, top_k=5):
    data = video_store[video_id]
    query_embedding = data["model"].encode([query])
    distances, indices = data["index"].search(np.array(query_embedding).astype('float32'), top_k)
    results = []
    for i in indices[0]:
        if i < 0 or i >= len(data["chunks"]):
            continue
        results.append({"text": data["chunks"][i], "start": data["starts"][i]})
    return results

def ask_gemini(video_id, question):
    retrieved = get_relevant_chunks(video_id, question, top_k=5)
    context = "\n\n".join([f"[{format_seconds(r['start'])}] {r['text']}" for r in retrieved])

    prompt = f"""
You are an assistant that answers questions based strictly on the provided video transcript excerpts.

From the context below, identify and summarize all the key points that answer the question.
If multiple points are mentioned, list them in a clear, well-structured format (bullet points or numbered list).
Where helpful, briefly expand on each point using the details present in the transcript — 
but do NOT add any information that is not in the context.

Be as informative as possible while remaining faithful to the transcript.


Context:
{context}

Question:
{question}

Answer (concise summary based only on the above context):
"""

    model = genai.GenerativeModel('models/gemini-2.0-flash')
    response = model.generate_content(prompt)
    answer_text = response.text.strip() if hasattr(response, 'text') else str(response).strip()

    return answer_text, retrieved


def format_seconds(s):
    try:
        s = float(s)
    except:
        s = 0.0
    minutes = int(s // 60)
    seconds = int(s % 60)
    return f"{minutes}:{str(seconds).zfill(2)}"

@app.route("/api/load_video", methods=["POST"])
def load_video():
    data = request.json
    video_id = data.get("videoId", "")

    try:
        process_video(video_id)
        return jsonify({"message": "Video processed successfully", "videoId": video_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/ask", methods=["POST"])
def ask_question():
    data = request.json
    video_id = data.get("videoId", "")
    question = data.get("question", "")

    if video_id not in video_store:
        return jsonify({"error": "Video not loaded yet"}), 400

    try:
        answer, retrieved = ask_gemini(video_id, question)
        return jsonify({"answer": answer, "sources": retrieved})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/search", methods=["GET"])
def yt_search():
    q = request.args.get("q", "")
    if not q:
        return jsonify({"items": []})
    if not YOUTUBE_API_KEY:
        return jsonify({"error": "YOUTUBE_API_KEY not configured"}), 500

    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": q,
        "type": "video",
        "maxResults": 6,
        "key": YOUTUBE_API_KEY
    }
    r = requests.get(url, params=params, timeout=10)
    if r.status_code != 200:
        return jsonify({"error": "YouTube API error", "details": r.text}), 500

    resp = r.json()
    items = []
    for it in resp.get("items", []):
        vid = it["id"]["videoId"]
        snippet = it["snippet"]
        items.append({
            "videoId": vid,
            "title": snippet.get("title"),
            "thumbnail": snippet.get("thumbnails", {}).get("default", {}).get("url"),
            "channelTitle": snippet.get("channelTitle")
        })
    return jsonify({"items": items})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Flask server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)

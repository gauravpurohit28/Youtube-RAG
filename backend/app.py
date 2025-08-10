from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
import faiss
import numpy as np 
import dotenv
import os

dotenv.load_dotenv()  

#Gemini API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = Flask(__name__)
CORS(app)

video_store = {}


def fetch_transcript(video_id):
    try:
        fetched = YouTubeTranscriptApi().fetch(video_id, languages=["en"])
        raw_transcript = fetched.to_raw_data()
        transcript = " ".join(entry["text"] for entry in raw_transcript)
        return transcript
    except TranscriptsDisabled:
        raise Exception("No captions available for this video.")
    except NoTranscriptFound:
        raise Exception("No transcript found in the requested language.")
    except VideoUnavailable:
        raise Exception("The video is unavailable.")
    except Exception as e:
        raise Exception(str(e))

def process_video(video_id):
    transcript = fetch_transcript(video_id)

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(transcript)

    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(chunks)

    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))

    video_store[video_id] = {
        "chunks": chunks,
        "model": model,
        "index": index
    }

def get_relevant_chunks(video_id, query, top_k=5):
    data = video_store[video_id]
    query_embedding = data["model"].encode([query])
    distances, indices = data["index"].search(np.array(query_embedding), top_k)
    return [data["chunks"][i] for i in indices[0]]

def ask_gemini(video_id, question):
    retrieved_chunks = get_relevant_chunks(video_id, question)
    context = "\n".join(retrieved_chunks)

    prompt = f"""Answer the question based on the below video transcript:

    Transcript Chunks:
    {context}

    Question:
    {question}

    Answer:"""

    model = genai.GenerativeModel('models/gemini-2.0-flash')
    response = model.generate_content(prompt)
    return response.text


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
        answer = ask_gemini(video_id, question)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Flask server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)

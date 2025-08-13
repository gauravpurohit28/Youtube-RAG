from youtube_transcript_api import YouTubeTranscriptApi

print(dir(YouTubeTranscriptApi))



def fetch_transcript_entries(video_id):
    # try:
        # Try English first
        try:
            ytt_api = YouTubeTranscriptApi()
            transcript_list = ytt_api.list(video_id)
            return ytt_api.fetch(video_id, languages=['en'])

        # except YouTubeTranscriptApi.CouldNotRetrieveTranscript:
        #     # Fallback: get transcripts in all languages
        #     transcripts = YouTubeTranscriptApi.get_transcripts([video_id])
        #     transcript_dict = transcripts[0]  # First item in the tuple is transcripts
        #     if 'en' in transcript_dict:
        #         entries = transcript_dict['en']
        #     else:
        #         # Pick first available language
        #         first_lang = next(iter(transcript_dict))
        #         entries = transcript_dict[first_lang]
        # return entries
    
    # except Exception as e:
    #     raise Exception(f"Transcript fetch error: {e}")
    
fetch_transcript_entries('xAt1xcC6qfM')


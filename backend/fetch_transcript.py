from youtube_transcript_api import YouTubeTranscriptApi
import sys

def transcribe(data):
    transcript = ''
    for value in data:
        if 'text' in value:
            transcript += value['text'] + ' '
    return transcript

# Corrected: Pass proxies to the get_transcript method
proxies = {
    "http": "http://proxy.goproxy.com:30000",
    "https": "http://proxy.goproxy.com:30000"
}

try:
    transcript_data = YouTubeTranscriptApi.get_transcript(sys.argv[1], proxies=proxies)
    print(transcribe(transcript_data))
except Exception as e:
    print(f"An error occurred: {e}")

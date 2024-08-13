from youtube_transcript_api import YouTubeTranscriptApi
import sys



def transcribe(data):
    transcript = ''
    for value in data:
      for key,val in value.items():
        
        if key=='text':
          transcript += val+' '
    return transcript


print(transcribe(YouTubeTranscriptApi.get_transcript(sys.argv[1])))
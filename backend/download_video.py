import sys
from pytubefix import YouTube
import os

def download_video(url, output_dir):
    try:
        yt = YouTube(url)
        stream = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
        
        if not stream:
            raise Exception("No suitable stream found")
        
        # Generate a filename based on the video title
        filename = f"{yt.title}.mp4"
        # Remove any characters that are invalid for filenames
        filename = "".join(c for c in filename if c.isalnum() or c in (' ', '.', '_')).rstrip()
        
        output_path = os.path.join(output_dir, filename)
        stream.download(output_path=output_dir, filename=filename)
        print(f"Video downloaded to: {output_path}")
    except Exception as e:
        print(f"Error downloading video: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python download_video.py <YouTube URL> <Output Directory>")
        sys.exit(1)
    
    url = sys.argv[1]
    output_dir = sys.argv[2]
    download_video(url, output_dir)
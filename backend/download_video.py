import sys
import os
import yt_dlp

def download_video(url, output_dir):
    try:
        ydl_opts = {
            'format': 'best[ext=mp4]/best',
            'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
            'restrictfilenames': True,
            'no_warnings': True,
            'ignoreerrors': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            print(f"Video downloaded to: {filename}")
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
import sys
import os
import yt_dlp
import time
import random
from fake_useragent import UserAgent
from urllib.parse import urlparse

def get_random_proxy():
    try:
        with open('proxies.txt', 'r') as f:
            proxies = f.read().splitlines()
        return random.choice(proxies) if proxies else None
    except FileNotFoundError:
        print("proxies.txt file not found. No proxy will be used.")
        return None
    except Exception as e:
        print(f"Error reading proxies: {str(e)}")
        return None

def get_referrer(url):
    parsed_url = urlparse(url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}"

def download_video(url, output_dir):
    try:
        ua = UserAgent()
        proxy = get_random_proxy()
        ydl_opts = {
            'format': 'best[ext=mp4]/best',
            'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
            'restrictfilenames': True,
            'user-agent': ua.random,
            'referer': get_referrer(url),
            'sleep_interval': random.uniform(1, 3),  # Random delay between 1-3 seconds
            'max_sleep_interval': 5,
            'noprogress': True,  # Disable progress bar to reduce console output
        }
        
        if proxy:
            ydl_opts['proxy'] = proxy
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            print(f"Video downloaded to: {filename}")
    except Exception as e:
        print(f"Error downloading video: {str(e)}", file=sys.stderr)
        sys.exit(1)

def main():
    if len(sys.argv) != 3:
        print("Usage: python download_video.py <YouTube URL> <Output Directory>")
        sys.exit(1)
    
    url = sys.argv[1]
    output_dir = sys.argv[2]
    
    # Implement request throttling
    max_retries = 3
    retry_delay = 60  # seconds
    
    for attempt in range(max_retries):
        try:
            download_video(url, output_dir)
            break
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"Attempt {attempt + 1} failed. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print(f"Max retries reached. Failed to download video.")
                sys.exit(1)

if __name__ == "__main__":
    main()
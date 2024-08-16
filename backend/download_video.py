import sys
import os
import yt_dlp
import time
import random
from fake_useragent import UserAgent
from urllib.parse import urlparse

def get_proxies():
    try:
        with open('proxies.txt', 'r') as f:
            proxies = f.read().splitlines()
        return proxies if proxies else []
    except FileNotFoundError:
        print("proxies.txt file not found. No proxy will be used.")
        return []
    except Exception as e:
        print(f"Error reading proxies: {str(e)}")
        return []

def get_referrer(url):
    parsed_url = urlparse(url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}"

def download_video(url, output_dir, proxy=None):
    try:
        ua = UserAgent()
        ydl_opts = {
            'cookiesfrombrowser': ('chrome'),
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
            return True
    except Exception as e:
        print(f"Error downloading video with proxy {proxy}: {str(e)}", file=sys.stderr)
        return False

def main():
    if len(sys.argv) != 3:
        print("Usage: python download_video.py <YouTube URL> <Output Directory>")
        sys.exit(1)
    
    url = sys.argv[1]
    output_dir = sys.argv[2]
    
    proxies = get_proxies()
    if not proxies:
        print("No proxies available, proceeding without proxy.")
        download_video(url, output_dir)
        sys.exit(0)
    
    for proxy in proxies:
        print(f"Trying proxy: {proxy}")
        if download_video(url, output_dir, proxy):
            print("Video downloaded successfully.")
            sys.exit(0)
        else:
            print("Failed with this proxy, trying next...")
    
    print("All proxies failed. Unable to download the video.")
    sys.exit(1)

if __name__ == "__main__":
    main()

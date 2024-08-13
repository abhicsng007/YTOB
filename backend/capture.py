import cv2
import yt_dlp
import argparse
import os
import tempfile
import sys
from pathlib import Path

def safe_print(text):
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode('ascii', 'replace').decode('ascii'))

def download_video(url, output_path):
    ydl_opts = {
        'format': 'best[ext=mp4]/best',  # Prefer best quality MP4, fallback to best available
        'outtmpl': output_path,
        'quiet': True,
        'no_warnings': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            ydl.download([url])
            return True
        except Exception as e:
            safe_print(f"Error downloading video: {str(e)}")
            return False

def capture_screenshot(video_path, screenshot_time, output_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Error opening video file")

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if fps <= 0 or total_frames <= 0:
        raise ValueError("Invalid video properties")

    total_duration = total_frames / fps
    if float(screenshot_time) > total_duration:
        raise ValueError(f"Screenshot time exceeds video duration of {total_duration:.2f} seconds")

    frame_number = int(float(screenshot_time) * fps)
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)

    success, image = cap.read()
    if not success:
        raise Exception("Failed to capture screenshot")

    cv2.imwrite(output_path, image)
    cap.release()

def capture_youtube_screenshot(video_url, screenshot_time, output_path):
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_video_path = Path(temp_dir) / "temp_video.mp4"
            
            safe_print("Downloading video...")
            if not download_video(video_url, str(temp_video_path)):
                raise Exception("Failed to download video")

            safe_print("Capturing screenshot...")
            capture_screenshot(str(temp_video_path), screenshot_time, output_path)
            
            safe_print(f"Screenshot saved to: {output_path}")

    except Exception as e:
        safe_print(f"Error: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description="Capture a screenshot from a YouTube video")
    parser.add_argument("video_url", help="URL of the YouTube video")
    parser.add_argument("screenshot_time", type=float, help="Time in seconds to capture the screenshot")
    parser.add_argument("output_path", help="Output path for the screenshot")
    
    args = parser.parse_args()
    
    capture_youtube_screenshot(args.video_url, args.screenshot_time, args.output_path)

if __name__ == "__main__":
    main()
import { spawn } from 'child_process';
import { OpenAI } from '@langchain/openai';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';



ffmpeg.setFfmpegPath(ffmpegPath);

const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-render-domain.onrender.com'
  : 'http://localhost:5000';

export const generateShorts = async (req, res) => {
  const { url } = req.query;
  const videoId = extractVideoId(url);

  try {
    // Download video using Python script
     
    const videoPath = await downloadVideoWithPython(url,'./shorts');

    // Fetch transcript
    const transcript = await fetchTranscript(videoId);

    // Generate segments
    const instruction = `Segment the following transcript into YouTube shorts. Provide start and end times for each segment, along with a title. Give in JSON format with key title and value start and end time for shorts: ${transcript}`;

    const model = new OpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.9,
      openAIApiKey: process.env.OPENAI_API_KEY,
      maxTokens: 4000
    });

    const generatedBlogPost = await model.invoke(instruction);
    console.log('Raw AI response:', generatedBlogPost);
    const segments = await parseAIResponse(generatedBlogPost);

    if (segments.length === 0) {
      throw new Error('No valid segments generated.');
    }

    // Add a short delay before proceeding
    setTimeout(async () => {
      // Create shorts
      console.log('Starting to create shorts...');
      console.log('Video path:', videoPath);
      console.log('Segments:', JSON.stringify(segments, null, 2));

      const processedVideos = await createShorts(videoPath, segments);

      // Clean up
      try {
        console.log(`Attempting to delete video file at: ${videoPath}`);
        fs.unlinkSync(videoPath);
        console.log(`Deleted original video: ${videoPath}`);
      } catch (err) {
        console.error(`Error deleting original video: ${err}`);
      }

      console.log('Processed videos:', processedVideos);
      res.json({ data: processedVideos });
    }, 100);

  } catch (error) {
    console.error('Error in generateShorts:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};

async function downloadVideoWithPython(url, outputDir) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['download_video.py', url, outputDir]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        const match = stdoutData.match(/Video downloaded to: (.+)/);
        if (match) {
          const outputPath = match[1].trim();
          console.log(`Video downloaded successfully to ${outputPath}`);
          resolve(outputPath);
        } else {
          reject(new Error('Could not determine output path'));
        }
      } else {
        console.error(`Python process exited with code ${code}`);
        reject(new Error(`Failed to download video. Exit code: ${code}`));
      }
    });
  });
}

async function fetchTranscript(videoId) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['fetch_transcript.py', videoId]);

    let response = '';
    pythonProcess.stdout.on('data', (data) => {
      response += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(response.trim());
      } else {
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
  });
}

const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  } else {
    return "Invalid YouTube URL";
  }
};

function parseAIResponse(response) {
  try {
    const jsonString = response.match(/```json\n([\s\S]*?)\n```/)[1];
    const segments = JSON.parse(jsonString);

    return segments.map(segment => ({
      ...segment,
      start: timeToSeconds(segment.start),
      end: timeToSeconds(segment.end)
    }));
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return [];
  }
}

function timeToSeconds(timeString) {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
}

async function createShorts(videoPath, segments) {
  const processedVideos = [];

  for (const segment of segments) {
    let outputFileName = path.join('./shorts', `short_${segment.title.replace(/\s+/g, '_')}.mp4`);
    outputFileName = outputFileName.replace(/\\/g, '/');
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(videoPath)
        .inputOptions(`-ss ${segment.start}`)
        .outputOptions('-t', segment.end - segment.start)
        .outputOptions('-async 1')
        .videoCodec('libx264')
        .audioCodec('aac')
        .output(outputFileName)
        .on('start', (commandLine) => {
          console.log('FFmpeg process started:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${progress.percent}% done`);
        })
        .on('end', () => {
          console.log(`Short created: ${outputFileName}`);
          processedVideos.push({
            title: segment.title,
            fileName: `${baseUrl}/${outputFileName}`,
          });
          resolve();
        })
        .on('error', (err, stdout, stderr) => {
          console.error('Error:', err.message);
          console.error('ffmpeg stdout:', stdout);
          console.error('ffmpeg stderr:', stderr);
          reject(err);
        })
        .run();
    });
  }

  return processedVideos;
}

import { spawn } from 'child_process';
import { OpenAI } from '@langchain/openai';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);


// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// CloudFront distribution domain
const cloudFrontDomain = process.env.CLOUDFRONT_URL;

export const generateShorts = async (req, res) => {
  const { url } = req.query;
  const videoId = extractVideoId(url);

  try {
    const videoPath = await downloadVideoWithPython(url, path.join(__dirname, '../shorts'));
    const transcript = await fetchTranscript(videoId);

    const instruction = `Segment the following transcript into two 20 seconds YouTube shorts. Provide start and end times for each segment, along with a title. Give in JSON format with key title and value start and end time for shorts: ${transcript}`;

    const model = new OpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.9,
      openAIApiKey: process.env.OPENAI_API_KEY,
      maxTokens: 4000
    });

    const generatedBlogPost = await model.invoke(instruction);
    console.log('Raw AI response:', generatedBlogPost);
    const segments = parseAIResponse(generatedBlogPost);

    if (segments.length === 0) {
      throw new Error('No valid segments generated. AI response may be in an unexpected format.');
    }

    console.log('Starting to create shorts...');
    console.log('Video path:', videoPath);
    console.log('Segments:', JSON.stringify(segments, null, 2));

    const processedVideos = await createShorts(videoPath, segments);

    try {
      console.log(`Attempting to delete video file at: ${videoPath}`);
      fs.unlinkSync(videoPath);
      console.log(`Deleted original video: ${videoPath}`);
    } catch (err) {
      console.error(`Error deleting original video: ${err}`);
    }

    console.log('Processed videos:', processedVideos);
    res.json({ data: processedVideos });

  } catch (error) {
    console.error('Error in generateShorts:', error);
    res.status(500).json({ error: error.message });
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
    let jsonString = response;
    
    // Try to extract JSON from markdown code block if present
    const match = response.match(/```json\n([\s\S]*?)\n```/);
    if (match) {
      jsonString = match[1];
    }

    // Try parsing the JSON
    let parsedResponse = JSON.parse(jsonString);

    // Check if the response has a 'shorts' property
    let segments = parsedResponse.shorts || parsedResponse;

    // If segments is not an array, wrap it in an array
    if (!Array.isArray(segments)) {
      segments = [segments];
    }

    // Ensure each segment has the required properties
    return segments.filter(segment => segment.title && segment.start && segment.end)
                   .map(segment => ({
                     title: segment.title,
                     start: timeToSeconds(segment.start),
                     end: timeToSeconds(segment.end)
                   }));
  } catch (error) {
    console.error('Error parsing AI response:', error);
    console.error('Raw AI response:', response);
    return [];
  }
}

function timeToSeconds(timeString) {
  if (typeof timeString === 'number') {
    return timeString;  // Already in seconds
  }
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
}

async function detectCropArea(inputPath, duration) {
  const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`;
  const { stdout } = await execAsync(command);
  const videoDuration = parseFloat(stdout.trim());
  
  const sampleDuration = Math.min(duration, videoDuration);
  const cropCommand = `ffmpeg -i "${inputPath}" -t ${sampleDuration} -vf cropdetect -f null -`;
  
  const { stderr } = await execAsync(cropCommand);
  const cropLines = stderr.split('\n').filter(line => line.includes('crop='));
  const lastCropLine = cropLines[cropLines.length - 1];
  const match = lastCropLine.match(/crop=(\d+):(\d+):(\d+):(\d+)/);
  
  if (match) {
    const [, width, height, x, y] = match.map(Number);
    return { width, height, x, y };
  }
  
  throw new Error('Unable to detect crop area');
}

async function createShorts(videoPath, segments) {
  const processedVideos = [];
  const cropArea = await detectCropArea(videoPath, 10); // Sample first 10 seconds

  for (const segment of segments) {
    let outputFileName = path.join(__dirname, `../shorts/short_${segment.title.replace(/\s+/g, '_')}.mp4`);
    outputFileName = outputFileName.replace(/\\/g, '/');

    // Calculate vertical crop
    const targetAspectRatio = 9 / 16; // Vertical aspect ratio for Shorts
    const cropWidth = Math.min(cropArea.width, Math.floor(cropArea.height * targetAspectRatio));
    const cropX = cropArea.x + Math.floor((cropArea.width - cropWidth) / 2);

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(videoPath)
        .inputOptions(`-ss ${segment.start}`)
        .outputOptions('-t', segment.end - segment.start)
        .outputOptions('-async 1')
        .videoFilters([
          `crop=${cropWidth}:${cropArea.height}:${cropX}:${cropArea.y}`,
          `scale=${720}:${1280}:force_original_aspect_ratio=increase`,
          'crop=720:1280'
        ])
        .videoCodec('libx264')
        .audioCodec('aac')
        .output(outputFileName)
        .on('start', (commandLine) => {
          console.log('FFmpeg process started:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${progress.percent}% done`);
        })
        .on('end', async () => {
          console.log(`Short created: ${outputFileName}`);

          // Upload to S3
          try {
            const s3Key = `shorts/${path.basename(outputFileName)}`;
            const fileStream = fs.createReadStream(outputFileName);

            const uploadParams = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: s3Key,
              Body: fileStream,
              ContentType: 'video/mp4'
            };

            const result = await s3.upload(uploadParams).promise();
            fs.unlinkSync(outputFileName); // Delete local file after upload

            // Replace S3 URL with CloudFront URL
            const cloudFrontUrl = `https://${cloudFrontDomain}/${s3Key}`;
            processedVideos.push({
              title: segment.title,
              fileName: cloudFrontUrl,
            });
            console.log(`Uploaded to S3 and available via CloudFront: ${cloudFrontUrl}`);
            resolve();
          } catch (err) {
            console.error('Error uploading to S3:', err);
            reject(err);
          }
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
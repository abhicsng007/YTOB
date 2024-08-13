import express, { json } from 'express';
import { YoutubeTranscript } from 'youtube-transcript-api';
import { OpenAI } from 'openai';
import { config } from 'dotenv';

config();

const app = express();
const port = 3000;


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(json());

app.post('/process-video', async (req, res) => {
  try {
    const { videoId } = req.body;

    // Extract transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const fullText = transcript.map(entry => entry.text).join(' ');

    // Segment transcript using OpenAI
    const segmentedTranscript = await segmentTranscript(fullText);

    // Match segments with original transcript timings
    const segmentsWithTimings = matchSegmentsWithTimings(segmentedTranscript, transcript);

    res.json(segmentsWithTimings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the video' });
  }
});

async function segmentTranscript(fullText) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an AI assistant that segments long transcripts into shorter, coherent segments suitable for YouTube Shorts. Each segment should be self-contained and interesting."
      },
      {
        role: "user",
        content: `Please segment the following transcript into multiple short segments, each suitable for a YouTube Short (around 15-60 seconds of content). Return the segments as a JSON array of objects, where each object has a 'content' key with the segmented text. Transcript: ${fullText}`
      }
    ],
  });

  return JSON.parse(response.choices[0].message.content);
}

function matchSegmentsWithTimings(segmentedTranscript, originalTranscript) {
  return segmentedTranscript.map(segment => {
    const startWord = segment.content.split(' ')[0];
    const endWord = segment.content.split(' ').slice(-1)[0];

    const startEntry = originalTranscript.find(entry => entry.text.includes(startWord));
    const endEntry = originalTranscript.reverse().find(entry => entry.text.includes(endWord));

    return {
      content: segment.content,
      start: startEntry ? startEntry.offset : null,
      end: endEntry ? endEntry.offset + endEntry.duration : null
    };
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
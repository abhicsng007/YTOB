const express = require('express');
const { spawn } = require('child_process');
const { OpenAI } = require("@langchain/openai");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

function removeSpecialCharacters(text) {
  return text.replace(/[^\w\s]/gi, ''); // Replace any character that is not a word character or whitespace
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

function splitTextIntoChunks(text, chunkSize) {
    // Handle empty or invalid input
    if (!text || typeof text !== 'string' || chunkSize < 1) {
      return [];
    }
  
    const words = text.trim().split(/\s+/); // Split the text into an array of words
    const chunks = [];
    let currentChunk = '';
  
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const chunkWithWord = `${currentChunk} ${word}`.trim();
  
      if (chunkWithWord.split(/\s+/).length > chunkSize) {
        // If adding the word exceeds the chunk size, create a new chunk
        chunks.push(currentChunk.trim());
        currentChunk = word;
      } else {
        // Otherwise, append the word to the current chunk
        currentChunk = chunkWithWord;
      }
    }
  
    // Add the last chunk, or combine it with the second-last chunk if it's too small
    if (currentChunk) {
      const lastChunkLength = currentChunk.trim().split(/\s+/).length;
      const quarterChunkSize = Math.floor(chunkSize / 4);
  
      if (lastChunkLength <= quarterChunkSize && chunks.length > 0) {
        // Combine the last chunk with the second-last chunk
        const secondLastChunk = chunks.pop();
        chunks.push(`${secondLastChunk} ${currentChunk}`.trim());
      } else {
        chunks.push(currentChunk.trim());
      }
    }
  
    return chunks;
  }
  

app.get('/generate-blog', (req, res) => {
    const { url } = req.query;
    const videoId = extractVideoId(url);
    let response = '';
    const pythonProcess = spawn('python', ['fetch_transcript.py', videoId]);
    
    pythonProcess.stdout.on('data', (data) => {
        response += data.toString(); // Accumulate data as it arrives
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
       
        console.log(`Python process exited with code ${code}`);

        const instruction = `convert following text into a blog with headings and subheadings:\n`;

        const model = new OpenAI({
            modelName: "gpt-3.5-turbo-0125",
            temperature: 0.9,
            openAIApiKey: "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",
            maxTokens: 4000
        });
        
        response = removeSpecialCharacters(response);
        const chunks = splitTextIntoChunks(text, 1000); // Adjust chunk size as needed
        const promises = chunks.map(chunk => {
            const fullInstruction = instruction + chunk;
            return model.invoke(fullInstruction);
        });

        Promise.all(promises)
            .then((generatedBlogPosts) => {
                const combinedBlogPost = generatedBlogPosts.join('\n');
                res.json({ blogPost: combinedBlogPost });
            })
            .catch((error) => {
                console.error('Error invoking OpenAI model:', error);
                res.status(500).send('Internal Server Error');

              });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

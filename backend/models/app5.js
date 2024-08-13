import express, { json } from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(json());

const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
      return match[2];
  } else {
      throw new Error("Invalid YouTube URL");
  }
}

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
  
  function removeSpecialCharacters(text) {
    return text.replace(/[^\w\s]/gi, ''); // Replace any character that is not a word character or whitespace
  }
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyCYusCz8fianY_3JvpL9EiHgqSjBFEXYZk'); // Replace 'YOUR_API_KEY' with your actual API key



async function generateBlog(transcript) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest",
    systemInstruction: "write like a real human professional forbes magazine article writer",
    });

    
    const prompt = `convert below text into a well structured blog.:\n ${transcript}`
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
}
  
app.post('/generate-summary', (req, res) => {
    let response  = req.body.response;
    console.log(`response: ${response}`)
    try {   
            response = removeSpecialCharacters(response);
            const chunks = splitTextIntoChunks(response, 3000);
            const promises = chunks.map(chunk => {
                return generateBlog(chunk);
            });
            Promise.all(promises)
            .then((generatedBlogPosts) => {
                const combinedBlogPost = generatedBlogPosts.join('\n');
                generateBlog(combinedBlogPost)
                .then(blogText => res.json({ data: blogText }))
                .catch(err => res.status(500).json({ error: err.message }));
            })
            .catch((error) => {
                console.error('Error invoking OpenAI model:', error);
                res.status(500).send('Internal Server Error');

              });
           
      
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

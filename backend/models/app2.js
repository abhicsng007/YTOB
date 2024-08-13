const express = require('express');
const { spawn } = require('child_process');
const { OpenAI } = require("@langchain/openai");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

function getFirst4000Words(text, numWords) {
    const words = text.split(/\s+/);

    // Extract the first numWords from the array
    const firstWords = words.slice(0, numWords);
  
    // Join the words back into a string
    return firstWords.join(' ');
}

const extractVideoId = (url) => {
    // Regular expression to extract video ID from YouTube URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return match[2];
    } else {
        return "Invalid YouTube URL";
    }
};
function removeSpecialCharacters(text) {
    return text.replace(/[^\w\s]/gi, ''); // Replace any character that is not a word character or whitespace
  }
  
app.get('/generate-blog', (req, res) => {
    
    const {url} = req.query;
    
    const videoId = extractVideoId(url);
    
    let response = '';
    const pythonProcess = spawn('python', ['fetch_transcript.py',videoId]);
    
    pythonProcess.stdout.on('data', (data) => {
        response += data.toString(); // Accumulate data as it arrives
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {

        // response = getFirst4000Words(response,4000);

        console.log(`Python process exited with code ${code}`);
  
      
        // Construct instruction to convert transcript to blog post
        
        const instruction = `convert below text into friendly tone blog of 1000 plus words with headings and subheadings. write like a real human in active voice third person.write in markdown format. :\n${response} `;
        
    
        // Initialize OpenAI model
        const model = new OpenAI({
            modelName: "gpt-3.5-turbo-0125",
            temperature: 0.9
            ,
            openAIApiKey: "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",
            maxTokens: 1500
        });

        //Invoke OpenAI model with the instruction
        model.invoke(instruction)
            .then((generatedBlogPost) => {
                // Return the generated blog post
                res.json({ data: generatedBlogPost });
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

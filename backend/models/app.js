
// Import required modules
const express = require('express');
const { YoutubeLoader } = require('langchain/document_loaders/web/youtube');
const { OpenAI } = require("@langchain/openai");

// Create an Express app
const app = express();
const port = 3000; // Choose any port you like

function removeSpecialCharacters(text) {
    return text.replace(/[^\w\s]/gi, ''); // Replace any character that is not a word character or whitespace
}

// Define a route to handle loading YouTube videos and generating a blog post
app.get('/generateBlogPost', async (req, res) => {
    try {
        // Get the YouTube video URL from the query parameters
        const { url } = req.query;

        // Check if the URL is provided
        if (!url) {
            return res.status(400).json({ error: 'YouTube video URL is required' });
        }

        // Create a YoutubeLoader instance and load the video
        const loader = YoutubeLoader.createFromUrl(url, {
            language: "en",
            addVideoInfo: true,
        });
        const docs = await loader.load();

        // const cleanedTranscript = removeSpecialCharacters(docs[0].pageContent);

        // Return the loaded document
        res.json(docs);

       //Construct instruction to convert transcript to blog post
        // const instruction = `Convert the following text into a 700 plus words blog. write in friendly human-like tone to hook reader's attention. write creative headings and subheadings. write in active voice in third person. Give reference to Tim Urban in every para.:\n\n${cleanedTranscript}`;

        // Initialize OpenAI model
        // const model = new OpenAI({
        //     modelName: "gpt-3.5-turbo-instruct",
        //     temperature: 0.9,
        //     openAIApiKey: "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",
        //     maxTokens:1200,
            
        // });

        // Invoke OpenAI model with the instruction
        // const generatedBlogPost = await model.invoke(instruction);

        // // Return the generated blog post
        // res.json({ blogPost: generatedBlogPost });
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate blog post' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


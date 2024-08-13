import express from 'express';
const OpenAI = require("openai");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;

// Set your OpenAI API key here


const openai = new OpenAI({
    apiKey: "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"
  });

app.post('/generate-image', async (req, res) => {
    const {prompt} = req.body;
    try {
        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: prompt,
            n: 1,
            size: "256x256",
            
        });

        const imageUrl = response.data;
        res.send(imageUrl);
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).send('Error generating image');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

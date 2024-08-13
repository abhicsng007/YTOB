// server.js
import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import { OpenAI } from '@langchain/openai';
import 'dotenv/config';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(json());


// Pexels API setup
const pexelsApiKey = 'ugCGtnNWf8bWvEXRgSVRz9lTCqNOAGcELWSchUpLAEU1u18JvrkRhbL1';

app.post('/generate-blog', async (req, res) => {
  try {
    const { content } = req.body;

    const instruction = `Extract 5 relevant keywords from this text separated by commas: ${content}`;

    // Initialize OpenAI model
    const model = new OpenAI({
      modelName: "gpt-4o-mini", 
      temperature: 0.9,
      openAIApiKey: "sk-ZduZ2Xiezwc9CWEA4-0-7YNYUXYJ6Qqcb9GogU8b4fT3BlbkFJLrdxtvHGyVLMFtntp8dE9ONT6OKMXYlWa-z_swL0kA", // Use environment variable
      maxTokens: 1500
    });

    // Generate keywords
    const generatedKeywords = await model.invoke(instruction);
    const keywords = generatedKeywords.split(',').map(keyword => keyword.trim());
    console.log('Generated keywords:', keywords);

    // Fetch images from Pexels
    const imagePromises = keywords.map(keyword => 
      axios.get(`https://api.pexels.com/v1/search?query=${keyword}&per_page=1`, {
        headers: { Authorization: pexelsApiKey }
      })
    );

    const fetchHighQualityImages = async (keywords) => {
      const imagePromises = keywords.map(keyword => 
        axios.get('https://api.pexels.com/v1/search', {
          params: {
            query: keyword,
            per_page: 5,  // Increased from 1 to 5
            size: 'large',  // Request large images
            orientation: 'landscape',  // Or 'portrait' or 'square' based on your needs
            min_width: 1920,  // Minimum width in pixels
            min_height: 1080,  // Minimum height in pixels
            sort: 'popular'  // Sort by popularity
          },
          headers: { Authorization: pexelsApiKey }
        })
      );
    
      const imageResponses = await Promise.all(imagePromises);
      const images = imageResponses.flatMap(response => {
        if (response.data.photos && response.data.photos.length > 0) {
          // Return an array of image objects with additional metadata
          return response.data.photos.map(photo => ({
            url: photo.src.large,  // Or photo.src.original for highest resolution
            width: photo.width,
            height: photo.height,
            photographer: photo.photographer,
            avg_color: photo.avg_color
          }));
        }
        return [];
      });
    
      // Additional quality filtering could be done here
      const highQualityImages = images.filter(image => 
        image.width >= 1920 && image.height >= 1080
      );
    
      return highQualityImages;
    };
    
    // In your route handler:
    const highQualityImages = await fetchHighQualityImages(keywords);
    res.json({ images: highQualityImages });
  } catch (error) {
    console.error('Error in /generate-blog:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
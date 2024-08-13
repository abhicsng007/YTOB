// generateBlog.js
import axios from 'axios';
import { OpenAI } from '@langchain/openai';

const pexelsApiKey = process.env.PEXELS_API_KEY;
const unsplashApiKey = process.env.UNSPLASH_API_KEY;

export const generateFreeImages = async (req, res) => {
  try {
    const { content } = req.body;

    const instruction = `Extract 5 relevant image search keywords for pexels/unsplash like app for most relevant images for this text . separate keywords by commas: ${content}`;

    // Initialize OpenAI model
    const model = new OpenAI({
      modelName: "gpt-4o-mini", 
      temperature: 0.9,
      openAIApiKey: process.env.OPENAI_API_KEY,
      maxTokens: 1500
    });

    // Generate keywords
    const generatedKeywords = await model.invoke(instruction);
    const keywords = generatedKeywords.split(',').map(keyword => keyword.trim());
    console.log('Generated keywords:', keywords);

    const fetchPexelsImages = async (keywords) => {
      const imagePromises = keywords.map(keyword => 
        axios.get('https://api.pexels.com/v1/search', {
          params: {
            query: keyword,
            per_page: 1,
            size: 'large',
            orientation: 'landscape',
            min_width: 1920,
            min_height: 1080,
            sort: 'popular'
          },
          headers: { Authorization: pexelsApiKey }
        })
      );
    
      const imageResponses = await Promise.all(imagePromises);
      const images = imageResponses.flatMap(response => {
        if (response.data.photos && response.data.photos.length > 0) {
          return response.data.photos.map(photo => ({
            url: photo.src.large,
            width: photo.width,
            height: photo.height,
            photographer: photo.photographer,
            avg_color: photo.avg_color,
            source: 'pexels'
          }));
        }
        return [];
      });
    
      return images.filter(image => image.width >= 1920 && image.height >= 1080);
    };

    const fetchUnsplashImages = async (keywords) => {
      const imagePromises = keywords.map(keyword => 
        axios.get('https://api.unsplash.com/search/photos', {
          params: {
            query: keyword,
            per_page: 1,
            orientation: 'landscape',
            order_by: 'relevant'
          },
          headers: { Authorization: `Client-ID ${unsplashApiKey}` }
        })
      );
    
      const imageResponses = await Promise.all(imagePromises);
      const images = imageResponses.flatMap(response => {
        if (response.data.results && response.data.results.length > 0) {
          return response.data.results.map(photo => ({
            url: photo.urls.regular,
            width: photo.width,
            height: photo.height,
            photographer: photo.user.name,
            avg_color: photo.color,
            source: 'unsplash'
          }));
        }
        return [];
      });
    
      return images.filter(image => image.width >= 1920 && image.height >= 1080);
    };

    const [pexelsImages, unsplashImages] = await Promise.all([
      fetchPexelsImages(keywords),
      fetchUnsplashImages(keywords)
    ]);

    const allImages = [...pexelsImages, ...unsplashImages];
    
    res.json({ images: allImages });
  } catch (error) {
    console.error('Error in /generate-blog:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
};
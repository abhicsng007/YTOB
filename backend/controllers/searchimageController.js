import axios from 'axios';
import { OpenAI } from '@langchain/openai';

const googleApiKey = process.env.GOOGLE_API_KEY;
const googleCxId = process.env.GOOGLE_CX_ID;

export const proxyImage = async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    res.set('Content-Type', response.headers['content-type']);
    res.set('Content-Disposition', 'attachment');
    res.send(response.data);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'An error occurred while fetching the image' });
  }
};

export const generateSearchImages = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Invalid content' });
    }

    const instruction = `Generate 10 relevant headlines and corresponding image search keywords for this content. Format the output as JSON with two arrays: "headlines" and "keywords". Do not include any markdown formatting.
    Content: ${content}`;

    const model = new OpenAI({
      modelName: "gpt-4", 
      temperature: 0.9,
      openAIApiKey: process.env.OPENAI_API_KEY,
      maxTokens: 1500
    });

    const generatedContent = await model.invoke(instruction);
    
    const cleanedContent = generatedContent.replace(/```json\n|\n```/g, '').trim();
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      throw new Error('Failed to parse generated content as JSON');
    }
    
    const headlines = parsedContent.headlines;
    const keywords = parsedContent.keywords;

    if (!Array.isArray(headlines) || !Array.isArray(keywords) || headlines.length !== 10 || keywords.length !== 10) {
      throw new Error('Unexpected format of generated content');
    }

    const fetchGoogleImages = async (keywords) => {
      const imagePromises = keywords.map(keyword => 
        axios.get('https://www.googleapis.com/customsearch/v1', {
          headers : {
            'User-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582'
         },
          params: {
            key: googleApiKey,
            cx: googleCxId,
            searchType: 'image',
            q: keyword,
            num: 1
          },
          
        
        })
      );

      const imageResponses = await Promise.all(imagePromises);
      const images = imageResponses.flatMap((response, index) => {
        if (response.data.items && response.data.items.length > 0) {
          return response.data.items.map(item => ({
            text: headlines[index],
            imageUrl: item.link,
          }));
        }
        return [];
      });

      return images;
    };

    const googleImages = await fetchGoogleImages(keywords);
    
    res.json({
      images: googleImages
    });
  } catch (error) {
    console.error('Error in /generate-blog:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
};

import express from 'express';
import axios from 'axios';
const app = express();

const API_KEY = 'AIzaSyD6PL00QHHSFRr_0MeMYjZkc-FB_3jVUMw';
const CX = 'b42b46bf947204234';

app.get('/search-image', async (req, res) => {

  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: API_KEY,
        cx: CX,
        searchType: 'image',
        q: query
      }
    });

    const images = response.data.items.map(item => ({
      title: item.title,
      link: item.link,
      image: item.image.thumbnailLink,
      source: item.displayLink
    }));

    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching for images' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

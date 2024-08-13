import OpenAI from "openai";
import Blog from "../models/Blog.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://ytob.onrender.com'
  : 'http://localhost:5000';


export const generateImage = async (req, res) => {
    const { prompt, blogId } = req.body;
    try {
        const blog = await Blog.findOne({ _id: blogId, author: req.user.userId });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: prompt,
            n: 1,
            size: "256x256",
        });

        const imageUrl = response.data[0].url;
        const imageName = `dalle_image_${Date.now()}.png`;
        let imagePath = path.join(__dirname, '..', 'images', imageName);
        console.log(imagePath);

        // Download the image
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, imageResponse.data);

        const localImageUrl = `${baseUrl}/images/${imageName}`;

        blog.images.push({ url: localImageUrl });
        await blog.save();

        res.status(201).json({ 
            message: 'Image generated and saved successfully',
            image: blog.images[blog.images.length - 1]
        });
    } catch (error) {
        console.error('Error adding image to blog:', error);
        res.status(500).json({ error: 'Failed to add image to blog' });
    }
};
// controllers/screenshotController.js

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';
import Blog from '../models/Blog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://ytob.onrender.com'
  : 'http://localhost:5000';

const generateScreenshot = async (videoUrl, screenshotTime) => {
    screenshotTime = Math.round(parseFloat(screenshotTime));
    let screenshotPath = path.join(__dirname,'..', 'images', `screenshot${Date.now()}.jpg`);
    console.log(screenshotPath);
    const imageName = path.basename(screenshotPath);

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [
            path.join(__dirname,'..', 'capture.py'), 
            videoUrl, 
            screenshotTime,
            screenshotPath
        ]);

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve({
                    imageName,
                    screenshotUrl: `${baseUrl}/images/${imageName}`
                });
            } else {
                reject(new Error('Failed to capture screenshot'));
            }
        });

        pythonProcess.stdout.on('data', (data) => {
            console.log(`Python script output: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python script error: ${data}`);
        });
    });
};

export const addScreenshotToBlog = async (req, res) => {
    const { blogId, videoUrl, screenshotTime } = req.body;

    try {
        const blog = await Blog.findOne({ _id: blogId, author: req.user.userId });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const { screenshotUrl } = await generateScreenshot(videoUrl, screenshotTime);
        console.log(`ss :${screenshotUrl}`);

        blog.images.push({ url: screenshotUrl, isScreenshot: true });
        await blog.save();

        res.status(201).json({ 
            message: 'Screenshot generated and saved successfully',
            image: blog.images[blog.images.length - 1]
        });
    } catch (error) {
        console.error('Error adding screenshot to blog:', error);
        res.status(500).json({ error: 'Failed to add screenshot to blog' });
    }
};


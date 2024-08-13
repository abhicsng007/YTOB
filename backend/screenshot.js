import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
const publicDir = path.join(__dirname, 'public');
app.use('/images', express.static(publicDir));

app.get('/capture', async (req, res) => {
    let { videoUrl, screenshotTime } = req.query;
    screenshotTime = Math.round(screenshotTime);
    let screenshotPath = path.join(publicDir, `screenshot${Date.now()}.jpg`);
    const imageName = path.basename(screenshotPath);

    console.log(`Video URL: ${videoUrl}`);
    console.log(`Screenshot Time: ${screenshotTime}`);
    console.log(`Screenshot Path: ${screenshotPath}`);

    const pythonProcess = spawn('python', [
        path.join(__dirname, 'capture.py'), 
        videoUrl, 
        screenshotTime,
        screenshotPath
    ]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
        if (code === 0) {
            res.send(`http://localhost:3001/images/${imageName}`);
        } else {
            res.status(500).json({ error: 'Failed to capture screenshot' });
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Serving static files from ${publicDir}`);
});

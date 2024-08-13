import 'dotenv/config';
import express from 'express';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import freeimagesRoutes from './routes/freeimagesRoutes.js';
import imgsearchRoutes from './routes/imgsearchRoutes.js';
import shortsRoutes from './routes/shortsRoutes.js';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const jsonParserMiddleware = (req, res, next) => {
    if (req.originalUrl === '/api/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
  };

app.use(jsonParserMiddleware);

app.use(cors({
    origin: process.env.FRONTEND_URL, // Change this to your frontend URL
    credentials: true, // Enable sending cookies with requests
}));
app.use(cookieParser());
app.use(helmet({
    crossOriginResourcePolicy: false,
  }));


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/shorts', express.static(path.join(__dirname, 'shorts')));

connectDB();

app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/summaries',summaryRoutes);
app.use('/credits',creditRoutes);
app.use('/images',freeimagesRoutes);
app.use('/gimages',imgsearchRoutes);
app.use('/shorts',shortsRoutes);
app.use('/api', (req, res, next) => {
    if (req.originalUrl === '/api/webhook') {
      express.raw({ type: 'application/json' })(req, res, next);
    } else {
      next();
    }
  }, subscriptionRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

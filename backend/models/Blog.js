import mongoose from 'mongoose';

// models/Blog.js

const imageSchema = new mongoose.Schema({
  url: String,
  isActive: {
      type: Boolean,
      default: true
  },
  isScreenshot: {
      type: Boolean,
      default: false
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
});



const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: String,
  excerpt: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [imageSchema]
});

export default mongoose.model('Blog', blogSchema);
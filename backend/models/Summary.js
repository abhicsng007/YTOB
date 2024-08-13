import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
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
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Summary', summarySchema);

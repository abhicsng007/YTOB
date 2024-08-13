import Summary from "../models/Summary.js";
import { useCredits } from "./creditController.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateBlog(transcript) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest",
    systemInstruction: "write like a real human professional forbes magazine article writer. write in markdown format where title starts with single #",
    });

    
    const prompt = `convert below text into a well structured blog.:\n ${transcript}`
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
}

export const generateSummary = async (req, res) => {
    let response  = req.body.response;
    try {   
            
            response = removeSpecialCharacters(response);
            const chunks = splitTextIntoChunks(response, 3000);
            const promises = chunks.map(chunk => {
                return generateBlog(chunk);
            });
            Promise.all(promises)
            .then((generatedBlogPosts) => {
                const combinedBlogPost = generatedBlogPosts.join('\n');
                generateBlog(combinedBlogPost)
                .then(async (blogText) => {

                    const titleMatch = blogText.match(/^# (.+)$/m);
                    const title = titleMatch ? titleMatch[1] : 'Untitled';

                    const excerpt = createExcerpt(blogText);

                    // Save the blog post with the extracted title and excerpt
                    const summary = new Summary({
                    title,
                    content: blogText,
                    excerpt,
                    author: req.user.userId
                    });

                    await summary.save();
                    try {
                      await useCredits(req.user.userId,1); // Deduct 1 credit for blog generation
                      res.json({ data: blogText });
                    } catch (creditError) {
                      console.error('Error deducting credits:', creditError);
                      res.status(400).json({ error: 'Failed to deduct credits', details: creditError.message });
                    }
                    
                }
                ).catch(err => res.status(500).json({ error: err.message }));
            })
            .catch((error) => {
                console.error('Error invoking Gemini model:', error);
                res.status(500).send('Internal Server Error');

              });
           
      
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    
};

// The remaining CRUD operations are unchanged

export const getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find({ author: req.user.userId });
    res.status(200).json(summaries);
  } catch (error) {
    console.error('Error fetching summaries:', error);
    res.status(500).json({ error: 'Failed to fetch summaries' });
  }
};

export const getSummaryById = async (req, res) => {
  const { id } = req.params;

  try {
    const summary = await Summary.findOne({ _id: id, author: req.user.userId });
    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};

export const updateSummary = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
        const titleMatch = content.match(/^# (.+)$/m);
        const title = titleMatch ? titleMatch[1] : 'Untitled';
        const excerpt = createExcerpt(content);
        
        const summary = await Summary.findOneAndUpdate(
        { _id: id, author: req.user.userId },
        { title, content, excerpt },
        { new: true }
      );

    if (!summary) {
      return res.status(404).json({ error: 'summary not found' });
    }
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error updating summary:', error);
    res.status(500).json({ error: 'Failed to update summary' });
  }
};

export const deleteSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const summary = await Summary.findOneAndDelete({ _id: id, author: req.user.userId });
    if (!summary) {
      return res.status(404).json({ error: 'summary not found' });
    }
    res.status(200).json({ message: 'summary deleted successfully' });
  } catch (error) {
    console.error('Error deleting summary:', error);
    res.status(500).json({ error: 'Failed to delete summary' });
  }
};


function removeSpecialCharacters(text) {
  return text.replace(/[^\w\s]/gi, ''); // Replace any character that is not a word character or whitespace
}

function splitTextIntoChunks(text, chunkSize) {
  if (!text || typeof text !== 'string' || chunkSize < 1) {
    return [];
  }

  const words = text.trim().split(/\s+/); // Split the text into an array of words
  const chunks = [];
  let currentChunk = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const chunkWithWord = `${currentChunk} ${word}`.trim();

    if (chunkWithWord.split(/\s+/).length > chunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    } else {
      currentChunk = chunkWithWord;
    }
  }

  if (currentChunk) {
    const lastChunkLength = currentChunk.trim().split(/\s+/).length;
    const quarterChunkSize = Math.floor(chunkSize / 4);

    if (lastChunkLength <= quarterChunkSize && chunks.length > 0) {
      const secondLastChunk = chunks.pop();
      chunks.push(`${secondLastChunk} ${currentChunk}`.trim());
    } else {
      chunks.push(currentChunk.trim());
    }
  }

  return chunks;
}


const createExcerpt = (content) => {
  // Remove the title (assuming it's the first line starting with '#')
  const contentWithoutTitle = content.replace(/^#.*\n/, '').trim();

  // Remove markdown image tags
  const contentWithoutImages = contentWithoutTitle.replace(/!\[.*?\]\(.*?\)/g, '');

  // Create the excerpt
  const words = contentWithoutImages.split(/\s+/);
  const excerpt = words.slice(0, 25).join(' ') + (words.length > 25 ? '...' : '');

  return excerpt;
};
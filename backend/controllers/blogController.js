import { spawn } from 'child_process';
import { OpenAI } from '@langchain/openai';
import Blog from '../models/Blog.js';
import { useCredits } from './creditController.js';

export const generateBlog = async (req, res) => {
  const { url } = req.query;
  const videoId = extractVideoId(url);

  let response = '';
  const pythonProcess = spawn('python', ['fetch_transcript.py', videoId]);

  pythonProcess.stdout.on('data', (data) => {
    response += data.toString(); // Accumulate data as it arrives
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);

    const instruction = `Convert below transcript into 700 words human blog with headings and subheadings. keep varying tone through the text .write fifth grade english use simple words.use simple sentences.make common grammatical mistakes like humans do . do not repeat same words.\n${response} `;

    const model = new OpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.9,
      openAIApiKey: process.env.OPENAI_API_KEY,
      maxTokens: 4000
    });

    model.invoke(instruction)
      .then(async (generatedBlogPost) => {
        // Extract the title from the Markdown content
        const titleMatch = generatedBlogPost.match(/^# (.+)$/m);
        const title = titleMatch ? titleMatch[1] : 'Untitled';

        
    // Extract the first 100 words as excerpt, excluding the title
        const excerpt = createExcerpt(generatedBlogPost);

        // Save the blog post with the extracted title and excerpt
        const blog = new Blog({
          title,
          content: generatedBlogPost,
          excerpt,
          author: req.user.userId
        });

        await blog.save();
        try {
          await useCredits(req.user.userId, 1); // Deduct 1 credit for blog generation
          res.json({ data: generatedBlogPost });
        } catch (creditError) {
          console.error('Error deducting credits:', creditError);
          res.status(400).json({ error: 'Failed to deduct credits', details: creditError.message });
        }
      })
      .catch((error) => {
        console.error('Error invoking OpenAI model:', error);
        res.status(500).send('Internal Server Error');
      });
  });
};

// The remaining CRUD operations are unchanged

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.userId });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};


export const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findOne({ _id: id, author: req.user.userId });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const activeImages = blog.images.filter(image => image.isActive);

    res.status(200).json({ blog, images: activeImages });
  } catch (error) {
    console.error('Error fetching blog with images:', error);
    res.status(500).json({ error: 'Failed to fetch blog with images' });
  }
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, activeImageIds } = req.body;

  try {
    const titleMatch = content.match(/^# (.+)$/m);
    const extractedTitle = titleMatch ? titleMatch[1] : 'Untitled';
    const excerpt = createExcerpt(content);
    
    const blog = await Blog.findOne({ _id: id, author: req.user.userId });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.title = extractedTitle;
    blog.content = content;
    blog.excerpt = excerpt;

    // Update image statuses
    if (Array.isArray(activeImageIds)) {
      blog.images.forEach(image => {
        image.isActive = activeImageIds.includes(image._id.toString());
      });
    }

    await blog.save();

    res.status(200).json({ blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findOneAndDelete({ _id: id, author: req.user.userId });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  } else {
    return "Invalid YouTube URL";
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
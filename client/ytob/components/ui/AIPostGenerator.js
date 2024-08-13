import React, { useState, useRef , useEffect } from 'react';
import PostTemplate from './PostTemplate';
import axiosInstance from '@/app/services/axiosInstance';
import { toPng } from 'html-to-image';
import { IoDownloadOutline } from "react-icons/io5";

// const testData = [
//     {
//       text: "AI breakthrough: New model understands context better than ever",
//       imageUrl: "https://pics.craiyon.com/2023-11-19/xvIJhVvrTDCCc3OP70Lh4A.webp"
//     },
//     {
//       text: "Quantum computing reaches new milestone with 1000-qubit processor",
//       imageUrl: "https://wallpapers.com/images/high/bamboo-trail-forest-background-gu4hlmvj3dqo45z0.webp"
//     },
//     {
//       text: "SpaceX successfully launches first civilian mission to Mars",
//       imageUrl: "https://wallpapers.com/images/high/bamboo-trail-forest-background-gu4hlmvj3dqo45z0.webp"
//     },
//     {
//       text: "Revolutionary battery technology triples electric vehicle range",
//       imageUrl: "https://wallpapers.com/images/high/bamboo-trail-forest-background-gu4hlmvj3dqo45z0.webp"
//     },
//     {
//       text: "Global initiative reduces plastic waste in oceans by 50%",
//       imageUrl: "https://wallpapers.com/images/high/bamboo-trail-forest-background-gu4hlmvj3dqo45z0.webp"
//     },
//     {
//       text: "AI-powered drug discovery leads to potential cure for Alzheimer's",
//       imageUrl: "https://wallpapers.com/images/high/bamboo-trail-forest-background-gu4hlmvj3dqo45z0.webp"
//     },
//     {
//       text: "World's first successful brain-computer interface allows paralyzed patient to walk",
//       imageUrl: "https://wallpapers.com/images/high/bamboo-trail-forest-background-gu4hlmvj3dqo45z0.webp"
//     },
//     {
//       text: "Renewable energy surpasses fossil fuels in global power generation",
//       imageUrl: "https://wallpapers.com/images/high/bamboo-trail-forest-background-gu4hlmvj3dqo45z0.webp"
//     },
//     {
//       text: "Breakthrough in fusion energy brings limitless clean power closer to reality",
//       imageUrl: "https://wallpapers.com/images/high/bamboo-trail-forest-background-gu4hlmvj3dqo45z0.webp"
//     },
//     {
//       text: "AI ecosystem restoration project revives endangered species populations",
//       imageUrl: "https://wallpapers.com/images/high/bamboo-trail-forest-background-gu4hlmvj3dqo45z0.webp"
//     }
//   ];

  const AIPostGenerator = () => {
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const postRefs = useRef([]);

    useEffect(() => {
      const savedPosts = localStorage.getItem('generatedPosts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }
    }, []);
  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('generatedPosts', JSON.stringify(posts));
    }
  }, [posts]);
  
  const generatePosts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/gimages/free-image-search', { content });
      const processedPosts = await Promise.all(response.data.images.map(async (post) => ({
        ...post,
        processedImageUrl: await handleUrl(post.imageUrl)
      })));
      setPosts(processedPosts);
    } catch (error) {
      console.error('Error generating posts:', error);
    }
    setLoading(false);
  };

  const handleUrl = async (imageUrl) => {
    const proxyUrl = `gimages/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    
    try {
      const response = await axiosInstance(proxyUrl, {responseType: 'arraybuffer'});
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      return `data:image/jpeg;base64,${base64}`;
    }
    catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const downloadImage = async (index) => {
      const postElement = postRefs.current[index];
      
      if (postElement) {
        // Find the button within the post and hide it
        const button = postElement.querySelector('.download-icon');
        if (button) {
          button.style.display = 'none';
        }
    
        // Convert the post to an image
        const dataUrl = await toPng(postElement);
    
        // Restore the button's visibility
        if (button) {
          button.style.display = '';
        }
    
        // Create a download link and trigger the download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `post_${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
  
    return (
      <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">AI Post Generator</h1>
        
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded resize-none"
            rows="5"
            placeholder="Enter your article here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={generatePosts}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Posts'}
        </button>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 place-items-center ">
        {posts.map((post, index) => (
          <div key={index} ref={(el) => (postRefs.current[index] = el)} className="relative group">
            <PostTemplate
              template={index}
              text={post.text}
              imageUrl={post.processedImageUrl}
            />
            <IoDownloadOutline 
              onClick={() => downloadImage(index)}
              className="download-icon absolute top-0 right-0 text-white cursor-pointer text-2xl m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ))}
        </div>
      </div>
    );
  };
  
  export default AIPostGenerator;
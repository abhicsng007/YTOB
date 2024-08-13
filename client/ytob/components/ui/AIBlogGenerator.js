import React, { useState, useEffect } from 'react';
import axiosInstance from '@/app/services/axiosInstance';

const AIBlogGenerator = () => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState({ pexels: [], unsplash: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pexels');

  useEffect(() => {
    const savedImages = localStorage.getItem('aiGeneratedImages');
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        setImages({
          pexels: Array.isArray(parsedImages.pexels) ? parsedImages.pexels : [],
          unsplash: Array.isArray(parsedImages.unsplash) ? parsedImages.unsplash : []
        });
      } catch (error) {
        console.error('Error parsing saved images:', error);
        localStorage.removeItem('aiGeneratedImages');
      }
    }
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/images/text-to-image', { content });
      const newImages = {
        pexels: response.data.images.filter(img => img.source === 'pexels') || [],
        unsplash: response.data.images.filter(img => img.source === 'unsplash') || []
      };
      setImages(newImages);
      localStorage.setItem('aiGeneratedImages', JSON.stringify(newImages));
      console.log(response);
    } catch (error) {
      console.error('Error generating images:', error);
      alert('An error occurred while generating images');
    } finally {
      setIsLoading(false);
    }
  };

  const renderImages = (source) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images[source]?.map((image, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={image.url} 
            alt={`AI-generated image ${index + 1}`} 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-2">By: {image.photographer}</p>
            <p className="text-sm text-gray-600 mb-4">
              {image.width}x{image.height}px
            </p>
            <a 
              href={image.url} 
              download={`ai-image-${source}-${index + 1}.jpg`}
              className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
            >
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">AI Text to Image Generator</h1>
      
      <div className="mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your blog content here..."
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 h-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <button 
          onClick={handleGenerate}
          disabled={isLoading || !content.trim()}
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Images'}
        </button>
      </div>

      {((images.pexels && images.pexels.length > 0) || (images.unsplash && images.unsplash.length > 0)) && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Generated Images</h2>
          <div className="mb-4">
            <button
              onClick={() => setActiveTab('pexels')}
              className={`px-4 py-2 mr-2 rounded ${activeTab === 'pexels' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              Pexels Gallery
            </button>
            <button
              onClick={() => setActiveTab('unsplash')}
              className={`px-4 py-2 rounded ${activeTab === 'unsplash' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              Unsplash Gallery
            </button>
          </div>
          {activeTab === 'pexels' && renderImages('pexels')}
          {activeTab === 'unsplash' && renderImages('unsplash')}
        </div>
      )}
    </div>
  );
};

export default AIBlogGenerator;
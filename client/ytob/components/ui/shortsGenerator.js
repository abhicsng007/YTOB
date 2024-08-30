import { useState } from 'react';
import { FaRobot, FaSpinner, FaYoutube } from 'react-icons/fa';
import axiosInstance from '@/app/services/axiosInstance';

export default function ShortsGenerator() {
  const [url, setUrl] = useState('');
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShorts([]);
  
    try {
     const response = await axiosInstance.get('/shorts/generate-shorts', {
        params: {
          url: url
        },
      });
      console.log(`response: ${response}`);
  
      console.log('Response status:', response.status);
  
      // In axios, the response data is available in `response.data`
      
  
      if (response.status === 200 ) {
        
          setShorts(response.data.data);
        
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {

      console.error('Error details:', err);
      setError(`Failed to generate shorts: ${err.message}`);

    } finally {

      setLoading(false);
      
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center flex items-center justify-center">
          <FaRobot className="mr-4 text-blue-500" />
          AI Shorts Generator
        </h1>

        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex items-center border-b-2 border-blue-500 py-2">
            <FaYoutube className="text-red-500 mr-3" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Generate'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-8">
            {error}
          </div>
        )}

        {shorts.length > 0 && (
          <div>
          <h2 className="text-2xl font-semibold mb-4">Generated Shorts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shorts.map((short, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="relative w-full pb-[177.78%]"> {/* 16:9 aspect ratio */}
                  <video 
                    controls 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    style={{aspectRatio: '9 / 16'}}
                  >
                    <source src={short.fileName} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{short.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

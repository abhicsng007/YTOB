import React from 'react';

function Services() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Our Services</h1>
        <ul className="list-disc ml-6 text-gray-400">
          <li className="mb-2">Video to Blog Conversion</li>
          <li className="mb-2">AI-driven Text Summarization</li>
          <li className="mb-2">AI Image Generation for Blogs</li>
          <li className="mb-2">Finding Relevant Images from Pexels and Unsplash</li>
          <li className="mb-2">Social Media Post Generation</li>
          <li className="mb-2">YouTube Shorts Creation</li>
        </ul>
      </div>
    </div>
  );
}

export default Services;

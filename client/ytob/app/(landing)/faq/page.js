import React from 'react';

function FAQ() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="text-gray-400">
          <h3 className="text-xl font-semibold mb-2">Q1: What is YTOB?</h3>
          <p className="mb-6">A1: YTOB is a service that converts YouTube videos into high-quality blogs using AI technology.</p>

          <h3 className="text-xl font-semibold mb-2">Q2: How do I use YTOB?</h3>
          <p className="mb-6">A2: You can paste your YouTube video URL into our tool, and we will automatically generate a blog post for you.</p>

          <h3 className="text-xl font-semibold mb-2">Q3: What are the pricing plans?</h3>
          <p>A3: We offer multiple pricing plans to suit your needs, starting from $9.99 per month.</p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;

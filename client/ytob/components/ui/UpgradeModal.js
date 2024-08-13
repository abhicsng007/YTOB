"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import stripePromise from '@/app/services/stripeClient';
import axiosInstance from '@/app/services/axiosInstance';

const UpgradeModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  if (!isOpen) return null;

  const subscriptionPlans = [
    { name: 'Neural', price: '$9.99/mo', features: ['10 AI credits', 'Basic neural networks', 'Text generation'] },
    { name: 'Synapse', price: '$19.99/mo', features: ['50 AI credits', 'Advanced algorithms', 'Image recognition', 'Voice synthesis'] },
    { name: 'Quantum', price: '$49.99/mo', features: ['Unlimited AI credits', 'Quantum computing access', 'Custom AI models', '24/7 AI support'] },
  ];

  const handleUpgrade = async (planName) => {
    setIsLoading(true);
    setError(null);
    try {
      const stripe = await stripePromise;
      
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`, { planName });
      
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('An error occurred during checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-900 rounded-lg shadow-xl p-8 max-w-4xl w-full m-4 overflow-y-auto max-h-[90vh] border border-blue-500">
        <button 
          className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition-colors duration-200"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Upgrade Your AI Capabilities
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              className="bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-500 relative overflow-hidden"
            >
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4 text-purple-400">{plan.price}</p>
              <ul className="mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center mb-2 text-gray-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.name)}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-105 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {isLoading ? 'Processing...' : `Activate ${plan.name} AI`}
                </span>
                <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-gradient-to-r from-blue-400 to-purple-400 opacity-50"></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
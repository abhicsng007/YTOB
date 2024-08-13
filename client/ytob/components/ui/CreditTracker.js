"use client";
import { useState, useEffect ,useCallback } from 'react';
import UpgradeModal from './UpgradeModal';
import axiosInstance from '@/app/services/axiosInstance';

const CreditTracker = () => {
  const [credits, setCredits] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [totalCredits, setTotalCredits] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const creditsSetter = useCallback((creditCount, totalCreditCount) => {
    setCredits(creditCount);
    setTotalCredits(totalCreditCount);
    
  }, []);

  useEffect(() => {
      async function fetchCredits() {
        try {
          const response = await axiosInstance.post('/credits/get-credits');
          console.log(response);
          const { creditCount, totalCreditCount  } = response.data;
          creditsSetter(creditCount, totalCreditCount);

          
          
        } catch (error) {
          console.error('Error fetching credits:', error);
        }
      }
    
      fetchCredits();
    }, []);



  useEffect(() => {
    if (credits === 0) {
      setShowUpgradeModal(true);
    }
  }, [credits]);

  const handleUpgrade = (plan) => {
    // Implement upgrade logic here
    console.log(`Upgraded to ${plan} plan`);
    setShowUpgradeModal(false);
  };

  
  const progressPercentage = Math.min(((totalCredits - credits) / totalCredits) * 100, 100);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-2xl shadow-lg transition-all duration-1000 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16 h-16'
      } overflow-hidden`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`flex items-center justify-center ${isExpanded ? 'h-10' : 'h-full'}`}>
        <div
          className={`absolute left-3 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
            isExpanded ? 'scale-0' : 'scale-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            AI Credits: {(totalCredits - credits)}/{totalCredits}
          </span>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-3 transition-all duration-300 ease-in-out opacity-100">
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300 ease-out"
            >
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-white opacity-75 animate-pulse"></div>
            </div>
          </div>
           
            <button onClick={() => setShowUpgradeModal(true)} className="w-full mt-3 text-xs bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-3 rounded-full hover:from-purple-600 hover:to-pink-700 transition duration-200 transform hover:scale-105">
              Upgrade AI
            </button>
            
          
        </div>
      )}
       <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default CreditTracker;

'use client'

import { useState, useEffect } from 'react';
import AILoadingIcon from './AILoadingIcon';

export default function LoadingProvider({ children, isLoading: propIsLoading = false }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    document.addEventListener('page-loading', handleStart);
    document.addEventListener('page-loaded', handleComplete);

    return () => {
      document.removeEventListener('page-loading', handleStart);
      document.removeEventListener('page-loaded', handleComplete);
    };
  }, []);

  const isLoading = loading || propIsLoading;

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <AILoadingIcon />
        </div>
      )}
      <div className={isLoading ? 'hidden' : ''}>
        {children}
      </div>
    </>
  );
}
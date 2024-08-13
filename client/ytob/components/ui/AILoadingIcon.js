import React from 'react';

const AILoadingIcon = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-2 border-4 border-green-500 rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-purple-500 rounded-full animate-ping"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default AILoadingIcon;
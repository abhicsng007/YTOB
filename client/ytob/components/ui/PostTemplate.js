import React from 'react';

const PostTemplate = ({ template, text, imageUrl }) => {
  const templates = [
    {
      className: "relative overflow-hidden",
      render: (text, imageUrl) => (
        <>
          <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 p-4">
            <p className="text-yellow-400 font-bold text-xl">
              {text.split(' ').slice(0, -3).join(' ')}{' '}
              <span className="text-white">{text.split(' ').slice(-3).join(' ')}</span>
            </p>
          </div>
        </>
      ),
    },
    {
      className: "relative overflow-hidden",
      render: (text, imageUrl) => (
        <>
          <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
            <p className="absolute bottom-4 left-4 right-4 text-white font-bold text-2xl text-center">{text}</p>
          </div>
        </>
      ),
    },
    {
      className: "relative overflow-hidden",
      render: (text, imageUrl) => (
        <>
          <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <p className="absolute bottom-6 right-6 max-w-[70%] text-white font-italic text-xl text-right">
            <q>{text}</q>
          </p>
        </>
      ),
    },
    {
      className: "relative overflow-hidden",
      render: (text, imageUrl) => (
        <>
          <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-80 p-4">
            <p className="text-black font-bold text-xl">{text}</p>
          </div>
        </>
      ),
    },
    {
      className: "relative overflow-hidden",
      render: (text, imageUrl) => (
        <>
          <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-3">
            <p className="text-black font-bold text-lg">{text}</p>
          </div>
        </>
      ),
    },
    {
      className: "relative overflow-hidden",
      render: (text, imageUrl) => (
        <>
          <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-red-500 bg-opacity-60 p-4">
            <p className="text-white font-bold text-xl">{text}</p>
          </div>
        </>
      ),
    },
    {
      className: "relative overflow-hidden",
      render: (text, imageUrl) => (
        <>
          <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
          <p className="absolute top-4 left-4 right-4 text-white font-bold text-2xl">{text}</p>
        </>
      ),
    },
    {
      className: "relative overflow-hidden",
      render: (text, imageUrl) => (
        <>
          <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-blue-600 bg-opacity-70 p-4">
            <p className="text-white font-bold text-xl text-center">{text}</p>
          </div>
        </>
      ),
    },
    {
      className: "relative overflow-hidden",
      render: (text, imageUrl) => (
        <>
          {/* Blurred background image */}
          <div className="absolute inset-0 blur-[4px]">
            <img src={imageUrl} alt="Blurred Background" className="w-full h-full object-cover" />
          </div>
          
          {/* Content container with padding */}
          <div className="absolute inset-4 flex flex-col rounded-lg overflow-hidden">
            {/* Clear image taking up available space */}
            <div className="flex-grow overflow-hidden">
              <img src={imageUrl} alt="Clear Background" className="w-full h-full object-cover" />
            </div>
            
            {/* Text overlay at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-30 p-3">
              <p className="text-white font-bold text-lg line-clamp-3">{text}</p>
            </div>
          </div>
        </>
      ),
    },
    {
      className: "relative overflow-hidden",
      render: (text, imageUrl) => (
        <>
          <img src={imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-4 border-2 border-white rounded-lg"></div>
          <div className="absolute bottom-8 left-8 right-8 bg-black bg-opacity-70 p-3">
            <p className="text-white font-bold text-xl">{text}</p>
          </div>
        </>
      ),
    },
  ];

  const selectedTemplate = templates[template % templates.length];

  return (
    <div className={`w-[250px] h-[400px] ${selectedTemplate.className}`}>
      {selectedTemplate.render(text, imageUrl)}
    </div>
  );
};

export default PostTemplate;
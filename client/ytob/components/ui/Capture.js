"use client";

import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { Button } from './button';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import axiosInstance from '@/app/services/axiosInstance';
import { FaRobot, FaCamera, FaPlay, FaPause, FaImage } from 'react-icons/fa';
import UpgradeModal from './UpgradeModal';

const Capture = ({ imgPath, setImagePath, defVideoUrl }) => {
  const [player, setPlayer] = useState(null);
  const [videoURl, setVideoUrl] = useState("");
  const [mode, setMode] = useState("screenshot");
  const [aiPrompt, setAiPrompt] = useState("");
  const [credits, setCredits] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const { id: blogId } = useParams();

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  // useEffect(() => {
  //   fetchCredits();
  // }, []);

  // const fetchCredits = async () => {
  //   try {
  //     const response = await axios.get('/user/credits');
  //     setCredits(response.data.credits);
  //   } catch (error) {
  //     console.error('Error fetching credits:', error);
  //   }
  // };

  const handleReady = (event) => {
    setPlayer(event.target);
  };

  const handlePlay = () => {
    player.playVideo();
  };

  const handlePause = () => {
    player.pauseVideo();
  };

  useEffect(() => {
    console.log("Image path updated:", imgPath);
  }, [imgPath]);

  const handleUrl = (event) => {
    if (credits > 3) {
      setShowUpgradeModal(true);
    } else {
      const url = event.target.value;
      setVideoUrl(url);
    }
  }

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  const handleScreenshot = async (time) => {
    if (credits > 3) {
      setShowUpgradeModal(true);
    } else {
      setIsButtonDisabled(true);
      if (!blogId) {
        console.error('No blog ID found');
        setIsButtonDisabled(false);
        return;
      }
      try {
        const videoUrl = videoURl;
        const response = await axiosInstance.post('/blogs/generate-screenshot', {
  
            blogId:blogId,
            videoUrl: videoUrl,
            screenshotTime: time,
            
          
        });
        console.log(response);
        setImagePath(response.data.image.url);
        console.log(imgPath);
        setIsButtonDisabled(false);
        // fetchCredits(); // Fetch updated credits after screenshot
      } catch (error) {
        console.error('Error generating screenshot:', error);
        setIsButtonDisabled(false);
      }
    }
  };

  const handleAIGeneration = async () => {
    if (credits > 3) {
      setShowUpgradeModal(true);
    } else {
      setIsButtonDisabled(true);
      if (!blogId) {
        console.error('No blog ID found');
        setIsButtonDisabled(false);
        return;
      }
      try {
        console.log(`prompt:${aiPrompt}`);
        const response = await axiosInstance.post('blogs/generate-image', { prompt: aiPrompt ,  blogId:blogId,});
        console.log(response);

        setImagePath(response.data.image.url);
        setIsButtonDisabled(false);
        // fetchCredits(); // Fetch updated credits after AI generation
      } catch (error) {
        console.error('Error generating AI image:', error);
        setIsButtonDisabled(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowUpgradeModal(false);
  };

  const handleUpgrade = (plan) => {
    console.log(`Upgrading to ${plan}`);
    // Implement your upgrade logic here
    setShowUpgradeModal(false);
  };

  const handleUrlFocus = () => {
    if (credits > 3) {
      setShowUpgradeModal(true);
    }
  }

  return (
    <div className='flex flex-col items-center bg-gradient-to-b from-gray-900 to-black text-white p-4 sm:p-8 rounded-lg shadow-2xl w-full max-w-3xl mx-auto'>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 w-full">
        <Button 
          onClick={() => setMode("screenshot")} 
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 ${mode === "screenshot" ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'} w-full sm:w-auto`}
        >
          <FaCamera /> Screenshot
        </Button>
        <Button 
          onClick={() => setMode("ai")} 
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 ${mode === "ai" ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'} w-full sm:w-auto`}
        >
          <FaRobot /> AI Image Generation
        </Button>
      </div>

      {mode === "screenshot" ? (
        <>
          <input
            type="text"
            id="videoUrlInput"
            placeholder="Enter URL of YouTube video"
            value={videoURl}
            onChange={handleUrl}
            onFocus={handleUrlFocus}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-6 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className='relative border border-gray-700 shadow-xl rounded-lg p-2 bg-gray-800 w-full aspect-video'>
            <div className='absolute inset-0'>
              {videoURl === "" ? (
                <YouTube 
                  videoId={extractVideoId(defVideoUrl)} 
                  opts={opts} 
                  onReady={handleReady}
                  className='w-full h-full'
                  iframeClassName='w-full h-full'
                />
              ) : (
                <YouTube 
                  videoId={extractVideoId(videoURl)} 
                  opts={opts} 
                  onReady={handleReady}
                  className='w-full h-full'
                  iframeClassName='w-full h-full'
                />
              )}
            </div>
          </div>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 p-4 w-full mt-6'>
            <Button onClick={handlePlay} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 w-full sm:w-auto">
              <FaPlay /> Play
            </Button>
            <Button onClick={handlePause} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 w-full sm:w-auto">
              <FaPause /> Pause
            </Button>
            <Button onClick={() => handleScreenshot(player.getCurrentTime())} disabled={isButtonDisabled} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 w-full sm:w-auto">
              <FaCamera /> Take Screenshot
            </Button>
          </div>
        </>
      ) : (
        <>
          <textarea
            type="text"
            id="aiPromptInput"
            placeholder="Enter prompt for AI image generation"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="resize-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-6 w-full h-32 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button onClick={handleAIGeneration} disabled={isButtonDisabled} className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 w-full sm:w-auto">
            <FaImage /> Generate AI Image
          </Button>
        </>
      )}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={handleCloseModal}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default Capture;
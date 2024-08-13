"use client";

import { useAuth } from "@/app/context/AuthContext";
import TypewriterComponent from "typewriter-effect";
import { Button } from "./button";
import Link from "next/link";
import { FaRobot, FaBrain } from 'react-icons/fa';

function LandingHero() {
  const { isSigned } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center mb-4">
      <div className="text-white font-bold py-12 text-center space-y-8 max-w-4xl px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold relative z-10">
            Next-Gen AI-Powered Tool for
          </h1>
        </div>
        
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          <TypewriterComponent
            options={{
              strings: [
                "Video to Blog Conversion",
                "High-Quality Blog Generation"
              ],
              autoStart: true,
              loop: true,
              wrapperClassName: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
            }}
          />
        </div>
        
        <div className="text-lg md:text-xl font-light text-blue-200 flex items-center justify-center space-x-2 ">
          <FaBrain className="animate-bounce" />
          <span>Revolutionize Your Content Creation</span>
          <FaRobot className="animate-bounce" />
        </div>

        <Link href={isSigned ? "/dashboard" : "/sign-up"}>
          <Button className="md:text-lg p-4 md:p-6 rounded-full font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg mt-4">
            Start Generating for Free
          </Button>
        </Link>

        <div className="text-blue-300 text-sm md:text-base font-normal">
          No credit card required | Powered by Advanced AI
        </div>
        
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="text-xl sm:text-3xl font-bold text-blue-400">Fast</div>
            <div className="text-xs sm:text-sm text-gray-300">Lightning-quick generation</div>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="text-xl sm:text-3xl font-bold text-purple-400">Smart</div>
            <div className="text-xs sm:text-sm text-gray-300">AI-powered intelligence</div>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="text-xl sm:text-3xl font-bold text-cyan-400">Efficient</div>
            <div className="text-xs sm:text-sm text-gray-300">Streamlined workflow</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LandingHero
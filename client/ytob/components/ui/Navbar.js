"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { IoIosLogOut } from 'react-icons/io';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('aiGeneratedImages');
    logout();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      !buttonRef.current.contains(e.target)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeMenu);
    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, []);

  return (
    <>
      <div className="h-16"></div> {/* This div acts as a spacer */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-2 bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg h-16">
        <Sidebar/>
        <div className="flex w-full justify-end relative">
          <button
            ref={buttonRef}
            className="flex items-center p-2 bg-gray-800 rounded-full focus:outline-none hover:bg-gray-700"
            onClick={toggleMenu}
          >
            <img
              src="/logo.jpg" // Replace with your icon path
              alt="User Icon"
              className="w-6 h-6 rounded-full"
            />
          </button>
          {menuOpen && (
            <div ref={menuRef} className="absolute right-8 mt-12 w-32 bg-gray-900 border border-gray-700 rounded-md shadow-lg py-2 z-10 ">
            <button
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center justify-between"
              onClick={handleLogout}
            >
              <span className='font-[200]'>Logout</span>
              <IoIosLogOut /> 
            </button>
          </div>
          )}
        </div>
      </div>
    </>
  );
}
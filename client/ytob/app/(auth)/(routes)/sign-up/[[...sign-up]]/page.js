"use client";

import { useState , useEffect} from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaLock, FaUserPlus } from 'react-icons/fa';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Dispatch loading event when component mounts
    document.dispatchEvent(new Event('page-loading'));

    // Simulate some asynchronous operation
    setTimeout(() => {
      // Dispatch loaded event when operation completes
      document.dispatchEvent(new Event('page-loaded'));
    }, 100); // Adjust timing as needed

    // Clean up function
    return () => {
      document.dispatchEvent(new Event('page-loaded'));
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(username, password, () => {
      router.push('/sign-in');
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white w-full">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          AI-Powered Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400">Username</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Choose a username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Create a password"
              />
            </div>
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FaUserPlus className="mr-2 h-5 w-5" />
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium text-blue-400 hover:text-blue-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
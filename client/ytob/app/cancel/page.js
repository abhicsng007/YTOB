"use client";

import { useRouter } from 'next/navigation';

export default function Cancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Payment Cancelled</h1>
        <p className="text-gray-700">Your payment was cancelled. No charges were made.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
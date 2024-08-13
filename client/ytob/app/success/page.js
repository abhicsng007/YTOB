"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    if (session_id) {
      // Verify the session with your backend
      console.log('Successful purchase with session ID:', session_id);
    }
  }, [searchParams]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h1>
      <p className="text-gray-700">Thank you for your purchase. Your subscription is now active.</p>
      <button
        onClick={() => router.push('/dashboard')}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Return to Dashboard
      </button>
    </div>
  );
}

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
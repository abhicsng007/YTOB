"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogPost from '@/components/ui/BlogPost';
import LoadingProvider from '@/components/ui/LoadingProvider';

const EditPage = () => {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the itemToEdit exists in localStorage
    setIsLoading(true);
    const itemToEdit = localStorage.getItem('itemToEdit');
    if (!itemToEdit) {
      // If not, redirect to the dashboard
      router.push('/dashboard');
    }
    setIsLoading(false);
  }, [router]);

  if (!params || !params.type || !params.id) {
    return <div>Loading...</div>;
  }

  // The BlogPost component will handle loading the item from localStorage
  return (
        <LoadingProvider isLoading={isLoading}>
            <BlogPost text={""} defVideoUrl={""}/>
        </LoadingProvider>
        );
};

export default EditPage;
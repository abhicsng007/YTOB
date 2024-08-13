"use client";
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/app/services/axiosInstance";
import { useRouter, usePathname } from "next/navigation";
import { FaEdit, FaTrash, FaEllipsisV, FaPlus, FaRobot, FaBrain } from 'react-icons/fa';
import UpgradeModal from "@/components/ui/UpgradeModal";
import LoadingProvider from "@/components/ui/LoadingProvider";
import ReactMarkdown from 'react-markdown';

const Card = ({ item, isMenuVisible, onMenuToggle, onEdit, onDelete, type }) => (
  <div className="relative rounded-lg shadow-lg p-6 cursor-pointer bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-blue-500 border-opacity-30 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
    <div onClick={() => onEdit(item._id, type)} className="text-xl  mb-2 text-blue-300"><ReactMarkdown>{item.title}</ReactMarkdown></div>
    <p className="text-sm text-gray-400 mb-2">Generated on: {new Date(item.createdAt).toLocaleDateString()}</p>
    <div className="text-sm text-gray-300">
      <ReactMarkdown>{item.excerpt}</ReactMarkdown>
    </div>
    <div className="absolute top-2 right-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMenuToggle(item._id);
        }}
        className="text-gray-400 hover:text-blue-400 focus:outline-none transition-colors duration-200"
      >
        <FaEllipsisV />
      </button>
      {isMenuVisible && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-blue-500 border-opacity-30">
          <button
            onClick={() => onEdit(item._id, type)}
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left transition-colors duration-200"
          >
            <FaEdit className="inline mr-2" /> Edit
          </button>
          <button
            onClick={() => onDelete(item._id, type)}
            className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left transition-colors duration-200"
          >
            <FaTrash className="inline mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  </div>
);

const DashboardPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [credits, setCredits] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const creditsSetter = useCallback((creditCount) => {
    setCredits(creditCount);
    
  }, []);
  
  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await axiosInstance.post('/credits/get-credits');
        const { creditCount } = response.data;
        creditsSetter(creditCount);

      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    }
    
    fetchCredits();
  }, []);

  useEffect(() => {
    if (deleteMessage) {
      const timer = setTimeout(() => {
        setDeleteMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteMessage]);

  useEffect(() => {
    if (isNavigating) {
      setIsNavigating(false);
      setIsLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const blogsResponse = await axiosInstance.get('/blogs/allblogs');
        setBlogs(blogsResponse.data);
        
        const summariesResponse = await axiosInstance.get('/summaries/allsummaries');
        setSummaries(summariesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMenuToggle = (itemId) => {
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const handleEdit = (itemId, type) => {
    setIsLoading(true);
    setIsNavigating(true);
  
    const itemToEdit = type === 'blogs' 
      ? blogs.find(blog => blog._id === itemId)
      : summaries.find(summary => summary._id === itemId);
    
    if (itemToEdit) {
      localStorage.setItem('itemToEdit', JSON.stringify({...itemToEdit, type}));
      router.push(`/edit/${type}/${itemId}`);
    }
    setSelectedItem(null);
  };

  const handleDelete = (itemId, type) => {
    setItemToDelete({ id: itemId, type });
    setShowConfirmDialog(true);
    setSelectedItem(null);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const { id, type } = itemToDelete;
      const response = await axiosInstance.delete(`/${type}/${id}`);
      if (response.status === 200) {
        if (type === 'blogs') {
          setBlogs(blogs.filter(blog => blog._id !== id));
        } else {
          setSummaries(summaries.filter(summary => summary._id !== id));
        }
        setDeleteMessage("Deleted successfully");
       
      } else {
        console.error(`Failed to delete ${type}`);
        setDeleteMessage("Failed to Delete");
        
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
        setDeleteMessage("Failed to Delete");
       
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
      setItemToDelete(null);
    }
  };

  const handleNewContent = (type) => {
    if (credits === 0) {
      setShowUpgradeModal(true);
    } else {
      const loadingTimer = setTimeout(() => {
        setIsLoading(true);
      }, 300);
  
      router.push(type === 'blog' ? '/videotoblog' : '/summarization').then(() => {
        clearTimeout(loadingTimer);
        setIsLoading(false);
      });
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

  return (
    <LoadingProvider isLoading={isLoading}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
        <div className="container mx-auto">
          <header className="text-center mb-12">
            <h1 className="p-2 text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              AI-Powered Content Generation
            </h1>
            <p className="text-xl text-blue-200 flex items-center justify-center space-x-2">
              <FaRobot className="animate-pulse" />
              <span>Harness GPT for Human-like Content Creation</span>
              <FaBrain className="animate-pulse" />
            </p>
          </header>

          <section className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
              <h2 className="text-2xl sm:text-3xl font-semibold text-purple-300 text-center sm:text-left">
                Your Recent Blogs
              </h2>
              <button
                onClick={() => handleNewContent('blog')}
                className="bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg hover:scale-105 hover:shadow-2xl text-white font-bold py-2 px-4 rounded-full transform transition-all duration-300 flex items-center w-full sm:w-auto justify-center sm:justify-start"
              >
                <FaPlus className="mr-2" /> New Blog
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  item={blog}
                  type="blogs"
                  isMenuVisible={selectedItem === blog._id}
                  onMenuToggle={handleMenuToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
              <h2 className="text-2xl sm:text-3xl font-semibold text-purple-300 text-center sm:text-left">
                Your Recent Summaries
              </h2>
              <button
                onClick={() => handleNewContent('summary')}
                className="bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg hover:scale-105 hover:shadow-2xl text-white font-bold py-2 px-4 rounded-full transform transition-all duration-300 flex items-center w-full sm:w-auto justify-center sm:justify-start"
              >
                <FaPlus className="mr-2" /> New Summary
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {summaries.map((summary) => (
                <Card
                  key={summary._id}
                  item={summary}
                  type="summaries"
                  isMenuVisible={selectedItem === summary._id}
                  onMenuToggle={handleMenuToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        </div>

        <UpgradeModal 
          isOpen={showUpgradeModal}
          onClose={handleCloseModal}
          onUpgrade={handleUpgrade}
        />

        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
              <p className="mb-4">Are you sure you want to delete this item?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {deleteMessage && (
              <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
                {deleteMessage}
              </div>
        )}
    </LoadingProvider> 
  );
};

export default DashboardPage;
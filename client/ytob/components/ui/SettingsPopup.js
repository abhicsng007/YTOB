"use client";

import React, { useState, useEffect ,useCallback} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiCreditCard, FiLock, FiHelpCircle, FiChevronRight, FiX } from 'react-icons/fi';
import axiosInstance from '@/app/services/axiosInstance';
import { useRouter } from 'next/navigation';
import UpgradeModal from './UpgradeModal';


const SettingsPopup = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('account');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter()
  

  const handleCrossClick = () => {
    router.push('/dashboard');
  };

  useEffect(() => {
    if (isOpen) {
      setActiveSection('account');
    }
  }, [isOpen]);

  const sections = [
    { id: 'account', title: 'Account', icon: FiUser, content: <AccountSection router={router} /> },
    { id: 'plan', title: 'Plan Details', icon: FiCreditCard, content: <PlanSection showUpgradeModal = {showUpgradeModal}  setShowUpgradeModal = {setShowUpgradeModal} /> },
    { id: 'security', title: 'Security & Privacy', icon: FiLock, content: <SecuritySection /> },
    { id: 'help', title: 'Help Center', icon: FiHelpCircle, content: <HelpSection /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[990] p-4"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl h-[33rem] overflow-hidden flex flex-col"
          >
             
            <header className="flex justify justify-between px-4 sm:px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-400">AI Assistant Settings</h2>
              <button
              onClick={handleCrossClick}
              className="relative  text-gray-400 hover:text-white z-10"
              aria-label="Go to dashboard"
              >
              <FiX size={24} />
              </button>
            </header>
            <div className="flex-grow overflow-hidden flex flex-col sm:flex-row ">
              <nav className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-700 p-2 sm:p-4 bg-gray-800 overflow-x-auto">
                <div className="flex sm:flex-col sm: justify-between space-x-2 sm:space-x-0 sm:space-y-2 ">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-md text-left ${
                        activeSection === section.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <span className="flex items-center overflow-y-hidden">
                        <section.icon className="mr-2 sm:mr-3" />
                        <span className="hidden sm:inline">{section.title}</span>
                      </span>
                      <FiChevronRight className="hidden sm:block" />
                    </button>
                  ))}
                </div>
              </nav>
              <main className="w-full sm:w-2/3 p-4 sm:p-6 bg-gray-900 overflow-y-hidden">
                {sections.find(s => s.id === activeSection).content}
              </main>
            </div>
            <footer className="px-4 sm:px-6 py-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={handleCrossClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Done
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        
      />
    </AnimatePresence>
  );
};


const AccountSection = ({router}) => {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userinfo = JSON.parse(localStorage.getItem('userinfo'));
      if (userinfo) {
        setUsername(userinfo.username);
        setUserId(userinfo.userId);
      }
    }
  }, []);

  const handleChangePassword = () => {
    setIsChangingPassword(true);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
  
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await axiosInstance.post('/auth/change-password', { userId, newPassword });
  
      if (response.status !== 200) {
        throw new Error('Failed to change password');
      }
  
      console.log('Password changed successfully', response.data);
      
      setSuccessMessage('Password changed successfully. Redirecting to login...');
      
      // Reset form and state
      setIsChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 text-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">Account Details</h3>
      {isChangingPassword ? (
        <form onSubmit={handleSubmitPassword}>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" value={username || ''} className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm p-2" readOnly />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium">New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm p-2" 
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm p-2" 
            />
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
          <button 
            type="submit" 
            className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" value={username || ''} className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm p-2" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <button onClick={handleChangePassword} className="mt-1 text-blue-400 hover:underline">
              Change password
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium">AI Interaction Level</label>
            <select className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm p-2">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

const PlanSection = ({showUpgradeModal,setShowUpgradeModal}) => {
  const [plan, setPlan] = useState('');
  const [lastDate, setLastDate] = useState('');

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const  formatDateWithMonthName = (isoDateString) => {
    const date = new Date(isoDateString);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  const planSetter = useCallback((plan, subscriptionEndDate) => {
    setPlan(plan);
    subscriptionEndDate = formatDateWithMonthName(subscriptionEndDate);
    setLastDate(subscriptionEndDate);
    
  }, []);

  useEffect(() => {
      async function fetchPlan() {
        try {
          const response = await axiosInstance.post('/credits/get-credits');
          console.log(response);
          const { plan, subscriptionEndDate  } = response.data;
          planSetter(plan, subscriptionEndDate);

          
          
        } catch (error) {
          console.error('Error fetching credits:', error);
        }
      }
    
      fetchPlan();
    }, []);

    

    return (<div className="space-y-4 text-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">AI Plan Details</h3>
      <div className="bg-gray-800 p-4 rounded-md">
        <p className="font-medium">Current Plan: {plan}</p>
        <p className="text-sm text-gray-400">Next billing cycle: {lastDate}</p>
      </div>
      <div>
      <button className="text-blue-400 hover:underline mr-4" onClick={handleUpgradeClick}>Upgrade AI Capabilities</button>
      <button className="text-blue-400 hover:underline" onClick={handleCustomerPortal} >Manage Subscription</button>
      </div>
      
    </div>);
  };

const SecuritySection = () => (
  <div className="space-y-4 text-gray-200">
    <h3 className="text-xl font-semibold mb-4 text-blue-400">Security & Privacy</h3>
    <div>
      <h4 className="font-medium">Two-Factor Authentication</h4>
      <p className="text-sm text-gray-400 mb-2">Enhance your AI account security</p>
      <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Enable</button>
    </div>
    <div>
      <h4 className="font-medium">AI Data Usage</h4>
      <p className="text-sm text-gray-400 mb-2">Manage how your data is used to train the AI</p>
      <button className="text-blue-400 hover:underline text-sm">Adjust Settings</button>
    </div>
  </div>
);

const HelpSection = () => (
  <div className="space-y-4 text-gray-200">
    <h3 className="text-xl font-semibold mb-4 text-blue-400">AI Help Center</h3>
    <p>Need assistance with your AI assistant? Check our resources or contact support.</p>
    <button className="text-blue-400 hover:underline mr-4">AI Usage Guide</button>
    <button className="text-blue-400 hover:underline">Contact AI Support</button>
  </div>
);

const handleCustomerPortal = async () => {
  try {
    // Make sure this URL matches your backend route
    const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/create-customer-portal-session`);

    if (response.data && response.data.url) {
      window.location.href = response.data.url;
    } else {
      console.error('Invalid response from server:', response.data);
      // Handle error (e.g., show an error message to the user)
    }
  } catch (error) {
    console.error('Error creating customer portal session:', error.response?.data || error.message);
    // Handle error (e.g., show an error message to the user)
  }
};




export default SettingsPopup;
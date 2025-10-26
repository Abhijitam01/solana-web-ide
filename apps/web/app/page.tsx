'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import IDE from './components/IDE';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import LandingPage from './landing/page';
import LearningDashboard from './learn/page';
import TutorialsPage from './tutorials/page';
import UIEnhancements, { showSuccess, showInfo, showError } from './components/UIEnhancements';
import { cn } from '../lib/utils';
import { useTheme } from './components/ThemeProvider';
import { pageTransition, fadeInUp, slideInLeft, scaleIn } from '../lib/animations';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState<'learn' | 'tutorials' | 'code' | 'community'>('learn');
  const [isLoading, setIsLoading] = useState(true);
  const [previousView, setPreviousView] = useState<'learn' | 'tutorials' | 'code' | 'community'>('learn');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Check for authentication
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    localStorage.setItem('user', JSON.stringify(userData));
    showSuccess('Welcome!', 'You have successfully logged in to Solana IDE');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    showInfo('Logged Out', 'You have been logged out successfully');
  };

  const handleViewChange = (view: 'learn' | 'tutorials' | 'code' | 'community') => {
    setPreviousView(currentView);
    setCurrentView(view);
    
    // Show contextual messages
    if (view === 'code') {
      showInfo('Code Editor', 'Start building your Solana programs');
    } else if (view === 'learn') {
      showInfo('Learning Dashboard', 'Continue your Solana journey');
    } else if (view === 'tutorials') {
      showInfo('Tutorials', 'Explore interactive coding tutorials');
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-black text-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h2 
            className="text-2xl font-bold mb-2"
            variants={fadeInUp}
          >
            Loading Solana IDE
          </motion.h2>
          <motion.p 
            className="text-gray-400"
            variants={fadeInUp}
          >
            Preparing your development environment...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <UIEnhancements>
        <motion.div 
          className="min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            variants={pageTransition}
            initial="initial"
            animate="animate"
          >
            <LandingPage 
              onLogin={() => setShowAuthModal(true)}
              onSignup={() => setShowAuthModal(true)}
            />
          </motion.div>
          <AnimatePresence>
            {showAuthModal && (
              <AuthModal 
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={handleAuthSuccess}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </UIEnhancements>
    );
  }

  // Show IDE if authenticated
  return (
    <UIEnhancements>
      <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <motion.div 
              className="h-screen flex flex-col bg-black text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <Header 
                  onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                  onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  user={user}
                  onLogout={handleLogout}
                  currentView={currentView}
                  onViewChange={handleViewChange}
                />
              </motion.div>
              <div className="flex flex-1 overflow-hidden">
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      variants={slideInLeft}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Sidebar 
                        onClose={() => setSidebarOpen(false)}
                        currentView={currentView}
                        onViewChange={handleViewChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <main className="flex-1 overflow-hidden bg-transparent">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentView}
                      variants={pageTransition}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="h-full"
                    >
                      {currentView === 'learn' && (
                        <LearningDashboard />
                      )}
                      {currentView === 'tutorials' && (
                        <TutorialsPage />
                      )}
                      {currentView === 'code' && (
                        <IDE />
                      )}
                      {currentView === 'community' && (
                        <motion.div 
                          className="h-full flex items-center justify-center bg-black"
                          variants={fadeInUp}
                        >
                          <motion.div 
                            className="text-center"
                            variants={fadeInUp}
                          >
                            <motion.div 
                              className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <span className="text-3xl">👥</span>
                            </motion.div>
                            <motion.h2 
                              className="text-3xl font-bold text-white mb-4"
                              variants={fadeInUp}
                            >
                              Community Features
                            </motion.h2>
                            <motion.p 
                              className="text-xl text-gray-300 mb-8"
                              variants={fadeInUp}
                            >
                              Coming soon! Join study groups, find mentors, and collaborate with other developers.
                            </motion.p>
                            <motion.div 
                              className="flex flex-col sm:flex-row gap-4 justify-center"
                              variants={fadeInUp}
                            >
                              <motion.button 
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                Join Waitlist
                              </motion.button>
                              <motion.button 
                                className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg font-medium"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                Learn More
                              </motion.button>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </main>
              </div>
            </motion.div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </UIEnhancements>
  );
}
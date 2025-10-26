'use client';

import { useState, useEffect } from 'react';
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
import UIEnhancements, { showSuccess, showInfo } from './components/UIEnhancements';
import { useTheme } from './components/ThemeProvider';

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
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center mx-auto mb-4">
            <span className="text-white dark:text-black text-sm font-bold">S</span>
          </div>
          <h2 className="text-lg font-medium mb-2">Loading Solana IDE</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Preparing your development environment...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <UIEnhancements>
        <div className="min-h-screen">
          <LandingPage 
            onLogin={() => setShowAuthModal(true)}
            onSignup={() => setShowAuthModal(true)}
          />
          {showAuthModal && (
            <AuthModal 
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </UIEnhancements>
    );
  }

  // Show IDE if authenticated
  return (
    <UIEnhancements>
      <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              {/* Enhanced Header */}
              <Header
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                user={user}
                onLogout={handleLogout}
                currentView={currentView}
                onViewChange={handleViewChange}
              />

              {/* Main Content Area */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                {sidebarOpen && (
                  <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    <Sidebar 
                      onClose={() => setSidebarOpen(false)}
                      currentView={currentView}
                      onViewChange={handleViewChange}
                    />
                  </aside>
                )}

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                  {/* Content Tabs */}
                  <div className="h-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
                    <div className="flex items-center space-x-1">
                      <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-t-md border-b-2 border-blue-500">
                        {currentView === 'code' ? 'lib.rs' : `${currentView.charAt(0).toUpperCase() + currentView.slice(1)}.tsx`}
                      </div>
                      <div className="px-3 py-1.5 text-gray-500 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white cursor-pointer">
                        +
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-hidden">
                    {currentView === 'learn' && <LearningDashboard />}
                    {currentView === 'tutorials' && <TutorialsPage />}
                    {currentView === 'code' && <IDE />}
                    {currentView === 'community' && (
                      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl">👥</span>
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community</h2>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Coming soon...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </main>
              </div>

              {/* Footer Status Bar */}
              <footer className="h-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>Ready</span>
                  <span>•</span>
                  <span>Solana Devnet</span>
                  <span>•</span>
                  <span>AI Assistant Active</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>Ln 1, Col 1</span>
                  <span>•</span>
                  <span>UTF-8</span>
                  <span>•</span>
                  <span>Rust</span>
                </div>
              </footer>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </UIEnhancements>
  );
}
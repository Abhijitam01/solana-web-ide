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
import { cn } from '../lib/utils';
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
  const [currentView, setCurrentView] = useState<'learn' | 'code' | 'community'>('learn');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check for authentication
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <LandingPage 
          onLogin={() => setShowAuthModal(true)}
          onSignup={() => setShowAuthModal(true)}
        />
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // Show IDE if authenticated
  return (
    <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="h-screen flex flex-col bg-black text-white">
            <Header 
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              user={user}
              onLogout={handleLogout}
              currentView={currentView}
              onViewChange={setCurrentView}
            />
            <div className="flex flex-1 overflow-hidden">
              {sidebarOpen && (
                <Sidebar 
                  onClose={() => setSidebarOpen(false)}
                  currentView={currentView}
                  onViewChange={setCurrentView}
                />
              )}
              <main className="flex-1 overflow-hidden bg-transparent">
                {currentView === 'learn' && <LearningDashboard />}
                {currentView === 'code' && <IDE />}
                {currentView === 'community' && (
                  <div className="h-full flex items-center justify-center bg-black">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">👥</span>
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">Community Features</h2>
                      <p className="text-xl text-gray-300 mb-8">Coming soon! Join study groups, find mentors, and collaborate with other developers.</p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                          Join Waitlist
                        </button>
                        <button className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-all duration-300">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
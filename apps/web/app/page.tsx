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
import { cn } from '../lib/utils';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      // Default to dark mode
      setDarkMode(true);
    }

    // Check for authentication
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
      <div className={cn("min-h-screen", darkMode ? 'dark' : '')}>
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
          <div className={cn(
            "h-screen flex flex-col bg-background text-foreground",
            darkMode ? 'dark' : ''
          )}>
            <Header 
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onToggleTheme={() => setDarkMode(!darkMode)}
              darkMode={darkMode}
              user={user}
              onLogout={handleLogout}
            />
            <div className="flex flex-1 overflow-hidden">
              {sidebarOpen && (
                <Sidebar 
                  onClose={() => setSidebarOpen(false)}
                  darkMode={darkMode}
                />
              )}
              <main className="flex-1 overflow-hidden">
                <IDE darkMode={darkMode} />
              </main>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
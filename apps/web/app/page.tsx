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
          <div className="h-screen flex flex-col bg-background text-foreground">
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
              <main className="flex-1 overflow-hidden">
                {currentView === 'learn' && <LearningDashboard />}
                {currentView === 'code' && <IDE />}
                {currentView === 'community' && <div className="p-8 text-center text-white">Community features coming soon!</div>}
              </main>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
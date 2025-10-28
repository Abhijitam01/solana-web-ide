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
import UIEnhancements from './components/UIEnhancements';
import { useTheme } from './components/ThemeProvider';
import { useApp } from './context/AppContext';
import WalletSync from './components/WalletSync';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

export default function Home() {
  const {
    sidebarOpen,
    setSidebarOpen,
    isAuthenticated,
    user,
    login,
    logout,
    currentView,
    setCurrentView,
    showToast,
    setIsLoading,
    isLoading
  } = useApp();
  
  const { theme, setTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [previousView, setPreviousView] = useState<'learn' | 'tutorials' | 'code' | 'community'>('learn');

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  const handleAuthSuccess = (userData: any) => {
    login(userData);
    setShowAuthModal(false);
    showToast({ type: 'success', message: 'You have successfully logged in to Solana IDE', title: 'Welcome!' });
  };

  const handleLogout = () => {
    logout();
    showToast({ type: 'info', message: 'You have been logged out successfully', title: 'Logged Out' });
  };

  const handleViewChange = (view: 'learn' | 'tutorials' | 'code' | 'community') => {
    setPreviousView(currentView);
    setCurrentView(view);
    
    // Show contextual messages
    if (view === 'code') {
      showToast({ type: 'info', message: 'Start building your Solana programs', title: 'Code Editor' });
    } else if (view === 'learn') {
      showToast({ type: 'info', message: 'Continue your Solana journey', title: 'Learning Dashboard' });
    } else if (view === 'tutorials') {
      showToast({ type: 'info', message: 'Explore interactive coding tutorials', title: 'Tutorials' });
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-primary animate-pulse-slow">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            Solana IDE
          </h2>
          <p className="text-muted-foreground text-sm">Preparing your development environment...</p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <UIEnhancements>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
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
            <WalletSync />
            <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5 text-foreground overflow-hidden">
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
              <div className="flex flex-1 overflow-hidden relative">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
                
                {/* Sidebar */}
                {sidebarOpen && (
                  <aside className="w-64 bg-card/80 backdrop-blur-sm border-r border-border/50 flex flex-col shadow-lg z-10">
                    <Sidebar 
                      onClose={() => setSidebarOpen(false)}
                      currentView={currentView}
                      onViewChange={handleViewChange}
                    />
                  </aside>
                )}

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden relative z-0">
                  {/* Content Tabs */}
                  <div className="h-12 bg-card/60 backdrop-blur-sm border-b border-border/50 flex items-center px-4 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-600/10 text-foreground text-sm font-medium rounded-t-lg border-b-2 border-primary shadow-sm">
                        {currentView === 'code' ? 'lib.rs' : `${currentView.charAt(0).toUpperCase() + currentView.slice(1)}.tsx`}
                      </div>
                      <div className="px-3 py-2 text-muted-foreground text-sm hover:text-foreground hover:bg-accent rounded-t-lg cursor-pointer transition-all duration-200">
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
                      <div className="h-full flex items-center justify-center bg-gradient-to-br from-accent/5 via-background to-primary/5">
                        <div className="text-center animate-fade-in-up">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm">
                            <span className="text-3xl">👥</span>
                          </div>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">Community</h2>
                          <p className="text-muted-foreground text-sm">Coming soon...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </main>
              </div>

              {/* Footer Status Bar */}
              <footer className="h-10 bg-card/80 backdrop-blur-sm border-t border-border/50 flex items-center justify-between px-4 text-xs text-muted-foreground shadow-sm z-10 relative">
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
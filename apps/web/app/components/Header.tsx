'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Menu, X, Sun, Moon, Play, Download, Settings, BookOpen, Code, Users } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  user?: any;
  onLogout?: () => void;
  currentView?: 'learn' | 'code' | 'community';
  onViewChange?: (view: 'learn' | 'code' | 'community') => void;
}

export default function Header({ onToggleSidebar, onToggleTheme, user, onLogout, currentView, onViewChange }: HeaderProps) {
  const { connected } = useWallet();
  const { theme } = useTheme();
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleCompile = async () => {
    setIsCompiling(true);
    // TODO: Implement compilation logic
    setTimeout(() => setIsCompiling(false), 2000);
  };

  const handleDeploy = async () => {
    if (!connected) {
      alert('Please connect your wallet to deploy');
      return;
    }
    setIsDeploying(true);
    // TODO: Implement deployment logic
    setTimeout(() => setIsDeploying(false), 3000);
  };

  return (
    <header className="h-16 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">⚡</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Solana AI IDE
            </h1>
            <p className="text-xs text-gray-400">AI-Powered Development</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center space-x-2">
        <Button
          variant={currentView === 'learn' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange?.('learn')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            currentView === 'learn' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Learn</span>
        </Button>
        <Button
          variant={currentView === 'tutorials' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange?.('tutorials')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            currentView === 'tutorials' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Play className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Tutorials</span>
        </Button>
        <Button
          variant={currentView === 'code' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange?.('code')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            currentView === 'code' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Code className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Code</span>
        </Button>
        <Button
          variant={currentView === 'community' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange?.('community')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            currentView === 'community' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Community</span>
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        {currentView === 'code' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompile}
              disabled={isCompiling}
              className="flex items-center space-x-2 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-500"
            >
              <Play className="h-4 w-4" />
              <span className="font-medium">{isCompiling ? 'Compiling...' : 'Compile'}</span>
            </Button>

            <Button
              size="sm"
              onClick={handleDeploy}
              disabled={isDeploying || !connected}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <Download className="h-4 w-4" />
              <span className="font-medium">{isDeploying ? 'Deploying...' : 'Deploy'}</span>
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {user && (
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-medium">Welcome, {user.name || user.email}</p>
              </div>
            </div>
            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Logout
              </Button>
            )}
          </div>
        )}
        
        <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-white !shadow-lg !border-0" />
      </div>
    </header>
  );
}

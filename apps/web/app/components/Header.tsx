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
    <header className="h-12 bg-background border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="text-lg font-semibold hidden sm:block">Solana AI IDE</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center space-x-1">
        <Button
          variant={currentView === 'learn' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange?.('learn')}
          className="flex items-center space-x-1"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Learn</span>
        </Button>
        <Button
          variant={currentView === 'code' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange?.('code')}
          className="flex items-center space-x-1"
        >
          <Code className="h-4 w-4" />
          <span className="hidden sm:inline">Code</span>
        </Button>
        <Button
          variant={currentView === 'community' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange?.('community')}
          className="flex items-center space-x-1"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Community</span>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {currentView === 'code' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompile}
              disabled={isCompiling}
              className="flex items-center space-x-1"
            >
              <Play className="h-4 w-4" />
              <span>{isCompiling ? 'Compiling...' : 'Compile'}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleDeploy}
              disabled={isDeploying || !connected}
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>{isDeploying ? 'Deploying...' : 'Deploy'}</span>
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="p-2"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {user && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Welcome, {user.name || user.email}</span>
            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                Logout
              </Button>
            )}
          </div>
        )}
        
        <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90" />
      </div>
    </header>
  );
}

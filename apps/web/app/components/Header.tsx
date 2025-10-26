'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@repo/ui/button';
import { Menu, X, Sun, Moon, Play, Download, Settings, BookOpen, Code, Users } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTheme } from './ThemeProvider';
import { fadeInUp, buttonHover, buttonTap } from '../../lib/animations';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  user?: any;
  onLogout?: () => void;
  currentView?: 'learn' | 'tutorials' | 'code' | 'community';
  onViewChange?: (view: 'learn' | 'tutorials' | 'code' | 'community') => void;
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
    <motion.header 
      className="h-16 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ backgroundColor: 'rgba(17, 24, 39, 0.7)' }}
    >
      <motion.div 
        className="flex items-center space-x-4"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div 
            className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: '#1d4ed8',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="text-white font-bold text-lg">⚡</span>
          </motion.div>
          <div>
            <motion.h1 
              className="text-xl font-bold text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Solana AI IDE
            </motion.h1>
            <motion.p 
              className="text-xs text-gray-400"
              whileHover={{ color: '#9ca3af' }}
              transition={{ duration: 0.2 }}
            >
              AI-Powered Development
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <motion.div 
        className="flex items-center space-x-2"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
      >
        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <Button
            variant={currentView === 'learn' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange?.('learn')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentView === 'learn' 
                ? 'bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Learn</span>
          </Button>
        </motion.div>
        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <Button
            variant={currentView === 'tutorials' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange?.('tutorials')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentView === 'tutorials' 
                ? 'bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Tutorials</span>
          </Button>
        </motion.div>
        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <Button
            variant={currentView === 'code' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange?.('code')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentView === 'code' 
                ? 'bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Code</span>
          </Button>
        </motion.div>
        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <Button
            variant={currentView === 'community' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange?.('community')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentView === 'community' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Community</span>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex items-center space-x-3"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        {currentView === 'code' && (
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompile}
                disabled={isCompiling}
                className="flex items-center space-x-2 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-500"
              >
                <motion.div
                  animate={isCompiling ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isCompiling ? Infinity : 0, ease: "linear" }}
                >
                  <Play className="h-4 w-4" />
                </motion.div>
                <span className="font-medium">{isCompiling ? 'Compiling...' : 'Compile'}</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <Button
                size="sm"
                onClick={handleDeploy}
                disabled={isDeploying || !connected}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                <motion.div
                  animate={isDeploying ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isDeploying ? Infinity : 0, ease: "linear" }}
                >
                  <Download className="h-4 w-4" />
                </motion.div>
                <span className="font-medium">{isDeploying ? 'Deploying...' : 'Deploy'}</span>
              </Button>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10"
          >
            <motion.div
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.div>
          </Button>
        </motion.div>

        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </motion.div>

        {user && (
          <motion.div 
            className="flex items-center space-x-3 text-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div 
                className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="text-white font-bold text-sm">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              </motion.div>
              <div className="hidden sm:block">
                <p className="text-white font-medium">Welcome, {user.name || user.email}</p>
              </div>
            </motion.div>
            {onLogout && (
              <motion.div
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Logout
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-white !shadow-lg !border-0" />
        </motion.div>
      </motion.div>
    </motion.header>
  );
}

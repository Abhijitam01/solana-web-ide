'use client';

import { useState } from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  BookOpen, 
  Code, 
  Users, 
  Search,
  User,
  LogOut
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTheme } from './ThemeProvider';

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
  const [showUserMenu, setShowUserMenu] = useState(false);

  const views = [
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'tutorials', label: 'Tutorials', icon: Code },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'community', label: 'Community', icon: Users },
  ] as const;

  return (
    <header className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        {/* Menu button */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-black dark:bg-white rounded flex items-center justify-center">
            <span className="text-white dark:text-black text-xs font-bold">S</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Solana IDE</span>
        </div>

        {/* View switcher */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-0.5">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => onViewChange?.(view.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                  currentView === view.id
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
          <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Wallet/User */}
        {connected ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                <div className="p-2">
                  <div className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                    {user?.name || 'User'}
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-2 px-2 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <WalletMultiButton className="!bg-black dark:!bg-white !text-white dark:!text-black !text-xs !h-8 !px-3 !rounded-md hover:!bg-gray-800 dark:hover:!bg-gray-200 transition-colors" />
        )}
      </div>
    </header>
  );
}
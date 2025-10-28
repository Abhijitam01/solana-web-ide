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
    <header className="h-14 bg-card/80 dark:bg-card/90 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-6 shadow-sm sticky top-0 z-50 transition-all duration-300">
      {/* Left side */}
      <div className="flex items-center space-x-5">
        {/* Menu button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 group"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2.5 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-primary shadow-sm group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-base font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Solana IDE</span>
        </div>

        {/* View switcher */}
        <div className="flex items-center bg-accent rounded-lg p-1 shadow-inner">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => onViewChange?.(view.id)}
                className={`group flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  currentView === view.id
                    ? "bg-background text-foreground shadow-sm scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        {/* Search */}
        <button className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 group" aria-label="Search">
          <Search className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 group"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </button>

        {/* Wallet Status Indicator */}
        {connected && (
          <div className="flex items-center space-x-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Connected</span>
          </div>
        )}

        {/* Wallet/User */}
        {connected ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1.5 hover:bg-accent rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 group"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-xl backdrop-blur-xl z-50 animate-fade-in-down overflow-hidden">
                <div className="p-3">
                  <div className="px-3 py-2 text-sm font-semibold text-foreground border-b border-border/50 mb-2">
                    {user?.name || 'User'}
                  </div>
                  <div className="px-3 py-1.5 text-xs text-muted-foreground mb-2">
                    {user?.email || 'user@example.com'}
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all duration-200 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <WalletMultiButton className="!h-9 !px-4 !rounded-lg !bg-primary !text-primary-foreground hover:!bg-primary/90 !transition-all !shadow-sm hover:!shadow-md !scale-100 hover:!scale-105 active:!scale-95" />
        )}
      </div>
    </header>
  );
}
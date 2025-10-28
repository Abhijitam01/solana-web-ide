'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// ==================== Types ====================

export type Theme = 'dark' | 'light' | 'system';
export type View = 'learn' | 'tutorials' | 'code' | 'community';
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// User and Authentication
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// File System
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  isOpen?: boolean;
  path?: string;
}

// Editor Tab
export interface EditorTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
  isActive: boolean;
}

// AI Assistant
export interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCode?: boolean;
  language?: string;
}

// Terminal
export interface TerminalOutput {
  id: string;
  type: 'command' | 'output' | 'error' | 'warning' | 'info' | 'success';
  content: string;
  timestamp: Date;
  isError?: boolean;
  errorDetails?: {
    file?: string;
    line?: number;
    column?: number;
    code?: string;
    message: string;
  };
}

// Debugger State
export interface DebugState {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  breakpoints: Set<number>;
  callStack: CallStackFrame[];
  variables: Variable[];
  accounts: AccountState[];
  logs: DebugLog[];
}

export interface CallStackFrame {
  id: string;
  functionName: string;
  file: string;
  line: number;
  variables: Variable[];
}

export interface Variable {
  name: string;
  value: string;
  type: string;
  scope: 'local' | 'global' | 'parameter';
  isMutable: boolean;
  address?: string;
}

export interface AccountState {
  address: string;
  owner: string;
  lamports: number;
  data: string;
  executable: boolean;
  rentEpoch: number;
  isSigner: boolean;
  isWritable: boolean;
  isInitialized: boolean;
  space: number;
  dataSize: number;
}

export interface DebugLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  line?: number;
  data?: any;
}

// Toast/Notification
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

// Deployment
export interface Deployment {
  id: string;
  programId: string;
  transactionId: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: Date;
  error?: string;
}

// Learning Progress
export interface LearningProgress {
  completedTutorials: string[];
  currentTutorial?: string;
  achievements: string[];
  totalXP: number;
}

// ==================== Context State ====================

interface AppContextState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;

  // Wallet (Solana)
  wallet: {
    publicKey: PublicKey | null;
    connected: boolean;
    connecting: boolean;
    disconnect: () => void;
  };

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentView: View;
  setCurrentView: (view: View) => void;
  
  // File System
  files: FileNode[];
  setFiles: (files: FileNode[] | ((prev: FileNode[]) => FileNode[])) => void;
  activeFile: string;
  setActiveFile: (id: string) => void;
  
  // Editor Tabs
  tabs: EditorTab[];
  setTabs: (tabs: EditorTab[] | ((prev: EditorTab[]) => EditorTab[])) => void;
  
  // AI Assistant
  aiMessages: AIMessage[];
  addAIMessage: (message: AIMessage) => void;
  clearAIMessages: () => void;
  aiLoading: boolean;
  setAILoading: (loading: boolean) => void;
  
  // Terminal
  terminalOutputs: TerminalOutput[];
  addTerminalOutput: (output: TerminalOutput) => void;
  clearTerminal: () => void;
  terminalOpen: boolean;
  setTerminalOpen: (open: boolean) => void;
  
  // Debugger
  debugState: DebugState;
  setDebugState: (state: Partial<DebugState>) => void;
  resetDebugger: () => void;
  
  // Toast/Notifications
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Deployment
  deployments: Deployment[];
  addDeployment: (deployment: Deployment) => void;
  
  // Learning
  learningProgress: LearningProgress;
  updateLearningProgress: (progress: Partial<LearningProgress>) => void;
  
  // Loading States
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  compilationLoading: boolean;
  setCompilationLoading: (loading: boolean) => void;
  deploymentLoading: boolean;
  setDeploymentLoading: (loading: boolean) => void;
}

// ==================== Default States ====================

const defaultDebugState: DebugState = {
  isRunning: false,
  isPaused: false,
  currentStep: 0,
  totalSteps: 0,
  breakpoints: new Set(),
  callStack: [],
  variables: [],
  accounts: [],
  logs: []
};

const defaultLearningProgress: LearningProgress = {
  completedTutorials: [],
  achievements: [],
  totalXP: 0
};

// ==================== Context ====================

const AppContext = createContext<AppContextState | undefined>(undefined);

// ==================== Provider ====================

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { publicKey, connecting, disconnect } = useWallet();
  const connection = useConnection();

  // Theme State
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('solana-ide-theme') as Theme) || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('solana-ide-theme', newTheme);
    }
    setThemeState(newTheme);
  }, []);

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
      }
    }
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  }, []);

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<View>('learn');

  // File System State
  const [files, setFiles] = useState<FileNode[]>([
    {
      id: 'lib.rs',
      name: 'lib.rs',
      type: 'file',
      content: `use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    pub count: u64,
}`
    }
  ]);
  const [activeFile, setActiveFile] = useState('lib.rs');

  // Editor Tabs State
  const [tabs, setTabs] = useState<EditorTab[]>([
    {
      id: 'lib.rs',
      name: 'lib.rs',
      content: files[0]?.content || '',
      language: 'rust',
      isDirty: false,
      isActive: true
    }
  ]);

  // AI Assistant State
  const [aiMessages, setAIMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. I can help you with Solana development, explain code, optimize performance, review security, and much more. What would you like to work on?',
      timestamp: new Date()
    }
  ]);
  const [aiLoading, setAILoading] = useState(false);

  const addAIMessage = useCallback((message: AIMessage) => {
    setAIMessages(prev => [...prev, message]);
  }, []);

  const clearAIMessages = useCallback(() => {
    setAIMessages([
      {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Conversation cleared. How can I help you?',
        timestamp: new Date()
      }
    ]);
  }, []);

  // Terminal State
  const [terminalOutputs, setTerminalOutputs] = useState<TerminalOutput[]>([
    {
      id: '1',
      type: 'info',
      content: 'Solana AI IDE Terminal - Ready for commands',
      timestamp: new Date()
    }
  ]);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const addTerminalOutput = useCallback((output: TerminalOutput) => {
    setTerminalOutputs(prev => [...prev, output]);
  }, []);

  const clearTerminal = useCallback(() => {
    setTerminalOutputs([
      {
        id: Date.now().toString(),
        type: 'info',
        content: 'Terminal cleared. Ready for commands.',
        timestamp: new Date()
      }
    ]);
  }, []);

  // Debugger State
  const [debugState, setDebugStateRaw] = useState<DebugState>(defaultDebugState);

  const setDebugState = useCallback((state: Partial<DebugState>) => {
    setDebugStateRaw(prev => ({ ...prev, ...state }));
  }, []);

  const resetDebugger = useCallback(() => {
    setDebugStateRaw(defaultDebugState);
  }, []);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 3000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Deployment State
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  const addDeployment = useCallback((deployment: Deployment) => {
    setDeployments(prev => [...prev, deployment]);
  }, []);

  // Learning Progress State
  const [learningProgress, setLearningProgress] = useState<LearningProgress>(defaultLearningProgress);

  const updateLearningProgress = useCallback((progress: Partial<LearningProgress>) => {
    setLearningProgress(prev => ({ ...prev, ...progress }));
  }, []);

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [compilationLoading, setCompilationLoading] = useState(false);
  const [deploymentLoading, setDeploymentLoading] = useState(false);

  // Context Value
  const value: AppContextState = {
    theme,
    setTheme,
    user,
    isAuthenticated,
    login,
    logout,
    wallet: {
      publicKey,
      connected: !!publicKey,
      connecting,
      disconnect
    },
    sidebarOpen,
    setSidebarOpen,
    currentView,
    setCurrentView,
    files,
    setFiles,
    activeFile,
    setActiveFile,
    tabs,
    setTabs,
    aiMessages,
    addAIMessage,
    clearAIMessages,
    aiLoading,
    setAILoading,
    terminalOutputs,
    addTerminalOutput,
    clearTerminal,
    terminalOpen,
    setTerminalOpen,
    debugState,
    setDebugState,
    resetDebugger,
    toasts,
    showToast,
    removeToast,
    deployments,
    addDeployment,
    learningProgress,
    updateLearningProgress,
    isLoading,
    setIsLoading,
    compilationLoading,
    setCompilationLoading,
    deploymentLoading,
    setDeploymentLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ==================== Hook ====================

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}


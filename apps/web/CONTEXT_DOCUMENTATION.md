# Solana Web Application Context Documentation

## Overview

This document provides a comprehensive guide to the application's centralized state management system using React Context API. The `AppContext` provides a unified way to manage all application state across the entire application.

## Table of Contents

1. [Context Architecture](#context-architecture)
2. [Setup and Usage](#setup-and-usage)
3. [State Management](#state-management)
4. [Available Hooks](#available-hooks)
5. [Data Structures](#data-structures)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

---

## Context Architecture

### File Location
- **Context Provider**: `apps/web/app/context/AppContext.tsx`
- **Type Definitions**: Included in the same file

### Provider Hierarchy
```
AppProvider (Root)
  ├── ThemeProvider (existing)
  ├── ConnectionProvider (Solana)
  ├── WalletProvider (Solana)
  └── All Application Components
```

---

## Setup and Usage

### 1. Wrap Your Application

In your root layout (`apps/web/app/layout.tsx`), wrap your application with `AppProvider`:

```tsx
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './components/ThemeProvider';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletProvider } from '@solana/wallet-adapter-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="dark">
          <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
            <WalletProvider wallets={wallets} autoConnect>
              <AppProvider>
                {children}
              </AppProvider>
            </WalletProvider>
          </ConnectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Use the Hook in Components

```tsx
'use client';

import { useApp } from '../context/AppContext';

export default function MyComponent() {
  const {
    theme,
    setTheme,
    user,
    isAuthenticated,
    // ... other state
  } = useApp();

  // Use the state and functions
  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

---

## State Management

### Theme Management

Control the application theme (dark/light/system).

```tsx
const { theme, setTheme } = useApp();

// Get current theme
console.log(theme); // 'dark' | 'light' | 'system'

// Set new theme
setTheme('dark');
setTheme('light');
setTheme('system');
```

**Persistence**: Theme preference is saved to localStorage as `'solana-ide-theme'`.

---

### Authentication

Manage user authentication state.

```tsx
const { user, isAuthenticated, login, logout } = useApp();

// Check if user is authenticated
if (isAuthenticated) {
  console.log('User:', user);
}

// Login
const handleLogin = () => {
  login({
    id: '123',
    username: 'john_doe',
    email: 'john@example.com',
    avatar: 'https://...'
  });
};

// Logout
logout();
```

**User Interface**:
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}
```

**Persistence**: User data is saved to localStorage as `'user'`.

---

### Solana Wallet Management

Access Solana wallet connection state and functions.

```tsx
const { wallet } = useApp();

// Access wallet properties
const { publicKey, connected, connecting, disconnect } = wallet;

// Check connection
if (connected) {
  console.log('Wallet:', publicKey.toString());
}

// Disconnect
disconnect();
```

**Wallet Interface**:
```typescript
wallet: {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  disconnect: () => void;
}
```

---

### UI State Management

Control sidebar visibility and current view.

```tsx
const { sidebarOpen, setSidebarOpen, currentView, setCurrentView } = useApp();

// Toggle sidebar
setSidebarOpen(!sidebarOpen);

// Change view
setCurrentView('code');  // 'learn' | 'tutorials' | 'code' | 'community'
```

---

### File System Management

Manage files and the active file in the IDE.

```tsx
const { files, setFiles, activeFile, setActiveFile } = useApp();

// Get files
console.log(files);

// Add new file
setFiles(prev => [...prev, {
  id: 'new-file',
  name: 'new_file.rs',
  type: 'file',
  content: '// New file'
}]);

// Set active file
setActiveFile('lib.rs');
```

**FileNode Interface**:
```typescript
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  isOpen?: boolean;
  path?: string;
}
```

---

### Editor Tabs Management

Manage multiple open tabs in the code editor.

```tsx
const { tabs, setTabs } = useApp();

// Get all tabs
console.log(tabs);

// Add new tab
setTabs(prev => [...prev, {
  id: 'new-tab',
  name: 'new_file.rs',
  content: '// Code here',
  language: 'rust',
  isDirty: false,
  isActive: true
}]);

// Update tab content
setTabs(prev => prev.map(tab =>
  tab.id === 'lib.rs'
    ? { ...tab, content: 'new content', isDirty: true }
    : tab
));

// Close tab
setTabs(prev => prev.filter(tab => tab.id !== 'tab-to-close'));
```

**EditorTab Interface**:
```typescript
interface EditorTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
  isActive: boolean;
}
```

---

### AI Assistant Management

Manage AI chat messages and loading state.

```tsx
const {
  aiMessages,
  addAIMessage,
  clearAIMessages,
  aiLoading,
  setAILoading
} = useApp();

// Send user message
addAIMessage({
  id: Date.now().toString(),
  type: 'user',
  content: 'Hello AI!',
  timestamp: new Date()
});

// Send assistant response
addAIMessage({
  id: Date.now().toString(),
  type: 'assistant',
  content: 'Hello! How can I help?',
  timestamp: new Date(),
  isCode: true,
  language: 'rust'
});

// Clear conversation
clearAIMessages();

// Set loading state
setAILoading(true);
```

**AIMessage Interface**:
```typescript
interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCode?: boolean;
  language?: string;
}
```

---

### Terminal Management

Manage terminal output and commands.

```tsx
const {
  terminalOutputs,
  addTerminalOutput,
  clearTerminal,
  terminalOpen,
  setTerminalOpen
} = useApp();

// Add command output
addTerminalOutput({
  id: Date.now().toString(),
  type: 'command',
  content: 'cargo build',
  timestamp: new Date()
});

// Add error
addTerminalOutput({
  id: Date.now().toString(),
  type: 'error',
  content: 'Compilation error',
  timestamp: new Date(),
  isError: true,
  errorDetails: {
    file: 'lib.rs',
    line: 42,
    message: 'Syntax error'
  }
});

// Clear terminal
clearTerminal();

// Toggle terminal
setTerminalOpen(!terminalOpen);
```

**TerminalOutput Interface**:
```typescript
interface TerminalOutput {
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
```

---

### Debugger State Management

Manage debugging state for Solana program debugging.

```tsx
const { debugState, setDebugState, resetDebugger } = useApp();

// Update debug state
setDebugState({
  isRunning: true,
  isPaused: false,
  currentStep: 5
});

// Add breakpoint
setDebugState({
  breakpoints: new Set([15, 42, 67])
});

// Reset debugger
resetDebugger();
```

**DebugState Interface**:
```typescript
interface DebugState {
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
```

---

### Toast Notifications

Display toast notifications throughout the application.

```tsx
const { showToast, removeToast } = useApp();

// Show success toast
showToast({
  type: 'success',
  message: 'File saved successfully!',
  title: 'Success'
});

// Show error toast
showToast({
  type: 'error',
  message: 'Failed to compile',
  title: 'Compilation Error',
  duration: 5000  // Show for 5 seconds
});

// Show warning
showToast({
  type: 'warning',
  message: 'This action cannot be undone',
  title: 'Warning'
});

// Show info
showToast({
  type: 'info',
  message: 'Saving changes...',
  title: 'Info'
});
```

**Toast Interface**:
```typescript
interface Toast {
  id: string;          // Auto-generated
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;   // Default: 3000ms
}
```

**Toast Types**: `'success' | 'error' | 'warning' | 'info'`

---

### Deployment Tracking

Track Solana program deployments.

```tsx
const { deployments, addDeployment } = useApp();

// Add deployment record
addDeployment({
  id: Date.now().toString(),
  programId: '11111111111111111111111111111111',
  transactionId: 'ABC123...',
  status: 'success',
  timestamp: new Date()
});

// Log failed deployment
addDeployment({
  id: Date.now().toString(),
  programId: '11111111111111111111111111111111',
  transactionId: 'XYZ789...',
  status: 'failed',
  timestamp: new Date(),
  error: 'Insufficient funds'
});
```

**Deployment Interface**:
```typescript
interface Deployment {
  id: string;
  programId: string;
  transactionId: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: Date;
  error?: string;
}
```

---

### Learning Progress

Track user learning progress and achievements.

```tsx
const { learningProgress, updateLearningProgress } = useApp();

// Complete tutorial
updateLearningProgress({
  completedTutorials: [...learningProgress.completedTutorials, 'tutorial-1']
});

// Update XP
updateLearningProgress({
  totalXP: learningProgress.totalXP + 100
});

// Add achievement
updateLearningProgress({
  achievements: [...learningProgress.achievements, 'first-deploy']
});
```

**LearningProgress Interface**:
```typescript
interface LearningProgress {
  completedTutorials: string[];
  currentTutorial?: string;
  achievements: string[];
  totalXP: number;
}
```

---

### Loading States

Manage various loading states throughout the application.

```tsx
const {
  isLoading,
  setIsLoading,
  compilationLoading,
  setCompilationLoading,
  deploymentLoading,
  setDeploymentLoading
} = useApp();

// Set general loading
setIsLoading(true);

// Set compilation loading
setCompilationLoading(true);

// Set deployment loading
setDeploymentLoading(true);

// In components
if (compilationLoading) {
  return <LoadingSpinner />;
}
```

---

## Available Hooks

### Primary Hook

```tsx
import { useApp } from '../context/AppContext';

// Returns the entire context state
const app = useApp();
```

### Alternative: Destructured Access

```tsx
const {
  theme,
  setTheme,
  user,
  login,
  logout,
  wallet,
  files,
  tabs,
  // ... other properties
} = useApp();
```

---

## Usage Examples

### Complete Component Example

```tsx
'use client';

import { useApp } from '../context/AppContext';
import { Button } from '@repo/ui/button';

export default function CodeEditor() {
  const {
    tabs,
    setTabs,
    activeFile,
    compilationLoading,
    setCompilationLoading,
    showToast
  } = useApp();

  const handleCompile = async () => {
    setCompilationLoading(true);
    
    try {
      const activeTab = tabs.find(tab => tab.isActive);
      
      // Compilation logic
      const response = await fetch('/api/compile', {
        method: 'POST',
        body: JSON.stringify({ code: activeTab?.content })
      });

      setCompilationLoading(false);
      
      showToast({
        type: 'success',
        message: 'Compilation successful!',
        title: 'Success'
      });
    } catch (error) {
      setCompilationLoading(false);
      
      showToast({
        type: 'error',
        message: 'Compilation failed',
        title: 'Error'
      });
    }
  };

  const handleCodeChange = (newContent: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === activeFile
        ? { ...tab, content: newContent, isDirty: true }
        : tab
    ));
  };

  const activeTab = tabs.find(tab => tab.isActive);

  return (
    <div>
      <textarea
        value={activeTab?.content || ''}
        onChange={(e) => handleCodeChange(e.target.value)}
      />
      <Button
        onClick={handleCompile}
        disabled={compilationLoading}
      >
        {compilationLoading ? 'Compiling...' : 'Compile'}
      </Button>
    </div>
  );
}
```

---

## Best Practices

### 1. **Import Only What You Need**

```tsx
// ✅ Good - Destructure only needed properties
const { theme, setTheme } = useApp();

// ❌ Avoid - Destructuring everything
const app = useApp();
```

### 2. **Use Callbacks for State Updates**

```tsx
// ✅ Good - Functional updates
setTabs(prev => [...prev, newTab]);
setFiles(prev => prev.map(f => f.id === id ? updated : f));

// ❌ Avoid - Direct mutations
const newTabs = tabs.push(newTab);
```

### 3. **Handle Loading States**

```tsx
// ✅ Good - Show loading indicators
if (compilationLoading) return <Spinner />;

// ❌ Avoid - Blocking UI without feedback
await compile();
```

### 4. **Provide User Feedback**

```tsx
// ✅ Good - Show toasts for user actions
showToast({ type: 'success', message: 'Saved!' });

// ❌ Avoid - Silent failures
try { save(); } catch { /* ignore */ }
```

### 5. **Type Safety**

```tsx
// ✅ Good - Use TypeScript interfaces
const message: AIMessage = {
  id: '1',
  type: 'user',
  content: 'Hello',
  timestamp: new Date()
};

// ❌ Avoid - Any types
const message: any = { ... };
```

### 6. **Performance Optimization**

```tsx
// ✅ Good - Memoize heavy computations
const activeTab = useMemo(
  () => tabs.find(tab => tab.isActive),
  [tabs]
);

// ❌ Avoid - Repeated calculations
const activeTab = tabs.find(tab => tab.isActive); // In render loop
```

---

## Common Patterns

### Pattern 1: Conditional Rendering

```tsx
const { isAuthenticated, user } = useApp();

if (!isAuthenticated) {
  return <LoginPage />;
}

return <Dashboard user={user} />;
```

### Pattern 2: State-Dependent UI

```tsx
const { terminalOpen, setTerminalOpen } = useApp();

return (
  <div>
    <button onClick={() => setTerminalOpen(!terminalOpen)}>
      Toggle Terminal
    </button>
    {terminalOpen && <Terminal />}
  </div>
);
```

### Pattern 3: Global Event Handling

```tsx
const { showToast, setCompilationLoading } = useApp();

useEffect(() => {
  const handler = (event) => {
    if (event.detail.type === 'compile') {
      handleCompile();
    }
  };
  
  window.addEventListener('global-event', handler);
  return () => window.removeEventListener('global-event', handler);
}, []);
```

---

## Troubleshooting

### Issue: Context Returns Undefined

**Solution**: Ensure component is wrapped in `AppProvider`

```tsx
// ❌ This will throw an error
export default function Component() {
  const { theme } = useApp(); // Error: must be used within AppProvider
}

// ✅ This works
export default function Component() {
  return (
    <AppProvider>
      <AnotherComponent />
    </AppProvider>
  );
}
```

### Issue: State Not Persisting

**Solution**: Check localStorage permissions and browser settings

```tsx
// Check if storage is available
if (typeof window !== 'undefined') {
  console.log('Storage available');
}
```

### Issue: Performance Issues

**Solution**: Use React.memo and useMemo for expensive components

```tsx
export default React.memo(function HeavyComponent() {
  const { files } = useApp();
  // ... component logic
});
```

---

## Migration Guide

### From Local State to Context

**Before** (Local State):
```tsx
const [theme, setTheme] = useState('dark');
const [user, setUser] = useState(null);
```

**After** (Context):
```tsx
const { theme, setTheme, user } = useApp();
```

### From Props Drilling to Context

**Before** (Props):
```tsx
<Parent>
  <Child1 user={user} theme={theme} />
  <Child2 user={user} theme={theme} />
  <Child3 user={user} theme={theme} />
</Parent>
```

**After** (Context):
```tsx
<Parent>
  <Child1 />
  <Child2 />
  <Child3 />
</Parent>

// In any child component
const { user, theme } = useApp();
```

---

## Further Reading

- [React Context API Documentation](https://react.dev/reference/react/useContext)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Anchor Framework Documentation](https://www.anchor-lang.com/docs)

---

## Support

For questions or issues related to the context system, please refer to this documentation or contact the development team.

**Last Updated**: 2024
**Version**: 1.0.0


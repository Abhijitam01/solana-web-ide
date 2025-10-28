# Context Quick Start Guide

## 🚀 Quick Integration

### 1. **Import the Context Hook in Any Component**

```tsx
'use client';

import { useApp } from './context/AppContext';

export default function MyComponent() {
  const { /* extract what you need */ } = useApp();
  
  return <div>My Component</div>;
}
```

### 2. **Most Common Use Cases**

#### Authentication
```tsx
const { user, isAuthenticated, login, logout } = useApp();

// Login
login({ id: '1', username: 'john', email: 'john@example.com' });

// Logout
logout();

// Check auth
if (isAuthenticated) {
  console.log('User:', user);
}
```

#### Theme
```tsx
const { theme, setTheme } = useApp();

// Change theme
setTheme('dark');   // or 'light' or 'system'
```

#### Toast Notifications
```tsx
const { showToast } = useApp();

// Show success
showToast({ type: 'success', message: 'Saved!', title: 'Success' });

// Show error
showToast({ type: 'error', message: 'Failed!', title: 'Error' });

// Show warning
showToast({ type: 'warning', message: 'Careful!', title: 'Warning' });

// Show info
showToast({ type: 'info', message: 'Info...', title: 'Info' });
```

#### File Management
```tsx
const { files, setFiles, activeFile, setActiveFile } = useApp();

// Get all files
console.log(files);

// Add file
setFiles(prev => [...prev, {
  id: 'new-file',
  name: 'file.rs',
  type: 'file',
  content: '// Code here'
}]);

// Set active
setActiveFile('lib.rs');
```

#### Editor Tabs
```tsx
const { tabs, setTabs } = useApp();

// Add tab
setTabs(prev => [...prev, {
  id: 'tab-1',
  name: 'file.rs',
  content: '// Code',
  language: 'rust',
  isDirty: false,
  isActive: true
}]);

// Update content
setTabs(prev => prev.map(tab =>
  tab.id === activeFile
    ? { ...tab, content: newContent, isDirty: true }
    : tab
));
```

#### AI Chat
```tsx
const { aiMessages, addAIMessage, clearAIMessages } = useApp();

// Send message
addAIMessage({
  id: Date.now().toString(),
  type: 'user',
  content: 'Hello!',
  timestamp: new Date()
});

// Clear chat
clearAIMessages();
```

#### Terminal
```tsx
const { terminalOutputs, addTerminalOutput, terminalOpen, setTerminalOpen } = useApp();

// Add output
addTerminalOutput({
  id: Date.now().toString(),
  type: 'info',
  content: 'Command executed',
  timestamp: new Date()
});

// Toggle terminal
setTerminalOpen(!terminalOpen);
```

#### Loading States
```tsx
const { isLoading, setIsLoading, compilationLoading, setCompilationLoading } = useApp();

// Set loading
setCompilationLoading(true);
await compile();
setCompilationLoading(false);

// Check loading
if (compilationLoading) return <Spinner />;
```

#### Wallet (Solana)
```tsx
const { wallet } = useApp();

// Access wallet
const { publicKey, connected, connecting } = wallet;

if (connected) {
  console.log('Address:', publicKey?.toString());
}
```

### 3. **Quick Component Template**

```tsx
'use client';

import { useApp } from './context/AppContext';
import { Button } from '@repo/ui/button';

export default function QuickComponent() {
  const {
    theme,
    user,
    showToast,
    tabs,
    setTabs
  } = useApp();

  const handleClick = () => {
    showToast({
      type: 'success',
      message: `${user?.username} clicked the button!`,
      title: 'Action'
    });
  };

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <Button onClick={handleClick}>Click Me</Button>
      <p>Current theme: {theme}</p>
      <p>Open tabs: {tabs.length}</p>
    </div>
  );
}
```

### 4. **Available Properties**

All available properties in `useApp()`:

```tsx
{
  // Theme
  theme, setTheme,
  
  // Auth
  user, isAuthenticated, login, logout,
  
  // Wallet
  wallet: { publicKey, connected, connecting, setWalletState },
  
  // UI
  sidebarOpen, setSidebarOpen,
  currentView, setCurrentView,
  
  // Files
  files, setFiles,
  activeFile, setActiveFile,
  
  // Editor
  tabs, setTabs,
  
  // AI
  aiMessages, addAIMessage, clearAIMessages,
  aiLoading, setAILoading,
  
  // Terminal
  terminalOutputs, addTerminalOutput, clearTerminal,
  terminalOpen, setTerminalOpen,
  
  // Debugger
  debugState, setDebugState, resetDebugger,
  
  // Toasts
  toasts, showToast, removeToast,
  
  // Deployment
  deployments, addDeployment,
  
  // Learning
  learningProgress, updateLearningProgress,
  
  // Loading
  isLoading, setIsLoading,
  compilationLoading, setCompilationLoading,
  deploymentLoading, setDeploymentLoading
}
```

### 5. **Best Practices**

✅ **DO:**
- Destructure only what you need
- Use functional updates for arrays/objects
- Show loading states to users
- Use toasts for user feedback

❌ **DON'T:**
- Mutate state directly
- Use all properties in every component
- Ignore loading states
- Block UI without feedback

### 6. **Need More Help?**

📖 Read the full documentation: `CONTEXT_DOCUMENTATION.md`
💡 Check examples in existing components
🐛 Check browser console for errors

---

**That's it!** You're ready to use the context throughout your application. 🎉


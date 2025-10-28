# Context System Visual Guide

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Root Layout                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              ThemeProvider                        │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │            AppProvider                      │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │      ConnectionProvider (Solana)      │  │  │  │
│  │  │  │  ┌─────────────────────────────────┐  │  │  │  │
│  │  │  │  │    WalletProvider (Solana)      │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │      WalletSync          │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              All Components Can Use
              const { ... } = useApp()
```

## 📊 State Flow Diagram

```
┌─────────────────┐
│   Component A   │ ──┐
└─────────────────┘   │
                      │
┌─────────────────┐   │    ┌──────────────┐
│   Component B   │ ──┼───▶│  AppContext  │
└─────────────────┘   │    │  (Central    │
                      │    │   State)     │
┌─────────────────┐   │    └──────────────┘
│   Component C   │ ──┘              │
└─────────────────┘                  │
                                     ▼
                            ┌──────────────┐
                            │ localStorage │
                            │  (Persist)   │
                            └──────────────┘
```

## 🎯 Component Integration

### Example: Three-Level Component Tree

```
AppLayout (uses useApp)
├── Header (uses useApp)
│   ├── ThemeToggle (uses theme, setTheme)
│   ├── UserProfile (uses user, logout)
│   └── WalletButton (uses wallet)
├── Sidebar (uses useApp)
│   ├── FileTree (uses files, setActiveFile)
│   └── ProjectList (uses projects)
└── MainArea (uses useApp)
    ├── CodeEditor (uses tabs, setTabs)
    ├── AIPanel (uses aiMessages, addAIMessage)
    └── Terminal (uses terminalOutputs, addTerminalOutput)
```

**No props passed between levels!** ✨

## 🔄 State Update Flow

### Example: User Adds a File

```
1. User clicks "Add File" button
   │
   ▼
2. Component calls setFiles()
   │
   ▼
3. AppContext updates files state
   │
   ▼
4. All subscribed components re-render
   │
   ├─▶ FileExplorer shows new file ✅
   ├─▶ Editor creates new tab ✅
   └─▶ Sidebar updates count ✅
   │
   ▼
5. State persists to localStorage (if configured)
```

## 🗂️ State Organization

```
AppContext
├── Theme & UI
│   ├── theme: 'dark' | 'light' | 'system'
│   ├── sidebarOpen: boolean
│   └── currentView: 'learn' | 'tutorials' | 'code' | 'community'
│
├── Authentication
│   ├── user: User | null
│   ├── isAuthenticated: boolean
│   ├── login()
│   └── logout()
│
├── Wallet (Solana)
│   ├── publicKey: PublicKey | null
│   ├── connected: boolean
│   ├── connecting: boolean
│   └── setWalletState()
│
├── File System
│   ├── files: FileNode[]
│   ├── activeFile: string
│   └── setFiles(), setActiveFile()
│
├── Editor
│   ├── tabs: EditorTab[]
│   └── setTabs()
│
├── AI Assistant
│   ├── aiMessages: AIMessage[]
│   ├── aiLoading: boolean
│   ├── addAIMessage()
│   └── clearAIMessages()
│
├── Terminal
│   ├── terminalOutputs: TerminalOutput[]
│   ├── terminalOpen: boolean
│   ├── addTerminalOutput()
│   └── clearTerminal()
│
├── Debugger
│   ├── debugState: DebugState
│   ├── setDebugState()
│   └── resetDebugger()
│
├── Notifications
│   ├── toasts: Toast[]
│   ├── showToast()
│   └── removeToast()
│
├── Deployment
│   ├── deployments: Deployment[]
│   └── addDeployment()
│
├── Learning
│   ├── learningProgress: LearningProgress
│   └── updateLearningProgress()
│
└── Loading States
    ├── isLoading: boolean
    ├── compilationLoading: boolean
    └── deploymentLoading: boolean
```

## 💾 Data Persistence Flow

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Update State │
│ in Context   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ useEffect    │
│ Hook         │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ localStorage │◀────│ Save Change  │
│   (Persist)  │     └──────────────┘
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Page Reload  │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ Load from    │◀────│ localStorage │
│ localStorage │     └──────────────┘
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Restore      │
│ State        │
└──────────────┘
```

## 🎨 Toast Notification Flow

```
Component calls showToast()
│
▼
┌──────────────────┐
│ AppContext       │
│ creates Toast    │
│ with unique ID   │
└────────┬─────────┘
         │
         ├─────────────────────────┐
         │                         │
         ▼                         ▼
    ┌─────────┐         ┌──────────────────┐
    │ Display │         │ Auto-remove      │
    │ Toast   │         │ after duration   │
    └────┬────┘         │ (default 3000ms) │
         │              └────────┬──────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │ Remove from      │
         │              │ toasts array     │
         │              └──────────────────┘
         │
         ▼
    ┌─────────┐
    │ User    │
    │ Sees    │
    │ Toast   │
    └─────────┘
```

## 🔍 Debugging with Context

### State Inspection

```
Browser DevTools
│
├── Components Tab
│   └── AppProvider
│       └── value: { theme, user, files, ... }
│
├── Console
│   └── Add console.log in component
│       console.log(useApp())
│
└── React DevTools
    └── Right-click AppProvider
        └── Inspect value
```

### Common Debugging Steps

1. ✅ Check if component is wrapped in AppProvider
2. ✅ Verify useApp() hook is called correctly
3. ✅ Check localStorage for persisted values
4. ✅ Inspect React DevTools for state updates
5. ✅ Look for console errors

## 📈 Performance Optimization

```
┌─────────────────────────────────────────────────────┐
│ Before Optimization                                 │
│                                                     │
│ Component → fetches data → updates state → re-render│
│    ↓                                                 │
│ Full re-render of entire tree                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ After Optimization                                  │
│                                                     │
│ Component → updates only changed parts → re-render │
│    ↓                                                 │
│ Selective re-render (only affected components)      │
└─────────────────────────────────────────────────────┘
```

### Optimization Techniques

- ✅ useCallback for functions
- ✅ useMemo for expensive computations
- ✅ Functional updates for arrays/objects
- ✅ Minimal context value changes
- ✅ Component memoization

## 🎓 Learning Path

```
Start Here
    │
    ▼
┌────────────────────┐
│ Quick Start Guide  │ ← Learn basic usage
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Try Examples       │ ← Practice with code
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Full Documentation │ ← Deep dive into API
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Use in Components  │ ← Implement in your code
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Master Context     │ ← Become proficient
└────────────────────┘
```

## 🚦 State Management Patterns

### Pattern 1: Simple Read
```tsx
const { theme } = useApp();
// Read-only access
```

### Pattern 2: Read & Write
```tsx
const { user, logout } = useApp();
// Action triggers
```

### Pattern 3: Complex State Update
```tsx
const { files, setFiles } = useApp();
setFiles(prev => [...prev, newFile]);
// Functional update
```

### Pattern 4: Conditional Logic
```tsx
const { isAuthenticated, user } = useApp();
if (!isAuthenticated) return <Login />;
return <Dashboard user={user} />;
```

## 📱 Component Examples

### Simple Component
```tsx
// Display user info
const { user } = useApp();
return <p>Hello, {user?.username}</p>;
```

### Interactive Component
```tsx
// Theme switcher
const { theme, setTheme } = useApp();
return (
  <button onClick={() => setTheme('dark')}>
    Dark Mode
  </button>
);
```

### Complex Component
```tsx
// Code editor with AI
const { tabs, setTabs, aiMessages, showToast } = useApp();

const handleSave = () => {
  // Update tab
  setTabs(prev => prev.map(t => t.isActive 
    ? { ...t, content: newContent, isDirty: false }
    : t
  ));
  
  // Show feedback
  showToast({ type: 'success', message: 'Saved!' });
};
```

---

**Remember**: The context is your application's single source of truth! 🎯


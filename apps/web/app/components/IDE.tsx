'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@repo/ui/button';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import AIPanel from './AIPanel';
import TerminalPanel from './TerminalPanel';
import { 
  Play, 
  Save, 
  Rocket,
  Settings,
  Terminal as TerminalIcon,
  Bot,
  FileText,
  Folder,
  X,
  Plus
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { fadeInUp, slideInLeft, slideInRight, staggerContainer, staggerItem } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  isOpen?: boolean;
}

interface EditorTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
  isActive: boolean;
}

interface IDEProps {}

export default function IDE({}: IDEProps) {
  const { theme } = useTheme();
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
    },
    {
      id: 'Cargo.toml',
      name: 'Cargo.toml',
      type: 'file',
      content: `[package]
name = "hello-world"
version = "0.1.0"
description = "Created with Anchor"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "hello_world"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.29.0"
anchor-spl = "0.29.0"`
    }
  ]);

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

  const [activeFile, setActiveFile] = useState('lib.rs');
  const [selectedCode, setSelectedCode] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // File management functions
  const handleFileSelect = (fileId: string) => {
    setActiveFile(fileId);
    const file = files.find(f => f.id === fileId);
    if (file && file.content) {
      // Check if tab already exists
      const existingTab = tabs.find(tab => tab.id === fileId);
      if (!existingTab) {
        const newTab: EditorTab = {
          id: fileId,
          name: file.name,
          content: file.content,
          language: file.name.endsWith('.rs') ? 'rust' : 'toml',
          isDirty: false,
          isActive: true
        };
        setTabs(prev => [...prev.map(tab => ({ ...tab, isActive: false })), newTab]);
      } else {
        setTabs(prev => prev.map(tab => ({ ...tab, isActive: tab.id === fileId })));
      }
    }
  };

  const handleFileCreate = (parentId: string, name: string, type: 'file' | 'folder') => {
    const newFile: FileNode = {
      id: `${name}-${Date.now()}`,
      name,
      type,
      content: type === 'file' ? '// New file\n' : undefined,
      isOpen: type === 'folder' ? false : undefined
    };
    setFiles(prev => [...prev, newFile]);
  };

  const handleFileDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setTabs(prev => prev.filter(tab => tab.id !== fileId));
  };

  const handleFileRename = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName } : f));
    setTabs(prev => prev.map(tab => tab.id === fileId ? { ...tab, name: newName } : tab));
  };

  const handleFileContentChange = (fileId: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, content } : f));
    setTabs(prev => prev.map(tab => 
      tab.id === fileId 
        ? { ...tab, content, isDirty: true }
        : tab
    ));
  };

  // Tab management functions
  const handleTabChange = (tabId: string) => {
    setTabs(prev => prev.map(tab => ({ ...tab, isActive: tab.id === tabId })));
    setActiveFile(tabId);
  };

  const handleTabClose = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (newTabs.length > 0) {
        const lastTab = newTabs[newTabs.length - 1];
        newTabs[newTabs.length - 1] = { ...lastTab, isActive: true };
        setActiveFile(lastTab.id);
      }
      return newTabs;
    });
  };

  const handleSave = (tabId: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, isDirty: false } : tab
    ));
    // Here you would save to backend
    console.log('Saving file:', tabId);
  };

  const handleCompile = async () => {
    setIsLoading(true);
    try {
      const activeTab = tabs.find(tab => tab.isActive);
      if (!activeTab) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programCode: activeTab.content,
          programName: 'program',
        }),
      });

      const data = await response.json();
      console.log('Compilation result:', data);
    } catch (error) {
      console.error('Compilation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    setIsLoading(true);
    try {
      const activeTab = tabs.find(tab => tab.isActive);
      if (!activeTab) return;

      // First compile
      const compileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programCode: activeTab.content,
          programName: 'program',
        }),
      });

      const compileData = await compileResponse.json();
      
      if (!compileData.success) {
        console.error('Compilation failed:', compileData.error);
        return;
      }

      // Then deploy
      const programArtifact = compileData.artifacts?.find((a: any) => a.type === 'program');
      if (!programArtifact) {
        console.error('No program artifact found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programBuffer: programArtifact.content,
          programName: 'program',
        }),
      });

      const data = await response.json();
      console.log('Deployment result:', data);
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminalCommand = async (command: string) => {
    console.log('Terminal command:', command);
    // Handle terminal commands here
  };

  const handleSimplifyError = async (errorId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/error-simplification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorMessage: errorId, // This would be the actual error message
        }),
      });

      const data = await response.json();
      console.log('Error simplification result:', data);
    } catch (error) {
      console.error('Error simplification failed:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Editor Tabs */}
      <div className="h-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 text-sm rounded-t-md cursor-pointer transition-colors",
                tab.isActive
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-b-2 border-blue-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
              )}
              onClick={() => handleTabChange(tab.id)}
            >
              <FileText className="w-4 h-4" />
              <span>{tab.name}</span>
              {tab.isDirty && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
              <button
                className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabClose(tab.id);
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <CodeEditor
            tabs={tabs}
            activeTabId={activeFile}
            onTabChange={handleTabChange}
            onTabClose={handleTabClose}
            onContentChange={handleFileContentChange}
            onSave={handleSave}
            onCompile={handleCompile}
            onDeploy={handleDeploy}
            theme={theme === 'system' ? 'dark' : theme}
          />
        </div>

        {/* Right Panel - AI Assistant */}
        <div className="w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700">
          <AIPanel
            selectedCode={selectedCode}
            onApplyCode={(code) => {
              const activeTab = tabs.find(tab => tab.isActive);
              if (activeTab) {
                handleFileContentChange(activeTab.id, code);
              }
            }}
            onExplainCode={(code) => {
              setSelectedCode(code);
              // This would trigger AI explanation
            }}
            onOptimizeCode={(code) => {
              setSelectedCode(code);
              // This would trigger AI optimization
            }}
            onGenerateTests={(code) => {
              setSelectedCode(code);
              // This would trigger AI test generation
            }}
            onSecurityReview={(code) => {
              setSelectedCode(code);
              // This would trigger AI security review
            }}
          />
        </div>
      </div>

      {/* Bottom Panel - Terminal */}
      <div>
        <TerminalPanel
          isOpen={showTerminal}
          onToggle={() => setShowTerminal(!showTerminal)}
          onCommand={handleTerminalCommand}
          onSimplifyError={handleSimplifyError}
        />
      </div>
    </div>
  );
}
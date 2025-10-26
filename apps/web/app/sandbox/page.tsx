'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  AlertTriangle, 
  Save, 
  Play, 
  Rocket, 
  UserPlus,
  X,
  FileText,
  Folder,
  Plus,
  Settings
} from 'lucide-react';
import IDE from '../components/IDE';

interface SandboxFile {
  id: string;
  name: string;
  content: string;
  type: 'rust' | 'toml' | 'json';
}

const defaultFiles: SandboxFile[] = [
  {
    id: 'lib.rs',
    name: 'lib.rs',
    content: `use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        msg!("Counter initialized!");
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        msg!("Counter incremented to: {}", counter.count);
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
}`,
    type: 'rust'
  },
  {
    id: 'Cargo.toml',
    name: 'Cargo.toml',
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
anchor-spl = "0.29.0"`,
    type: 'toml'
  },
  {
    id: 'Anchor.toml',
    name: 'Anchor.toml',
    content: `[features]
seeds = false
skip-lint = false

[programs.devnet]
hello_world = "11111111111111111111111111111111"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"`,
    type: 'toml'
  }
];

export default function SandboxPage() {
  const [showWarning, setShowWarning] = useState(true);
  const [files, setFiles] = useState<SandboxFile[]>(defaultFiles);
  const [activeFile, setActiveFile] = useState('lib.rs');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Load files from session storage on mount
    const savedFiles = sessionStorage.getItem('sandbox-files');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        setFiles(parsedFiles);
      } catch (error) {
        console.error('Failed to load saved files:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save files to session storage whenever they change
    sessionStorage.setItem('sandbox-files', JSON.stringify(files));
  }, [files]);

  const handleFileChange = (fileId: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, content } : file
    ));
    setHasUnsavedChanges(true);
  };

  const handleSaveWork = () => {
    // This would redirect to signup
    window.location.href = '/auth/signup';
  };

  const handleNewFile = () => {
    const newFile: SandboxFile = {
      id: `file-${Date.now()}`,
      name: 'new_file.rs',
      content: '// New file\n',
      type: 'rust'
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFile(newFile.id);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'rust':
        return '🦀';
      case 'toml':
        return '⚙️';
      case 'json':
        return '📄';
      default:
        return '📄';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Warning Banner */}
      {showWarning && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-yellow-300 font-medium">Sandbox Mode</p>
                <p className="text-yellow-200 text-sm">
                  Your work is temporary and will be lost when you close this tab. 
                  <button 
                    onClick={handleSaveWork}
                    className="underline hover:text-yellow-100 ml-1"
                  >
                    Sign up to save your work
                  </button>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWarning(false)}
              className="text-yellow-300 hover:text-yellow-100 hover:bg-yellow-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🧪</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Solana Sandbox</h1>
              <p className="text-xs text-gray-400">Experiment without limits</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Unsaved changes</span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSaveWork}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Save Work
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar */}
        <div className="w-64 bg-gray-900/50 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Project Files</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewFile}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-1">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setActiveFile(file.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeFile === file.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{getFileIcon(file.type)}</span>
                  <span className="text-sm font-medium">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Play className="h-4 w-4 mr-2" />
                Compile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Deploy to Devnet
              </Button>
            </div>
          </div>

          {/* Templates */}
          <div className="p-4 flex-1">
            <h3 className="text-sm font-semibold text-white mb-3">Templates</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                Counter Program
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                NFT Marketplace
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                DeFi Protocol
              </button>
            </div>
          </div>
        </div>

        {/* IDE Area */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <div className="bg-gray-900 border-b border-gray-800 flex items-center overflow-x-auto">
            {files.map((file) => (
              <button
                key={file.id}
                onClick={() => setActiveFile(file.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-r border-gray-800 whitespace-nowrap transition-colors ${
                  activeFile === file.id
                    ? 'bg-black text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-sm">{getFileIcon(file.type)}</span>
                <span className="text-sm font-medium">{file.name}</span>
                {hasUnsavedChanges && activeFile === file.id && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* IDE Component */}
          <div className="flex-1">
            <IDE />
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-6 py-2 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Sandbox Mode</span>
          <span>•</span>
          <span>Devnet Only</span>
          <span>•</span>
          <span>Session Storage</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span>•</span>
          <span>Rust</span>
        </div>
      </div>
    </div>
  );
}

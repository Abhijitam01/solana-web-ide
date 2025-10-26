'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Search, 
  BookOpen, 
  Code, 
  Play, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  children?: DocSection[];
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    children: [
      { id: 'installation', title: 'Installation' },
      { id: 'first-program', title: 'Your First Program' },
      { id: 'deployment', title: 'Deployment' }
    ]
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    children: [
      { id: 'accounts', title: 'Accounts' },
      { id: 'programs', title: 'Programs' },
      { id: 'transactions', title: 'Transactions' },
      { id: 'pdas', title: 'Program Derived Addresses' }
    ]
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    children: [
      { id: 'counter-tutorial', title: 'Counter Program' },
      { id: 'nft-tutorial', title: 'NFT Marketplace' },
      { id: 'defi-tutorial', title: 'DeFi Protocol' }
    ]
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    children: [
      { id: 'anchor-api', title: 'Anchor Framework' },
      { id: 'solana-api', title: 'Solana Web3.js' },
      { id: 'ai-api', title: 'AI Assistant API' }
    ]
  },
  {
    id: 'examples',
    title: 'Examples & Templates',
    children: [
      { id: 'basic-programs', title: 'Basic Programs' },
      { id: 'advanced-patterns', title: 'Advanced Patterns' },
      { id: 'real-world-apps', title: 'Real World Applications' }
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    children: [
      { id: 'security', title: 'Security Guidelines' },
      { id: 'performance', title: 'Performance Optimization' },
      { id: 'testing', title: 'Testing Strategies' }
    ]
  }
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('getting-started');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleTryInIDE = (code: string) => {
    // This would open the IDE with the code
    console.log('Opening IDE with code:', code);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // Could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📚</span>
            </div>
            <span className="text-xl font-bold text-white">
              Documentation
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Try in IDE
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-900/50 border-r border-gray-800 overflow-hidden`}>
          <div className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {docSections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section.title}</span>
                      {section.children && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                  
                  {section.children && selectedSection === section.id && (
                    <div className="ml-4 mt-2 space-y-1">
                      {section.children.map((child) => (
                        <button
                          key={child.id}
                          className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          {child.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile sidebar toggle */}
          <div className="lg:hidden p-4 border-b border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="border-gray-700 text-gray-300"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              {sidebarOpen ? 'Close' : 'Menu'}
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-8">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
                <span>Documentation</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white">Getting Started</span>
              </nav>

              {/* Page Content */}
              <div className="prose prose-invert max-w-none">
                <h1 className="text-4xl font-bold text-white mb-6">
                  Getting Started with Solana AI IDE
                </h1>
                
                <p className="text-xl text-gray-300 mb-8">
                  Welcome to the Solana AI IDE! This guide will help you get up and running with 
                  building Solana programs using our AI-powered development environment.
                </p>

                {/* Installation Section */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-4">Installation</h2>
                  <p className="text-gray-300 mb-4">
                    The Solana AI IDE runs entirely in your browser - no installation required! 
                    Simply create an account and start building.
                  </p>
                  
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Quick Start</h3>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyCode('npm install @solana/web3.js')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleTryInIDE('// Your first Solana program\nuse anchor_lang::prelude::*;')}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Try in IDE
                        </Button>
                      </div>
                    </div>
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{`// 1. Create a new account at solana-ai-ide.com
// 2. Choose a template or start from scratch
// 3. Start coding with AI assistance
// 4. Deploy with one click

use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Hello, Solana!");
        Ok(())
    }
}`}</code>
                    </pre>
                  </div>
                </section>

                {/* Your First Program Section */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-4">Your First Program</h2>
                  <p className="text-gray-300 mb-4">
                    Let's create a simple counter program that demonstrates the basic concepts 
                    of Solana development.
                  </p>

                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Counter Program</h3>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyCode('// Counter program code')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleTryInIDE('// Counter program')}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Try in IDE
                        </Button>
                      </div>
                    </div>
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{`use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod counter {
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
}`}</code>
                    </pre>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-300 font-semibold mb-2">💡 AI Tip</h4>
                    <p className="text-blue-200 text-sm">
                      Use our AI assistant to explain any part of this code. Just select the code 
                      and ask "Explain this" in the AI panel!
                    </p>
                  </div>
                </section>

                {/* Next Steps */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-4">Next Steps</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-900 border-gray-700 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Code className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Core Concepts</h3>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        Learn about accounts, programs, transactions, and PDAs - the building blocks of Solana.
                      </p>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Learn More
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Card>

                    <Card className="bg-gray-900 border-gray-700 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Play className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Try the IDE</h3>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        Open the IDE and start building with AI assistance, templates, and real-time feedback.
                      </p>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Open IDE
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Card>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

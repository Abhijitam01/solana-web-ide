'use client';

import { useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { Code } from '@repo/ui/code';
import Terminal from './Terminal';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Wand2, 
  Bug, 
  Rocket,
  FileText,
  Settings,
  Shield,
  Lightbulb,
  BookOpen,
  Zap,
  Terminal as TerminalIcon,
  Bot
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface IDEProps {}

export default function IDE({}: IDEProps) {
  const { theme } = useTheme();
  const [code, setCode] = useState(`use anchor_lang::prelude::*;

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
}`);

  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [showTerminal, setShowTerminal] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleAIAssist = async (type: 'generate' | 'explain' | 'optimize' | 'test' | 'security' | 'improve' | 'document') => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: code,
          type,
        }),
      });

      const data = await response.json();
      setAiResponse(data.content);
      setActiveTab('ai');
    } catch (error) {
      console.error('AI request failed:', error);
      setAiResponse('Error: Failed to get AI assistance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programCode: code,
          programName: 'program',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAiResponse(`✅ Compilation successful!\n\nOutput: ${data.output}\n\nArtifacts generated: ${data.artifacts?.length || 0} files`);
      } else {
        setAiResponse(`❌ Compilation failed!\n\nErrors: ${data.errors || data.error}\n\nOutput: ${data.output}`);
      }
      setActiveTab('ai');
    } catch (error) {
      console.error('Compilation failed:', error);
      setAiResponse('Error: Compilation failed - Could not connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    setIsLoading(true);
    try {
      // First compile the program to get artifacts
      const compileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programCode: code,
          programName: 'program',
        }),
      });

      const compileData = await compileResponse.json();
      
      if (!compileData.success) {
        setAiResponse(`❌ Cannot deploy - compilation failed!\n\nErrors: ${compileData.errors || compileData.error}`);
        setActiveTab('ai');
        setIsLoading(false);
        return;
      }

      // Get the program artifact
      const programArtifact = compileData.artifacts?.find((a: any) => a.type === 'program');
      if (!programArtifact) {
        setAiResponse('❌ Cannot deploy - no program artifact found');
        setActiveTab('ai');
        setIsLoading(false);
        return;
      }

      // Deploy the program
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
      
      if (data.success) {
        setAiResponse(`🚀 Deployment successful!\n\nProgram ID: ${data.programId}\nTransaction: ${data.signature}\nExplorer: ${data.explorerUrl}`);
      } else {
        setAiResponse(`❌ Deployment failed!\n\nError: ${data.error}`);
      }
      setActiveTab('ai');
    } catch (error) {
      console.error('Deployment failed:', error);
      setAiResponse('Error: Deployment failed - Could not connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminalCommand = async (command: string) => {
    // Handle terminal commands here
    console.log('Terminal command:', command);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center space-x-3 flex-wrap">
          <Button
            onClick={() => handleAIAssist('generate')}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Generate
          </Button>
          <Button
            onClick={() => handleAIAssist('explain')}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
          >
            <FileText className="w-4 h-4 mr-2" />
            Explain
          </Button>
          <Button
            onClick={() => handleAIAssist('optimize')}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
          >
            <Settings className="w-4 h-4 mr-2" />
            Optimize
          </Button>
          <Button
            onClick={() => handleAIAssist('security')}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </Button>
          <Button
            onClick={() => handleAIAssist('improve')}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Improve
          </Button>
          <Button
            onClick={() => handleAIAssist('test')}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
          >
            <Bug className="w-4 h-4 mr-2" />
            Tests
          </Button>
          <Button
            onClick={() => handleAIAssist('document')}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Docs
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowTerminal(!showTerminal)}
            variant="outline"
            size="sm"
            className={`border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 ${
              showTerminal ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border-blue-500/30' : ''
            }`}
          >
            <TerminalIcon className="w-4 h-4 mr-2" />
            Terminal
          </Button>
          <Button
            onClick={handleCompile}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
          >
            <Play className="w-4 h-4 mr-2" />
            Compile
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={isLoading}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex border-b border-white/10 bg-black/10">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                activeTab === 'editor'
                  ? 'border-b-2 border-purple-500 text-purple-400 bg-white/5'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                activeTab === 'ai'
                  ? 'border-b-2 border-purple-500 text-purple-400 bg-white/5'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              AI Assistant
            </button>
            {showTerminal && (
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'terminal'
                    ? 'border-b-2 border-purple-500 text-purple-400 bg-white/5'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Terminal
              </button>
            )}
          </div>
          
          <div className="flex-1">
            {activeTab === 'editor' ? (
              <Editor
                height="100%"
                defaultLanguage="rust"
                value={code}
                onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            ) : activeTab === 'terminal' ? (
              <Terminal 
                onCommand={handleTerminalCommand}
                className="h-full"
              />
            ) : (
              <div className="h-full p-6">
                <div className="h-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                        <p className="text-sm text-white/60">Get intelligent help with your code</p>
                      </div>
                    </div>
                    {isLoading && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                        <span className="text-sm text-white/60">Thinking...</span>
                      </div>
                    )}
                  </div>
                  <div className="h-full overflow-auto">
                    {aiResponse ? (
                      <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                        <pre className="text-sm text-white/90 font-mono whitespace-pre-wrap leading-relaxed">
                          {aiResponse}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Bot className="h-8 w-8 text-purple-400" />
                        </div>
                        <p className="text-white/70 text-lg mb-2">Ready to help!</p>
                        <p className="text-white/50 text-sm">
                          Click one of the AI buttons above to get assistance with your code.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
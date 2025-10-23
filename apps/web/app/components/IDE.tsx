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
  Terminal as TerminalIcon
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
      setAiResponse(data.success ? 'Compilation successful!' : data.error);
      setActiveTab('ai');
    } catch (error) {
      console.error('Compilation failed:', error);
      setAiResponse('Error: Compilation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programIdl: {},
          programName: 'program',
        }),
      });

      const data = await response.json();
      setAiResponse(data.message);
      setActiveTab('ai');
    } catch (error) {
      console.error('Deployment failed:', error);
      setAiResponse('Error: Deployment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminalCommand = async (command: string) => {
    // Handle terminal commands here
    console.log('Terminal command:', command);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2 flex-wrap">
          <Button
            onClick={() => handleAIAssist('generate')}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Generate
          </Button>
          <Button
            onClick={() => handleAIAssist('explain')}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Explain
          </Button>
          <Button
            onClick={() => handleAIAssist('optimize')}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Optimize
          </Button>
          <Button
            onClick={() => handleAIAssist('security')}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </Button>
          <Button
            onClick={() => handleAIAssist('improve')}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Improve
          </Button>
          <Button
            onClick={() => handleAIAssist('test')}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Bug className="w-4 h-4 mr-2" />
            Tests
          </Button>
          <Button
            onClick={() => handleAIAssist('document')}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Docs
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowTerminal(!showTerminal)}
            variant="outline"
            size="sm"
            className={showTerminal ? 'bg-blue-100 text-blue-700' : ''}
          >
            <TerminalIcon className="w-4 h-4 mr-2" />
            Terminal
          </Button>
          <Button
            onClick={handleCompile}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Compile
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={isLoading}
            variant="default"
            size="sm"
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
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'editor'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'ai'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              AI Assistant
            </button>
            {showTerminal && (
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'terminal'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
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
              <div className="h-full p-4">
                <Card className="h-full p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">AI Assistant</h3>
                    {isLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    )}
                  </div>
                  <div className="h-full overflow-auto">
                    {aiResponse ? (
                      <Code className="whitespace-pre-wrap">{aiResponse}</Code>
                    ) : (
                      <p className="text-muted-foreground">
                        Click one of the AI buttons above to get assistance with your code.
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
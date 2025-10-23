'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardContent } from '@repo/ui/card';
import ErrorSimplifier from './ErrorSimplifier';
import { 
  Terminal as TerminalIcon, 
  Play, 
  Square, 
  Trash2, 
  Copy, 
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';

interface TerminalProps {
  className?: string;
  onCommand?: (command: string) => void;
}

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
  timestamp: Date;
}

export default function Terminal({ className = '', onCommand }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showErrorSimplifier, setShowErrorSimplifier] = useState(false);
  const [lastError, setLastError] = useState<string>('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (content: string, type: TerminalLine['type'] = 'output') => {
    const newLine: TerminalLine = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add input line
    addLine(`$ ${command}`, 'input');
    setCurrentInput('');

    // Simulate command execution
    setIsRunning(true);
    
    try {
      if (onCommand) {
        await onCommand(command);
      } else {
        // Simulate different command responses
        await simulateCommand(command);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLine(errorMessage, 'error');
      setLastError(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const simulateCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    // Simulate command execution delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    if (cmd.startsWith('anchor build') || cmd.startsWith('cargo build')) {
      // Simulate compilation
      addLine('Building program...', 'output');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (Math.random() > 0.3) {
        addLine('✅ Build successful!', 'success');
        addLine('Program compiled without errors.', 'output');
      } else {
        // Simulate compilation error
        const errorMessage = `error[E0425]: cannot find value \`counter\` in this scope
  --> programs/my-program/src/lib.rs:15:9
   |
15 |     counter.count += 1;
   |     ^^^^^^^ not found in this scope
   |
help: consider importing this struct:
   |
1  | use anchor_lang::prelude::*;
   |
For more information about this error, try \`rustc --explain E0425\`.`;
        addLine(errorMessage, 'error');
        setLastError(errorMessage);
      }
    } else if (cmd.startsWith('anchor deploy') || cmd.startsWith('solana program deploy')) {
      addLine('Deploying program...', 'output');
      await new Promise(resolve => setTimeout(resolve, 3000));
      addLine('✅ Program deployed successfully!', 'success');
      addLine('Program ID: 11111111111111111111111111111111', 'output');
    } else if (cmd.startsWith('anchor test') || cmd.startsWith('cargo test')) {
      addLine('Running tests...', 'output');
      await new Promise(resolve => setTimeout(resolve, 1500));
      addLine('✅ All tests passed!', 'success');
    } else if (cmd === 'clear') {
      setLines([]);
      return;
    } else if (cmd.startsWith('help')) {
      addLine('Available commands:', 'output');
      addLine('  anchor build    - Build the program', 'output');
      addLine('  anchor deploy   - Deploy the program', 'output');
      addLine('  anchor test     - Run tests', 'output');
      addLine('  clear          - Clear terminal', 'output');
      addLine('  help           - Show this help', 'output');
    } else {
      addLine(`Command not found: ${command}`, 'error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    }
  };

  const clearTerminal = () => {
    setLines([]);
  };

  const copyTerminalContent = () => {
    const content = lines.map(line => line.content).join('\n');
    navigator.clipboard.writeText(content);
  };

  const downloadTerminalLog = () => {
    const content = lines.map(line => `[${line.timestamp.toISOString()}] ${line.type.toUpperCase()}: ${line.content}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-log-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLineIcon = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return '>';
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-gray-200">Terminal</span>
          {isRunning && <Loader className="h-4 w-4 text-blue-400 animate-spin" />}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyTerminalContent}
            className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadTerminalLog}
            className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTerminal}
            className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col">
        {/* Terminal Output */}
        <div 
          ref={terminalRef}
          className="flex-1 bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto"
        >
          {lines.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              <TerminalIcon className="h-8 w-8 mx-auto mb-2" />
              <p>Terminal ready. Type a command to get started.</p>
              <p className="text-xs mt-1">Try: anchor build, anchor deploy, or help</p>
            </div>
          )}
          
          {lines.map((line) => (
            <div key={line.id} className="flex items-start space-x-2 mb-1">
              <span className="flex-shrink-0">
                {getLineIcon(line.type)}
              </span>
              <span className={`${getLineColor(line.type)} break-words`}>
                {line.content}
              </span>
            </div>
          ))}
        </div>

        {/* Error Simplifier */}
        {showErrorSimplifier && lastError && (
          <div className="border-t border-gray-700">
            <ErrorSimplifier
              errorMessage={lastError}
              context="Terminal compilation error"
              onClose={() => setShowErrorSimplifier(false)}
            />
          </div>
        )}

        {/* Input Line */}
        <div className="flex items-center bg-gray-900 border-t border-gray-700 p-2">
          <span className="text-green-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent text-green-400 outline-none font-mono"
            placeholder="Enter command..."
            disabled={isRunning}
          />
          {isRunning && (
            <Loader className="h-4 w-4 text-blue-400 animate-spin ml-2" />
          )}
        </div>
      </div>

      {/* Error Detection and Simplify Button */}
      {lines.some(line => line.type === 'error') && !showErrorSimplifier && (
        <div className="p-3 bg-red-900/20 border-t border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-300">Error detected in terminal output</span>
            </div>
            <Button
              size="sm"
              onClick={() => setShowErrorSimplifier(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Simplify Error
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Terminal as TerminalIcon, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Play, 
  AlertCircle,
  CheckCircle,
  Info,
  Copy,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

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

interface TerminalPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onCommand: (command: string) => void;
  onSimplifyError?: (errorId: string) => void;
}

export default function TerminalPanel({
  isOpen,
  onToggle,
  onCommand,
  onSimplifyError
}: TerminalPanelProps) {
  const [outputs, setOutputs] = useState<TerminalOutput[]>([
    {
      id: '1',
      type: 'info',
      content: 'Solana AI IDE Terminal - Ready for commands',
      timestamp: new Date()
    }
  ]);
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [simplifiedErrors, setSimplifiedErrors] = useState<Record<string, string>>({});
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    // Add command to history
    const newHistory = [...commandHistory, command];
    setCommandHistory(newHistory);
    setHistoryIndex(newHistory.length);

    // Add command to output
    const commandOutput: TerminalOutput = {
      id: Date.now().toString(),
      type: 'command',
      content: command,
      timestamp: new Date()
    };

    setOutputs(prev => [...prev, commandOutput]);

    // Execute command
    onCommand(command);

    // Simulate command execution
    setTimeout(() => {
      const result = simulateCommandExecution(command);
      setOutputs(prev => [...prev, result]);
    }, 500);

    setCommand('');
  };

  const simulateCommandExecution = (cmd: string): TerminalOutput => {
    const lowerCmd = cmd.toLowerCase();
    
    if (lowerCmd.includes('anchor build') || lowerCmd.includes('cargo build')) {
      // Simulate compilation with potential errors
      const hasError = Math.random() > 0.7;
      
      if (hasError) {
        return {
          id: Date.now().toString(),
          type: 'error',
          content: `error[E0425]: cannot find value \`counter\` in this scope
  --> src/lib.rs:15:9
   |
15 |         counter.count += 1;
   |         ^^^^^^^ not found in this scope

For more information about this error, try \`rustc --explain E0425\`.`,
          timestamp: new Date(),
          isError: true,
          errorDetails: {
            file: 'src/lib.rs',
            line: 15,
            column: 9,
            code: 'E0425',
            message: 'cannot find value `counter` in this scope'
          }
        };
      } else {
        return {
          id: Date.now().toString(),
          type: 'success',
          content: `Compiling hello_world v0.1.0 (/workspace)
Finished dev [unoptimized + debuginfo] target(s) in 2.34s`,
          timestamp: new Date()
        };
      }
    } else if (lowerCmd.includes('anchor test')) {
      return {
        id: Date.now().toString(),
        type: 'success',
        content: `Running tests...
test hello_world::tests::test_initialize ... ok
test hello_world::tests::test_increment ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out`,
        timestamp: new Date()
      };
    } else if (lowerCmd.includes('anchor deploy')) {
      return {
        id: Date.now().toString(),
        type: 'success',
        content: `Deploying workspace: /workspace
Upgrade authority: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Deploy program ID: 11111111111111111111111111111111
Program path: /workspace/target/deploy/hello_world.so

Deploy success`,
        timestamp: new Date()
      };
    } else if (lowerCmd.includes('ls') || lowerCmd.includes('dir')) {
      return {
        id: Date.now().toString(),
        type: 'output',
        content: `Cargo.toml
Anchor.toml
src/
  lib.rs
target/
  deploy/
    hello_world.so`,
        timestamp: new Date()
      };
    } else {
      return {
        id: Date.now().toString(),
        type: 'output',
        content: `Command not found: ${cmd}. Available commands: anchor build, anchor test, anchor deploy, ls`,
        timestamp: new Date()
      };
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setCommand(commandHistory[historyIndex - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setCommand(commandHistory[historyIndex + 1]);
      } else {
        setHistoryIndex(commandHistory.length);
        setCommand('');
      }
    }
  };

  const handleSimplifyError = async (errorId: string, errorDetails: any) => {
    if (onSimplifyError) {
      onSimplifyError(errorId);
    }

    // Simulate AI error simplification
    const simplified = `This error means you're trying to use a variable called 'counter' that doesn't exist in the current scope. 

To fix this:
1. Make sure you've declared the counter variable
2. Check if you're in the right function context
3. Verify the variable name spelling

The error is on line 15, column 9 of your lib.rs file.`;

    setSimplifiedErrors(prev => ({ ...prev, [errorId]: simplified }));
  };

  const getOutputIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getOutputColor = (type: string) => {
    switch (type) {
      case 'command':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-300';
    }
  };

  const renderOutput = (output: TerminalOutput) => {
    const isError = output.isError && output.errorDetails;
    const simplified = simplifiedErrors[output.id];

    return (
      <div key={output.id} className="mb-2">
        <div className="flex items-start space-x-2">
          {getOutputIcon(output.type)}
          <div className="flex-1 min-w-0">
            <pre className={`text-sm font-mono whitespace-pre-wrap ${getOutputColor(output.type)}`}>
              {output.content}
            </pre>
            
            {isError && (
              <div className="mt-2">
                {!simplified ? (
                  <Button
                    size="sm"
                    onClick={() => handleSimplifyError(output.id, output.errorDetails)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Simplify This Error
                  </Button>
                ) : (
                  <Card className="bg-blue-500/10 border border-blue-500/20 p-3 mt-2">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-300 mb-1">Simplified Explanation</h4>
                        <p className="text-sm text-blue-200 whitespace-pre-wrap">{simplified}</p>
                        {output.errorDetails?.file && (
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-xs text-blue-300">
                              {output.errorDetails.file}:{output.errorDetails.line}:{output.errorDetails.column}
                            </span>
                            <button className="text-xs text-blue-400 hover:text-blue-300 underline">
                              Jump to line
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="bg-gray-900 border-t border-gray-800">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center space-x-2 py-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <TerminalIcon className="h-4 w-4" />
          <span className="text-sm">Terminal</span>
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border-t border-gray-800 flex flex-col" style={{ height: '300px' }}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-white">Terminal</span>
          <span className="text-xs text-gray-500">Solana AI IDE</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOutputs([])}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm"
        style={{ maxHeight: '200px' }}
      >
        {outputs.map(renderOutput)}
      </div>

      {/* Terminal Input */}
      <div className="border-t border-gray-800 p-4">
        <form onSubmit={handleCommandSubmit} className="flex items-center space-x-2">
          <span className="text-blue-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}

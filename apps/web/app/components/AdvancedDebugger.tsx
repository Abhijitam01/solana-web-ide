'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Bug,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Database,
  Key,
  DollarSign,
  Hash,
  Code,
  Settings,
  Download,
  Upload,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DebugState {
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

export interface CallStackFrame {
  id: string;
  functionName: string;
  file: string;
  line: number;
  variables: Variable[];
}

export interface Variable {
  name: string;
  value: string;
  type: string;
  scope: 'local' | 'global' | 'parameter';
  isMutable: boolean;
  address?: string;
}

export interface AccountState {
  address: string;
  owner: string;
  lamports: number;
  data: string;
  executable: boolean;
  rentEpoch: number;
  isSigner: boolean;
  isWritable: boolean;
  isInitialized: boolean;
  space: number;
  dataSize: number;
}

export interface DebugLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  line?: number;
  data?: any;
}

export interface Breakpoint {
  id: string;
  line: number;
  file: string;
  condition?: string;
  enabled: boolean;
  hitCount: number;
}

interface AdvancedDebuggerProps {
  programId: string;
  transactionId?: string;
  onDebugStart: () => void;
  onDebugStop: () => void;
  onStepOver: () => void;
  onStepInto: () => void;
  onStepOut: () => void;
  onSetBreakpoint: (line: number, file: string) => void;
  onRemoveBreakpoint: (id: string) => void;
}

export default function AdvancedDebugger({
  programId,
  transactionId,
  onDebugStart,
  onDebugStop,
  onStepOver,
  onStepInto,
  onStepOut,
  onSetBreakpoint,
  onRemoveBreakpoint
}: AdvancedDebuggerProps) {
  const [debugState, setDebugState] = useState<DebugState>({
    isRunning: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: 0,
    breakpoints: new Set(),
    callStack: [],
    variables: [],
    accounts: [],
    logs: []
  });
  
  const [activeTab, setActiveTab] = useState<'callstack' | 'variables' | 'accounts' | 'logs' | 'breakpoints'>('callstack');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warning' | 'error' | 'debug'>('all');

  // Mock debug data - in real implementation, this would come from the debugger
  const mockCallStack: CallStackFrame[] = [
    {
      id: 'frame-1',
      functionName: 'process_instruction',
      file: 'program.rs',
      line: 15,
      variables: [
        { name: 'program_id', value: '11111111111111111111111111111111', type: '&Pubkey', scope: 'parameter', isMutable: false },
        { name: 'accounts', value: '[AccountInfo; 3]', type: '&[AccountInfo]', scope: 'parameter', isMutable: false },
        { name: 'instruction_data', value: '[0, 1, 2, 3]', type: '&[u8]', scope: 'parameter', isMutable: false }
      ]
    },
    {
      id: 'frame-2',
      functionName: 'initialize_account',
      file: 'instructions.rs',
      line: 42,
      variables: [
        { name: 'account', value: 'AccountInfo', type: '&AccountInfo', scope: 'local', isMutable: true },
        { name: 'authority', value: 'AccountInfo', type: '&AccountInfo', scope: 'local', isMutable: false },
        { name: 'data', value: 'Vec<u8>', type: 'Vec<u8>', scope: 'local', isMutable: true }
      ]
    }
  ];

  const mockVariables: Variable[] = [
    { name: 'program_id', value: '11111111111111111111111111111111', type: '&Pubkey', scope: 'parameter', isMutable: false },
    { name: 'accounts', value: '[AccountInfo; 3]', type: '&[AccountInfo]', scope: 'parameter', isMutable: false },
    { name: 'instruction_data', value: '[0, 1, 2, 3]', type: '&[u8]', scope: 'parameter', isMutable: false },
    { name: 'account', value: 'AccountInfo', type: '&AccountInfo', scope: 'local', isMutable: true },
    { name: 'authority', value: 'AccountInfo', type: '&AccountInfo', scope: 'local', isMutable: false },
    { name: 'data', value: 'Vec<u8>', type: 'Vec<u8>', scope: 'local', isMutable: true },
    { name: 'lamports', value: '1000000', type: 'u64', scope: 'local', isMutable: true },
    { name: 'owner', value: '11111111111111111111111111111111', type: 'Pubkey', scope: 'local', isMutable: false }
  ];

  const mockAccounts: AccountState[] = [
    {
      address: '11111111111111111111111111111111',
      owner: '11111111111111111111111111111111',
      lamports: 1000000,
      data: '0x0102030405060708',
      executable: false,
      rentEpoch: 123456,
      isSigner: true,
      isWritable: true,
      isInitialized: true,
      space: 8,
      dataSize: 8
    },
    {
      address: '22222222222222222222222222222222',
      owner: '11111111111111111111111111111111',
      lamports: 500000,
      data: '0x090a0b0c0d0e0f10',
      executable: false,
      rentEpoch: 123456,
      isSigner: false,
      isWritable: true,
      isInitialized: true,
      space: 16,
      dataSize: 16
    }
  ];

  const mockLogs: DebugLog[] = [
    {
      id: 'log-1',
      timestamp: new Date(),
      level: 'info',
      message: 'Program execution started',
      source: 'program.rs:15',
      line: 15
    },
    {
      id: 'log-2',
      timestamp: new Date(),
      level: 'debug',
      message: 'Processing instruction data: [0, 1, 2, 3]',
      source: 'program.rs:18',
      line: 18
    },
    {
      id: 'log-3',
      timestamp: new Date(),
      level: 'warning',
      message: 'Account validation: checking ownership',
      source: 'instructions.rs:25',
      line: 25
    },
    {
      id: 'log-4',
      timestamp: new Date(),
      level: 'error',
      message: 'Account validation failed: incorrect owner',
      source: 'instructions.rs:30',
      line: 30
    }
  ];

  const mockBreakpoints: Breakpoint[] = [
    {
      id: 'bp-1',
      line: 15,
      file: 'program.rs',
      enabled: true,
      hitCount: 3
    },
    {
      id: 'bp-2',
      line: 42,
      file: 'instructions.rs',
      condition: 'account.lamports > 1000000',
      enabled: true,
      hitCount: 1
    },
    {
      id: 'bp-3',
      line: 67,
      file: 'instructions.rs',
      enabled: false,
      hitCount: 0
    }
  ];

  useEffect(() => {
    // Initialize debug state with mock data
    setDebugState(prev => ({
      ...prev,
      callStack: mockCallStack,
      variables: mockVariables,
      accounts: mockAccounts,
      logs: mockLogs
    }));
  }, []);

  const handleDebugStart = () => {
    setDebugState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      currentStep: 0
    }));
    onDebugStart();
  };

  const handleDebugStop = () => {
    setDebugState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentStep: 0
    }));
    onDebugStop();
  };

  const handleStepOver = () => {
    setDebugState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1
    }));
    onStepOver();
  };

  const handleStepInto = () => {
    setDebugState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1
    }));
    onStepInto();
  };

  const handleStepOut = () => {
    setDebugState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1
    }));
    onStepOut();
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'info': return <Info className="h-4 w-4 text-blue-400" />;
      case 'debug': return <Bug className="h-4 w-4 text-gray-400" />;
      default: return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      case 'debug': return 'border-gray-500 bg-gray-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'parameter': return 'text-blue-400 bg-blue-400/20';
      case 'local': return 'text-green-400 bg-green-400/20';
      case 'global': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterLevel === 'all' || log.level === filterLevel;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Bug className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Advanced Debugger</h3>
              <p className="text-sm text-gray-400">Step-through debugging for Solana programs</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-400">
              Program: {programId.slice(0, 8)}...
            </div>
            {transactionId && (
              <div className="text-sm text-gray-400">
                TX: {transactionId.slice(0, 8)}...
              </div>
            )}
          </div>
        </div>

        {/* Debug Controls */}
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={handleDebugStart}
            disabled={debugState.isRunning}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Start
          </Button>
          <Button
            size="sm"
            onClick={handleDebugStop}
            disabled={!debugState.isRunning}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
          <Button
            size="sm"
            onClick={handleStepOver}
            disabled={!debugState.isRunning || !debugState.isPaused}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Step Over
          </Button>
          <Button
            size="sm"
            onClick={handleStepInto}
            disabled={!debugState.isRunning || !debugState.isPaused}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <SkipBack className="h-4 w-4 mr-2" />
            Step Into
          </Button>
          <Button
            size="sm"
            onClick={handleStepOut}
            disabled={!debugState.isRunning || !debugState.isPaused}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Step Out
          </Button>
          <Button
            size="sm"
            onClick={() => setDebugState(prev => ({ ...prev, currentStep: 0 }))}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Debug Status */}
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              debugState.isRunning ? "bg-green-400" : "bg-gray-400"
            )} />
            <span className="text-gray-300">
              {debugState.isRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
          <div className="text-gray-400">
            Step {debugState.currentStep} of {debugState.totalSteps}
          </div>
          <div className="text-gray-400">
            {debugState.breakpoints.size} breakpoints
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {[
          { id: 'callstack', label: 'Call Stack', icon: Code },
          { id: 'variables', label: 'Variables', icon: Database },
          { id: 'accounts', label: 'Accounts', icon: Key },
          { id: 'logs', label: 'Logs', icon: Bug },
          { id: 'breakpoints', label: 'Breakpoints', icon: Settings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200',
              activeTab === tab.id
                ? 'bg-black text-white border-b-2 border-red-600'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'callstack' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white mb-4">Call Stack</h4>
            {mockCallStack.map((frame, index) => (
              <Card key={frame.id} className={cn(
                "border transition-all duration-200",
                index === 0 ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-gray-800"
              )}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-white">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-white">{frame.functionName}</h5>
                        <p className="text-xs text-gray-400">{frame.file}:{frame.line}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection(frame.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {expandedSections.has(frame.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {expandedSections.has(frame.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h6 className="text-xs font-medium text-white mb-2">Variables:</h6>
                      <div className="space-y-2">
                        {frame.variables.map((variable) => (
                          <div key={variable.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <span className={cn(
                                "px-2 py-1 rounded text-xs",
                                getScopeColor(variable.scope)
                              )}>
                                {variable.scope}
                              </span>
                              <span className="text-gray-300">{variable.name}</span>
                            </div>
                            <div className="text-gray-400">
                              <span className="text-blue-400">{variable.type}</span>
                              <span className="ml-2">{variable.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'variables' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white mb-4">Variables</h4>
            <div className="space-y-2">
              {mockVariables.map((variable) => (
                <div key={variable.name} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      getScopeColor(variable.scope)
                    )}>
                      {variable.scope}
                    </span>
                    <span className="text-sm text-white">{variable.name}</span>
                    {variable.isMutable && (
                      <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded">
                        mut
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-blue-400">{variable.type}</span>
                    <span className="ml-2">{variable.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white mb-4">Account States</h4>
            {mockAccounts.map((account) => (
              <Card key={account.address} className="border-gray-700 bg-gray-800">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-blue-400" />
                      <div>
                        <h5 className="text-sm font-medium text-white">
                          {account.address.slice(0, 8)}...{account.address.slice(-8)}
                        </h5>
                        <p className="text-xs text-gray-400">Owner: {account.owner.slice(0, 8)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {account.isSigner && (
                        <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded">
                          Signer
                        </span>
                      )}
                      {account.isWritable && (
                        <span className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded">
                          Writable
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-gray-400 mb-1">Lamports:</div>
                      <div className="text-white">{account.lamports.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Space:</div>
                      <div className="text-white">{account.space} bytes</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Rent Epoch:</div>
                      <div className="text-white">{account.rentEpoch}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Executable:</div>
                      <div className="text-white">{account.executable ? 'Yes' : 'No'}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-gray-400 mb-1 text-xs">Data:</div>
                    <div className="bg-gray-900 p-2 rounded text-xs font-mono text-gray-300">
                      {account.data}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-white">Debug Logs</h4>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="w-48 pl-8 pr-4 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                </div>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value as any)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="all">All Levels</option>
                  <option value="error">Errors</option>
                  <option value="warning">Warnings</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div key={log.id} className={cn(
                  "p-3 rounded border transition-all duration-200",
                  getLogColor(log.level)
                )}>
                  <div className="flex items-start space-x-3">
                    {getLogIcon(log.level)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-white">{log.message}</span>
                        <span className="text-xs text-gray-400">{log.source}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {log.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'breakpoints' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-white">Breakpoints</h4>
              <Button
                size="sm"
                onClick={() => onSetBreakpoint(1, 'program.rs')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Breakpoint
              </Button>
            </div>

            <div className="space-y-2">
              {mockBreakpoints.map((breakpoint) => (
                <div key={breakpoint.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      breakpoint.enabled ? "bg-red-400" : "bg-gray-400"
                    )} />
                    <div>
                      <div className="text-sm text-white">
                        {breakpoint.file}:{breakpoint.line}
                      </div>
                      {breakpoint.condition && (
                        <div className="text-xs text-gray-400">
                          Condition: {breakpoint.condition}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      Hit {breakpoint.hitCount} times
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveBreakpoint(breakpoint.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

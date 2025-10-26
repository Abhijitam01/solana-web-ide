'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Play, 
  Save,
  Code,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Zap,
  Shield,
  Target,
  BookOpen,
  FileText,
  Database,
  Users,
  Lock,
  Unlock
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface VisualNode {
  id: string;
  type: 'instruction' | 'account' | 'validation' | 'error-handling' | 'cpi' | 'pda';
  title: string;
  description: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  inputs: NodePort[];
  outputs: NodePort[];
  properties: Record<string, any>;
  code?: string;
  isSelected: boolean;
  isLocked: boolean;
}

export interface NodePort {
  id: string;
  name: string;
  type: 'data' | 'control' | 'account';
  dataType?: string;
  required: boolean;
}

export interface Connection {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
}

export interface NodeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basics' | 'accounts' | 'validation' | 'cpi' | 'advanced';
  icon: React.ElementType;
  template: Partial<VisualNode>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface VisualProgramBuilderProps {
  onCodeGenerated: (code: string) => void;
  onSave: (nodes: VisualNode[], connections: Connection[]) => void;
  onLoad: (nodes: VisualNode[], connections: Connection[]) => void;
}

export default function VisualProgramBuilder({
  onCodeGenerated,
  onSave,
  onLoad
}: VisualProgramBuilderProps) {
  const [nodes, setNodes] = useState<VisualNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [draggedNode, setDraggedNode] = useState<NodeTemplate | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{ nodeId: string; portId: string } | null>(null);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Node templates for different Solana program components
  const nodeTemplates: NodeTemplate[] = [
    {
      id: 'init-account',
      name: 'Initialize Account',
      description: 'Initialize a new account with data',
      category: 'accounts',
      icon: Database,
      difficulty: 'beginner',
      template: {
        type: 'instruction',
        title: 'Initialize Account',
        description: 'Initialize a new account with initial data',
        inputs: [
          { id: 'account', name: 'Account', type: 'account', required: true },
          { id: 'authority', name: 'Authority', type: 'account', required: true },
          { id: 'data', name: 'Initial Data', type: 'data', required: false }
        ],
        outputs: [
          { id: 'success', name: 'Success', type: 'control', required: false }
        ],
        properties: {
          space: 8,
          owner: 'program_id'
        }
      }
    },
    {
      id: 'transfer-tokens',
      name: 'Transfer Tokens',
      description: 'Transfer SPL tokens between accounts',
      category: 'cpi',
      icon: Zap,
      difficulty: 'intermediate',
      template: {
        type: 'cpi',
        title: 'Transfer Tokens',
        description: 'Transfer SPL tokens using CPI',
        inputs: [
          { id: 'from', name: 'From Account', type: 'account', required: true },
          { id: 'to', name: 'To Account', type: 'account', required: true },
          { id: 'amount', name: 'Amount', type: 'data', dataType: 'u64', required: true }
        ],
        outputs: [
          { id: 'success', name: 'Success', type: 'control', required: false }
        ],
        properties: {
          token_program: 'spl_token',
          mint: 'optional'
        }
      }
    },
    {
      id: 'validate-owner',
      name: 'Validate Owner',
      description: 'Validate account ownership',
      category: 'validation',
      icon: Shield,
      difficulty: 'beginner',
      template: {
        type: 'validation',
        title: 'Validate Owner',
        description: 'Validate that account is owned by expected program',
        inputs: [
          { id: 'account', name: 'Account', type: 'account', required: true },
          { id: 'expected_owner', name: 'Expected Owner', type: 'data', required: true }
        ],
        outputs: [
          { id: 'valid', name: 'Valid', type: 'control', required: false },
          { id: 'invalid', name: 'Invalid', type: 'control', required: false }
        ],
        properties: {
          check_owner: true,
          check_data: false
        }
      }
    },
    {
      id: 'create-pda',
      name: 'Create PDA',
      description: 'Create a Program Derived Address',
      category: 'advanced',
      icon: Target,
      difficulty: 'advanced',
      template: {
        type: 'pda',
        title: 'Create PDA',
        description: 'Create and initialize a Program Derived Address',
        inputs: [
          { id: 'seeds', name: 'Seeds', type: 'data', required: true },
          { id: 'bump', name: 'Bump', type: 'data', required: true }
        ],
        outputs: [
          { id: 'pda', name: 'PDA', type: 'account', required: false },
          { id: 'success', name: 'Success', type: 'control', required: false }
        ],
        properties: {
          space: 8,
          owner: 'program_id'
        }
      }
    },
    {
      id: 'error-handler',
      name: 'Error Handler',
      description: 'Handle and return errors',
      category: 'basics',
      icon: BookOpen,
      difficulty: 'beginner',
      template: {
        type: 'error-handling',
        title: 'Error Handler',
        description: 'Handle errors and return appropriate error codes',
        inputs: [
          { id: 'error', name: 'Error', type: 'data', required: true },
          { id: 'context', name: 'Context', type: 'data', required: false }
        ],
        outputs: [
          { id: 'result', name: 'Result', type: 'control', required: false }
        ],
        properties: {
          error_type: 'ProgramError',
          log_error: true
        }
      }
    }
  ];

  const handleDragStart = (template: NodeTemplate) => {
    setDraggedNode(template);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: VisualNode = {
      id: `node-${Date.now()}`,
      ...draggedNode.template,
      position: { x, y },
      size: { width: 200, height: 120 },
      inputs: draggedNode.template.inputs || [],
      outputs: draggedNode.template.outputs || [],
      properties: draggedNode.template.properties || {},
      isSelected: false,
      isLocked: false
    } as VisualNode;

    setNodes(prev => [...prev, newNode]);
    setDraggedNode(null);
  };

  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      setSelectedNodes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId);
        } else {
          newSet.add(nodeId);
        }
        return newSet;
      });
    } else {
      // Single select
      setSelectedNodes(new Set([nodeId]));
    }
  };

  const handleNodeDrag = (nodeId: string, e: React.MouseEvent) => {
    if (e.buttons !== 1) return; // Only left mouse button

    const startX = e.clientX;
    const startY = e.clientY;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const startPos = { ...node.position };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      setNodes(prev => prev.map(n => 
        n.id === nodeId 
          ? { ...n, position: { x: startPos.x + deltaX, y: startPos.y + deltaY } }
          : n
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handlePortClick = (nodeId: string, portId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isConnecting) {
      setIsConnecting(true);
      setConnectionStart({ nodeId, portId });
    } else if (connectionStart) {
      // Complete connection
      if (connectionStart.nodeId !== nodeId || connectionStart.portId !== portId) {
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          fromNodeId: connectionStart.nodeId,
          fromPortId: connectionStart.portId,
          toNodeId: nodeId,
          toPortId: portId
        };
        setConnections(prev => [...prev, newConnection]);
      }
      setIsConnecting(false);
      setConnectionStart(null);
    }
  };

  const generateCode = useCallback(() => {
    // Simple code generation - in real implementation, this would be more sophisticated
    let code = `use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::ProgramError,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Generated from visual program builder
`;

    nodes.forEach((node, index) => {
      code += `\n    // ${node.title}\n`;
      switch (node.type) {
        case 'instruction':
          code += `    // Instruction: ${node.title}\n`;
          break;
        case 'validation':
          code += `    // Validation: ${node.title}\n`;
          break;
        case 'cpi':
          code += `    // CPI Call: ${node.title}\n`;
          break;
        case 'pda':
          code += `    // PDA Creation: ${node.title}\n`;
          break;
        case 'error-handling':
          code += `    // Error Handling: ${node.title}\n`;
          break;
      }
    });

    code += `\n    Ok(())\n}`;
    
    setGeneratedCode(code);
    onCodeGenerated(code);
  }, [nodes, onCodeGenerated]);

  const deleteSelectedNodes = () => {
    setNodes(prev => prev.filter(node => !selectedNodes.has(node.id)));
    setConnections(prev => prev.filter(conn => 
      !selectedNodes.has(conn.fromNodeId) && !selectedNodes.has(conn.toNodeId)
    ));
    setSelectedNodes(new Set());
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return BookOpen;
      case 'accounts': return Database;
      case 'validation': return Shield;
      case 'cpi': return Zap;
      case 'advanced': return Target;
      default: return Code;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="h-full flex bg-black text-white">
      {/* Left Panel - Node Templates */}
      <div className="w-80 border-r border-gray-800 bg-gray-900 p-4 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Program Components</h3>
          <p className="text-sm text-gray-400 mb-4">
            Drag components to the canvas to build your Solana program visually
          </p>
        </div>

        <div className="space-y-4">
          {['basics', 'accounts', 'validation', 'cpi', 'advanced'].map(category => (
            <div key={category}>
              <h4 className="text-sm font-medium text-white mb-2 capitalize">{category}</h4>
              <div className="space-y-2">
                {nodeTemplates
                  .filter(template => template.category === category)
                  .map(template => {
                    const Icon = template.icon;
                    return (
                      <div
                        key={template.id}
                        draggable
                        onDragStart={() => handleDragStart(template)}
                        className="p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-400" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="text-sm font-medium text-white">{template.name}</h5>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                getDifficultyColor(template.difficulty)
                              )}>
                                {template.difficulty}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              onClick={generateCode}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Code className="h-4 w-4 mr-2" />
              Generate Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCodePreview(!showCodePreview)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {showCodePreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showCodePreview ? 'Hide Code' : 'Show Code'}
            </Button>
            {selectedNodes.size > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={deleteSelectedNodes}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSave(nodes, connections)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLoad(nodes, connections)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Load
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full bg-gray-800 relative"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => setSelectedNodes(new Set())}
          >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />

            {/* Connections */}
            <svg className="absolute inset-0 pointer-events-none">
              {connections.map(connection => {
                const fromNode = nodes.find(n => n.id === connection.fromNodeId);
                const toNode = nodes.find(n => n.id === connection.toNodeId);
                if (!fromNode || !toNode) return null;

                const fromX = fromNode.position.x + fromNode.size.width;
                const fromY = fromNode.position.y + fromNode.size.height / 2;
                const toX = toNode.position.x;
                const toY = toNode.position.y + toNode.size.height / 2;

                return (
                  <line
                    key={connection.id}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#3B82F6"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#3B82F6"
                  />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {nodes.map(node => (
              <div
                key={node.id}
                className={cn(
                  "absolute bg-gray-900 border-2 rounded-lg p-4 cursor-move",
                  selectedNodes.has(node.id) 
                    ? "border-blue-500 bg-blue-900/20" 
                    : "border-gray-700 hover:border-gray-600"
                )}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  width: node.size.width,
                  height: node.size.height
                }}
                onClick={(e) => handleNodeClick(node.id, e)}
                onMouseDown={(e) => handleNodeDrag(node.id, e)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white">{node.title}</h4>
                  <div className="flex items-center space-x-1">
                    {node.isLocked ? (
                      <Lock className="h-3 w-3 text-gray-400" />
                    ) : (
                      <Unlock className="h-3 w-3 text-gray-400" />
                    )}
                    <GripVertical className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3">{node.description}</p>
                
                {/* Input Ports */}
                <div className="space-y-1 mb-2">
                  {node.inputs.map(port => (
                    <div
                      key={port.id}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className="w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:bg-green-400"
                        onClick={(e) => handlePortClick(node.id, port.id, e)}
                      />
                      <span className="text-xs text-gray-300">{port.name}</span>
                    </div>
                  ))}
                </div>

                {/* Output Ports */}
                <div className="space-y-1">
                  {node.outputs.map(port => (
                    <div
                      key={port.id}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-xs text-gray-300">{port.name}</span>
                      <div
                        className="w-3 h-3 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-400"
                        onClick={(e) => handlePortClick(node.id, port.id, e)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Connection Preview */}
            {isConnecting && connectionStart && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full bg-blue-500/10" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Code Preview */}
      {showCodePreview && (
        <div className="w-96 border-l border-gray-800 bg-gray-900 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Generated Code</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(generatedCode)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 overflow-auto max-h-full">
            <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

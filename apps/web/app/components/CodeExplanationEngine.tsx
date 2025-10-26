'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Lightbulb, 
  BookOpen, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Target,
  Code,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CodeExplanation {
  id: string;
  type: 'concept' | 'function' | 'macro' | 'struct' | 'trait' | 'pattern' | 'warning' | 'tip';
  title: string;
  description: string;
  detailedExplanation: string;
  examples: {
    code: string;
    description: string;
  }[];
  relatedConcepts: string[];
  resources: {
    title: string;
    url: string;
    type: 'documentation' | 'tutorial' | 'example' | 'video';
  }[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  confidence: number; // 0-1
  lineNumber?: number;
  columnStart?: number;
  columnEnd?: number;
}

export interface HoverPosition {
  x: number;
  y: number;
  lineNumber: number;
  columnStart: number;
  columnEnd: number;
  word: string;
}

interface CodeExplanationEngineProps {
  code: string;
  language: string;
  onExplanationRequest: (word: string, position: HoverPosition) => Promise<CodeExplanation | null>;
  onApplySuggestion?: (suggestion: string) => void;
  isEnabled?: boolean;
}

export default function CodeExplanationEngine({
  code,
  language,
  onExplanationRequest,
  onApplySuggestion,
  isEnabled = true
}: CodeExplanationEngineProps) {
  const [hoverPosition, setHoverPosition] = useState<HoverPosition | null>(null);
  const [explanation, setExplanation] = useState<CodeExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock explanation data - in real implementation, this would come from AI/API
  const mockExplanations: Record<string, CodeExplanation> = {
    'use': {
      id: 'use-keyword',
      type: 'concept',
      title: 'use Statement',
      description: 'The `use` keyword brings items into scope from external crates or modules.',
      detailedExplanation: 'In Rust, `use` statements allow you to bring items from other modules or crates into the current scope, making them available without needing to specify their full path. This is essential for working with external libraries like Solana programs.',
      examples: [
        {
          code: 'use solana_program::account_info::AccountInfo;',
          description: 'Import AccountInfo from the solana_program crate'
        },
        {
          code: 'use anchor_lang::prelude::*;',
          description: 'Import all common items from Anchor framework'
        }
      ],
      relatedConcepts: ['modules', 'crates', 'scope', 'imports'],
      resources: [
        {
          title: 'Rust Book - Use',
          url: 'https://doc.rust-lang.org/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html',
          type: 'documentation'
        }
      ],
      difficulty: 'beginner',
      confidence: 0.95
    },
    'entrypoint': {
      id: 'entrypoint-macro',
      type: 'macro',
      title: 'entrypoint! Macro',
      description: 'Defines the main entry point for a Solana program.',
      detailedExplanation: 'The `entrypoint!` macro is specific to Solana programs. It defines the main function that will be called when the program is invoked. This is where all program logic begins.',
      examples: [
        {
          code: 'entrypoint!(process_instruction);',
          description: 'Define process_instruction as the main entry point'
        }
      ],
      relatedConcepts: ['program', 'instruction', 'main function'],
      resources: [
        {
          title: 'Solana Program Model',
          url: 'https://docs.solana.com/developing/programming-model/overview',
          type: 'documentation'
        }
      ],
      difficulty: 'beginner',
      confidence: 0.98
    },
    'AccountInfo': {
      id: 'account-info',
      type: 'struct',
      title: 'AccountInfo',
      description: 'Represents an account on the Solana blockchain with its data and metadata.',
      detailedExplanation: 'AccountInfo is a struct that contains all the information about a Solana account, including its public key, data, owner, and other metadata. It\'s the primary way to interact with accounts in Solana programs.',
      examples: [
        {
          code: 'let account: &AccountInfo = &accounts[0];',
          description: 'Get the first account from the accounts array'
        },
        {
          code: 'let data = account.data.borrow();',
          description: 'Borrow the account data for reading'
        }
      ],
      relatedConcepts: ['account', 'data', 'borrow', 'owner'],
      resources: [
        {
          title: 'Solana Accounts',
          url: 'https://docs.solana.com/developing/programming-model/accounts',
          type: 'documentation'
        }
      ],
      difficulty: 'intermediate',
      confidence: 0.92
    },
    'Result': {
      id: 'result-type',
      type: 'trait',
      title: 'Result Type',
      description: 'A type that represents either success (Ok) or failure (Err).',
      detailedExplanation: 'Result<T, E> is Rust\'s way of handling errors without exceptions. It forces you to handle both success and error cases explicitly, making your code more robust and predictable.',
      examples: [
        {
          code: 'fn process() -> Result<(), ProgramError> { Ok(()) }',
          description: 'Function that returns Result with no value on success'
        },
        {
          code: 'match result { Ok(value) => println!("Success: {}", value), Err(e) => println!("Error: {}", e) }',
          description: 'Pattern matching on Result'
        }
      ],
      relatedConcepts: ['error handling', 'Ok', 'Err', 'match'],
      resources: [
        {
          title: 'Rust Book - Error Handling',
          url: 'https://doc.rust-lang.org/book/ch09-00-error-handling.html',
          type: 'documentation'
        }
      ],
      difficulty: 'intermediate',
      confidence: 0.94
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isEnabled) return;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;

    // Calculate relative position
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    // Extract word under cursor (simplified - in real implementation, this would be more sophisticated)
    const textContent = target.textContent || '';
    const wordMatch = textContent.match(/\b\w+\b/g);
    
    if (wordMatch && wordMatch.length > 0) {
      const word = wordMatch[0];
      
      // Clear existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Set new timeout for hover
      hoverTimeoutRef.current = setTimeout(async () => {
        const position: HoverPosition = {
          x: event.clientX,
          y: event.clientY,
          lineNumber: 1, // Simplified - would need proper line calculation
          columnStart: 0,
          columnEnd: word.length,
          word
        };

        setHoverPosition(position);
        
        // Check if we have a mock explanation
        if (mockExplanations[word]) {
          setExplanation(mockExplanations[word]);
          setShowExplanation(true);
        } else {
          // Request explanation from AI
          setIsLoading(true);
          try {
            const explanation = await onExplanationRequest(word, position);
            if (explanation) {
              setExplanation(explanation);
              setShowExplanation(true);
            }
          } catch (error) {
            console.error('Failed to get explanation:', error);
          } finally {
            setIsLoading(false);
          }
        }
      }, 500); // 500ms delay before showing explanation
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowExplanation(false);
    setExplanation(null);
    setHoverPosition(null);
  };

  const copyExample = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedExample(code);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'concept': return <BookOpen className="h-4 w-4" />;
      case 'function': return <Code className="h-4 w-4" />;
      case 'macro': return <Zap className="h-4 w-4" />;
      case 'struct': return <Target className="h-4 w-4" />;
      case 'trait': return <Info className="h-4 w-4" />;
      case 'pattern': return <Lightbulb className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'tip': return <Lightbulb className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'concept': return 'text-blue-400 bg-blue-400/20';
      case 'function': return 'text-green-400 bg-green-400/20';
      case 'macro': return 'text-purple-400 bg-purple-400/20';
      case 'struct': return 'text-yellow-400 bg-yellow-400/20';
      case 'trait': return 'text-orange-400 bg-orange-400/20';
      case 'pattern': return 'text-cyan-400 bg-cyan-400/20';
      case 'warning': return 'text-red-400 bg-red-400/20';
      case 'tip': return 'text-emerald-400 bg-emerald-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
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
    <div className="relative">
      {/* Code Container */}
      <div
        ref={containerRef}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* This would be where the actual code editor content is rendered */}
        <pre className="text-sm font-mono text-gray-300 bg-gray-900 p-4 rounded border">
          <code>{code}</code>
        </pre>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span className="text-sm text-gray-300">Analyzing...</span>
          </div>
        </div>
      )}

      {/* Explanation Popup */}
      {showExplanation && explanation && (
        <div className="absolute z-50 max-w-md">
          <Card className="bg-gray-900 border-gray-700 shadow-xl">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    getTypeColor(explanation.type)
                  )}>
                    {getTypeIcon(explanation.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{explanation.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getDifficultyColor(explanation.difficulty)
                      )}>
                        {explanation.difficulty}
                      </span>
                      <span className="text-xs text-gray-400">
                        {Math.round(explanation.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExplanation(false)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 mb-3">{explanation.description}</p>

              {/* Detailed Explanation */}
              <div className="mb-4">
                <h5 className="text-xs font-medium text-white mb-2">Detailed Explanation:</h5>
                <p className="text-sm text-gray-400 leading-relaxed">{explanation.detailedExplanation}</p>
              </div>

              {/* Examples */}
              {explanation.examples.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-white mb-2">Examples:</h5>
                  <div className="space-y-2">
                    {explanation.examples.map((example, index) => (
                      <div key={index} className="bg-gray-800 rounded p-3">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-xs text-gray-400">{example.description}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyExample(example.code)}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            {copiedExample === example.code ? (
                              <CheckCircle className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <pre className="text-xs font-mono text-gray-300 bg-gray-900 p-2 rounded">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Concepts */}
              {explanation.relatedConcepts.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-white mb-2">Related Concepts:</h5>
                  <div className="flex flex-wrap gap-1">
                    {explanation.relatedConcepts.map((concept, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {explanation.resources.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-white mb-2">Learn More:</h5>
                  <div className="space-y-1">
                    {explanation.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>{resource.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // In real implementation, this would open the full documentation
                    console.log('Open full documentation for:', explanation.title);
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Full Docs
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    // In real implementation, this would apply a code suggestion
                    if (onApplySuggestion && explanation.examples.length > 0) {
                      onApplySuggestion(explanation.examples[0].code);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Apply Example
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Lightbulb, 
  Zap,
  Shield,
  Bug,
  Clock,
  Target,
  BookOpen,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CodeIssue {
  id: string;
  type: 'error' | 'warning' | 'info' | 'suggestion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  suggestion?: string;
  lineNumber: number;
  columnStart: number;
  columnEnd: number;
  category: 'security' | 'performance' | 'best-practice' | 'syntax' | 'logic' | 'solana-specific';
  confidence: number; // 0-1
  autoFixable: boolean;
  resources: {
    title: string;
    url: string;
    type: 'documentation' | 'tutorial' | 'example';
  }[];
  relatedIssues?: string[];
}

export interface PreventionRule {
  id: string;
  name: string;
  description: string;
  pattern: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  autoFix: boolean;
  suggestion: string;
}

interface MistakePreventionSystemProps {
  code: string;
  language: string;
  onIssueDetected: (issues: CodeIssue[]) => void;
  onAutoFix: (issueId: string, fix: string) => void;
  isEnabled?: boolean;
}

export default function MistakePreventionSystem({
  code,
  language,
  onIssueDetected,
  onAutoFix,
  isEnabled = true
}: MistakePreventionSystemProps) {
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [preventionRules, setPreventionRules] = useState<PreventionRule[]>([]);

  // Mock prevention rules - in real implementation, these would be configurable
  const mockRules: PreventionRule[] = [
    {
      id: 'rule-1',
      name: 'Unchecked Account Validation',
      description: 'Always validate account ownership and permissions',
      pattern: 'AccountInfo.*borrow.*without.*check',
      category: 'security',
      severity: 'critical',
      enabled: true,
      autoFix: false,
      suggestion: 'Add proper account validation before accessing data'
    },
    {
      id: 'rule-2',
      name: 'Missing Error Handling',
      description: 'Handle potential errors with Result types',
      pattern: '.*\\.unwrap\\(\\).*',
      category: 'best-practice',
      severity: 'high',
      enabled: true,
      autoFix: true,
      suggestion: 'Replace unwrap() with proper error handling'
    },
    {
      id: 'rule-3',
      name: 'Inefficient Account Access',
      description: 'Avoid multiple borrows of the same account',
      pattern: '.*borrow.*borrow.*',
      category: 'performance',
      severity: 'medium',
      enabled: true,
      autoFix: false,
      suggestion: 'Store borrowed data in a variable to avoid multiple borrows'
    },
    {
      id: 'rule-4',
      name: 'Hardcoded Program IDs',
      description: 'Use declare_id! macro for program IDs',
      pattern: '".*11111111111111111111111111111111.*"',
      category: 'best-practice',
      severity: 'medium',
      enabled: true,
      autoFix: true,
      suggestion: 'Use declare_id! macro instead of hardcoded program ID'
    },
    {
      id: 'rule-5',
      name: 'Missing PDA Validation',
      description: 'Validate Program Derived Addresses',
      pattern: 'find_program_address.*without.*validation',
      category: 'solana-specific',
      severity: 'high',
      enabled: true,
      autoFix: false,
      suggestion: 'Add PDA validation to ensure correct address derivation'
    }
  ];

  useEffect(() => {
    setPreventionRules(mockRules);
  }, []);

  const analyzeCode = useCallback(async (codeToAnalyze: string) => {
    if (!isEnabled || !codeToAnalyze.trim()) {
      setIssues([]);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock analysis - in real implementation, this would use AST parsing and rule matching
    const detectedIssues: CodeIssue[] = [];

    // Check for common Solana/Rust issues
    const lines = codeToAnalyze.split('\n');
    
    lines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      
      // Check for unwrap() usage
      if (line.includes('.unwrap()') && !line.includes('// TODO: Handle error')) {
        detectedIssues.push({
          id: `issue-${lineNumber}-unwrap`,
          type: 'warning',
          severity: 'high',
          title: 'Unsafe unwrap() usage',
          description: 'Using unwrap() can cause the program to panic. Consider using proper error handling.',
          suggestion: 'Replace with match statement or ? operator for proper error handling',
          lineNumber,
          columnStart: line.indexOf('.unwrap()'),
          columnEnd: line.indexOf('.unwrap()') + 8,
          category: 'best-practice',
          confidence: 0.95,
          autoFixable: true,
          resources: [
            {
              title: 'Rust Error Handling',
              url: 'https://doc.rust-lang.org/book/ch09-00-error-handling.html',
              type: 'documentation'
            }
          ]
        });
      }

      // Check for hardcoded program IDs
      if (line.includes('"11111111111111111111111111111111"')) {
        detectedIssues.push({
          id: `issue-${lineNumber}-hardcoded-id`,
          type: 'warning',
          severity: 'medium',
          title: 'Hardcoded program ID',
          description: 'Using hardcoded program IDs is not recommended. Use declare_id! macro instead.',
          suggestion: 'Use declare_id!("your-program-id") at the top of your program',
          lineNumber,
          columnStart: line.indexOf('"11111111111111111111111111111111"'),
          columnEnd: line.indexOf('"11111111111111111111111111111111"') + 44,
          category: 'best-practice',
          confidence: 0.98,
          autoFixable: true,
          resources: [
            {
              title: 'Solana Program IDs',
              url: 'https://docs.solana.com/developing/programming-model/overview#program-id',
              type: 'documentation'
            }
          ]
        });
      }

      // Check for missing account validation
      if (line.includes('account.data.borrow()') && !line.includes('account.owner')) {
        detectedIssues.push({
          id: `issue-${lineNumber}-account-validation`,
          type: 'error',
          severity: 'critical',
          title: 'Missing account validation',
          description: 'Accessing account data without validating ownership can lead to security vulnerabilities.',
          suggestion: 'Add account ownership validation before accessing data',
          lineNumber,
          columnStart: line.indexOf('account.data.borrow()'),
          columnEnd: line.indexOf('account.data.borrow()') + 20,
          category: 'security',
          confidence: 0.90,
          autoFixable: false,
          resources: [
            {
              title: 'Solana Account Security',
              url: 'https://docs.solana.com/developing/programming-model/accounts#account-validation',
              type: 'documentation'
            }
          ]
        });
      }

      // Check for inefficient borrows
      if (line.includes('.borrow()') && line.includes('.borrow()')) {
        detectedIssues.push({
          id: `issue-${lineNumber}-multiple-borrows`,
          type: 'info',
          severity: 'medium',
          title: 'Multiple borrows detected',
          description: 'Multiple borrows of the same account can be inefficient. Consider storing the borrowed data.',
          suggestion: 'Store the borrowed data in a variable to avoid multiple borrows',
          lineNumber,
          columnStart: 0,
          columnEnd: line.length,
          category: 'performance',
          confidence: 0.85,
          autoFixable: false,
          resources: [
            {
              title: 'Rust Borrowing Best Practices',
              url: 'https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html',
              type: 'documentation'
            }
          ]
        });
      }

      // Check for missing PDA validation
      if (line.includes('find_program_address') && !line.includes('assert_eq')) {
        detectedIssues.push({
          id: `issue-${lineNumber}-pda-validation`,
          type: 'warning',
          severity: 'high',
          title: 'Missing PDA validation',
          description: 'Program Derived Addresses should be validated to ensure correct derivation.',
          suggestion: 'Add validation to ensure the PDA is derived correctly',
          lineNumber,
          columnStart: line.indexOf('find_program_address'),
          columnEnd: line.indexOf('find_program_address') + 20,
          category: 'solana-specific',
          confidence: 0.88,
          autoFixable: false,
          resources: [
            {
              title: 'PDA Validation',
              url: 'https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses',
              type: 'documentation'
            }
          ]
        });
      }
    });

    setIssues(detectedIssues);
    onIssueDetected(detectedIssues);
    setIsAnalyzing(false);
  }, [isEnabled, onIssueDetected]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeCode(code);
    }, 500); // Debounce analysis

    return () => clearTimeout(timeoutId);
  }, [code, analyzeCode]);

  const toggleIssueExpansion = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const handleAutoFix = (issue: CodeIssue) => {
    if (!issue.autoFixable || !issue.suggestion) return;

    // In real implementation, this would apply the actual fix
    onAutoFix(issue.id, issue.suggestion);
    
    // Remove the fixed issue
    setIssues(prev => prev.filter(i => i.id !== issue.id));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'medium': return <Info className="h-4 w-4 text-yellow-400" />;
      case 'low': return <Info className="h-4 w-4 text-blue-400" />;
      default: return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'best-practice': return <Target className="h-4 w-4" />;
      case 'syntax': return <Bug className="h-4 w-4" />;
      case 'logic': return <Lightbulb className="h-4 w-4" />;
      case 'solana-specific': return <BookOpen className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400 bg-red-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'info': return 'text-blue-400 bg-blue-400/20';
      case 'suggestion': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Mistake Prevention</h3>
          {isAnalyzing && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span className="text-sm text-gray-400">Analyzing...</span>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-400">
          {issues.length} issue{issues.length !== 1 ? 's' : ''} detected
        </div>
      </div>

      {/* Issues List */}
      {issues.length === 0 && !isAnalyzing ? (
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-white mb-1">No Issues Found</h4>
            <p className="text-xs text-gray-400">Your code looks good! Keep up the great work.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <Card key={issue.id} className={cn(
              "border transition-all duration-200",
              getSeverityColor(issue.severity)
            )}>
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(issue.severity)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium text-white">{issue.title}</h4>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getTypeColor(issue.type)
                      )}>
                        {issue.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        Line {issue.lineNumber}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">{issue.description}</p>
                    
                    {issue.suggestion && (
                      <div className="mb-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Lightbulb className="h-4 w-4 text-yellow-400" />
                          <span className="text-xs font-medium text-yellow-400">Suggestion:</span>
                        </div>
                        <p className="text-sm text-gray-300 bg-gray-800 p-2 rounded">
                          {issue.suggestion}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(issue.category)}
                          <span>{issue.category}</span>
                        </div>
                        <span>{Math.round(issue.confidence * 100)}% confidence</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {issue.autoFixable && (
                          <Button
                            size="sm"
                            onClick={() => handleAutoFix(issue)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Auto Fix
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleIssueExpansion(issue.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          {expandedIssues.has(issue.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedIssues.has(issue.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="space-y-3">
                          {/* Resources */}
                          {issue.resources.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-white mb-2">Learn More:</h5>
                              <div className="space-y-1">
                                {issue.resources.map((resource, index) => (
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

                          {/* Related Issues */}
                          {issue.relatedIssues && issue.relatedIssues.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-white mb-2">Related Issues:</h5>
                              <div className="flex flex-wrap gap-1">
                                {issue.relatedIssues.map((relatedIssue, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                                    {relatedIssue}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

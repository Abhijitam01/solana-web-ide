'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { 
  Brain, 
  Lightbulb, 
  Shield, 
  Zap, 
  BookOpen, 
  Target,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Star,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface CodeExplanation {
  lineNumber: number;
  code: string;
  explanation: string;
  concepts: string[];
  alternatives: string[];
  bestPractices: string[];
  commonMistakes: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  importance: 'low' | 'medium' | 'high';
}

interface AICodeExplainerProps {
  code: string;
  language: string;
  onExplanationComplete?: (explanations: CodeExplanation[]) => void;
}

export default function AICodeExplainer({ code, language, onExplanationComplete }: AICodeExplainerProps) {
  const [explanations, setExplanations] = useState<CodeExplanation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<{ [key: number]: boolean }>({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateExplanations = async () => {
    setIsLoading(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock explanations based on the code
      const mockExplanations: CodeExplanation[] = [
        {
          lineNumber: 1,
          code: 'use anchor_lang::prelude::*;',
          explanation: 'This imports the Anchor framework prelude, which provides essential macros and types for Solana program development.',
          concepts: ['Anchor Framework', 'Imports', 'Prelude'],
          alternatives: ['use anchor_lang::*;', 'Individual imports'],
          bestPractices: ['Always use prelude for standard Anchor development', 'Import only what you need for better performance'],
          commonMistakes: ['Forgetting to import prelude', 'Importing unnecessary modules'],
          difficulty: 'beginner',
          importance: 'high'
        },
        {
          lineNumber: 3,
          code: 'declare_id!("11111111111111111111111111111111");',
          explanation: 'This declares the program ID for your Solana program. It\'s a unique identifier that distinguishes your program from others on the blockchain.',
          concepts: ['Program ID', 'Program Identity', 'Blockchain Addresses'],
          alternatives: ['Using a different program ID', 'Generating a new ID'],
          bestPractices: ['Use a unique program ID for production', 'Keep the same ID for upgrades'],
          commonMistakes: ['Using the default ID in production', 'Changing ID between deployments'],
          difficulty: 'beginner',
          importance: 'high'
        },
        {
          lineNumber: 5,
          code: '#[program]',
          explanation: 'This is an Anchor macro that marks the beginning of your program module. It tells Anchor that this is the main program logic.',
          concepts: ['Anchor Macros', 'Program Structure', 'Module Declaration'],
          alternatives: ['Native Solana program structure', 'Custom program framework'],
          bestPractices: ['Always use the #[program] macro in Anchor', 'Keep program logic organized'],
          commonMistakes: ['Forgetting the #[program] macro', 'Placing it in wrong location'],
          difficulty: 'beginner',
          importance: 'high'
        }
      ];
      
      setExplanations(mockExplanations);
      onExplanationComplete?.(mockExplanations);
    } catch (error) {
      console.error('Failed to generate explanations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDetails = (lineNumber: number) => {
    setShowDetails(prev => ({
      ...prev,
      [lineNumber]: !prev[lineNumber]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'low': return 'text-gray-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const startPlayback = () => {
    setIsPlaying(true);
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < explanations.length) {
        setCurrentLine(explanations[currentIndex].lineNumber);
        currentIndex++;
      } else {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 2000 / playbackSpeed);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentLine(null);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">AI Code Explainer</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">AI Active</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={generateExplanations}
              disabled={isLoading}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Explain Code
                </>
              )}
            </Button>
            
            {explanations.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={isPlaying ? stopPlayback : startPlayback}
                  variant="outline"
                  size="sm"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => setCurrentLine(null)}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {explanations.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Learn?</h3>
              <p className="text-muted-foreground mb-4">
                Click "Explain Code" to get AI-powered explanations of your code
              </p>
              <Button
                onClick={generateExplanations}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Brain className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {explanations.map((explanation, index) => (
              <Card 
                key={explanation.lineNumber}
                className={`transition-all duration-300 ${
                  currentLine === explanation.lineNumber 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {explanation.lineNumber}
                        </div>
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {explanation.code}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(explanation.difficulty)}`}></div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {explanation.difficulty}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getImportanceColor(explanation.importance)}`}></div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {explanation.importance}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDetails(explanation.lineNumber)}
                    >
                      {showDetails[explanation.lineNumber] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm leading-relaxed mb-4">{explanation.explanation}</p>
                  
                  {showDetails[explanation.lineNumber] && (
                    <div className="space-y-4 border-t pt-4">
                      {/* Concepts */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Key Concepts
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {explanation.concepts.map((concept, idx) => (
                            <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Best Practices */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Best Practices
                        </h4>
                        <ul className="space-y-1">
                          {explanation.bestPractices.map((practice, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Common Mistakes */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                          Common Mistakes
                        </h4>
                        <ul className="space-y-1">
                          {explanation.commonMistakes.map((mistake, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start">
                              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {mistake}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Alternatives */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                          Alternative Approaches
                        </h4>
                        <ul className="space-y-1">
                          {explanation.alternatives.map((alternative, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {alternative}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

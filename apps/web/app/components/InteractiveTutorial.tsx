'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft,
  BookOpen,
  Code,
  Target,
  Trophy
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TutorialStep {
  id: string;
  title: string;
  type: 'explanation' | 'code' | 'quiz' | 'challenge' | 'demo';
  content: string;
  expectedCode?: string;
  hints: string[];
  explanation: string;
  nextStep?: string;
  prevStep?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  xpReward: number;
  prerequisites?: string[];
}

export interface TutorialProgress {
  stepId: string;
  completed: boolean;
  attempts: number;
  timeSpent: number;
  hintsUsed: number;
  completedAt?: Date;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  steps: TutorialStep[];
  prerequisites?: string[];
  xpReward: number;
  badge?: string;
}

interface InteractiveTutorialProps {
  tutorial: Tutorial;
  onComplete: (tutorial: Tutorial, progress: TutorialProgress[]) => void;
  onStepComplete: (step: TutorialStep, progress: TutorialProgress) => void;
  userProgress?: TutorialProgress[];
  isEmbedded?: boolean;
}

export default function InteractiveTutorial({
  tutorial,
  onComplete,
  onStepComplete,
  userProgress = [],
  isEmbedded = false
}: InteractiveTutorialProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentCode, setCurrentCode] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    errors?: string[];
  } | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentStep = tutorial.steps[currentStepIndex];
  const progress = userProgress.find(p => p.stepId === currentStep.id);
  const isCompleted = progress?.completed || false;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isCompleted]);

  const validateCode = (code: string, expectedCode?: string) => {
    if (!expectedCode) return { isValid: true, message: 'No validation required' };

    // Simple validation - in real implementation, this would be more sophisticated
    const normalizedCode = code.trim().toLowerCase();
    const normalizedExpected = expectedCode.trim().toLowerCase();
    
    if (normalizedCode === normalizedExpected) {
      return { isValid: true, message: 'Perfect! Code matches expected output.' };
    }

    // Check for key concepts
    const keyConcepts = expectedCode.match(/\b(use|fn|struct|impl|pub|let|mut|return)\b/g) || [];
    const foundConcepts = keyConcepts.filter(concept => 
      normalizedCode.includes(concept.toLowerCase())
    );

    if (foundConcepts.length >= keyConcepts.length * 0.7) {
      return { 
        isValid: true, 
        message: 'Good progress! You have most of the key concepts.' 
      };
    }

    return { 
      isValid: false, 
      message: 'Try again. Focus on the key concepts highlighted in the explanation.',
      errors: keyConcepts.filter(concept => !normalizedCode.includes(concept.toLowerCase()))
    };
  };

  const handleCodeSubmit = () => {
    const result = validateCode(currentCode, currentStep.expectedCode);
    setValidationResult(result);
    setAttempts(prev => prev + 1);

    if (result.isValid) {
      const stepProgress: TutorialProgress = {
        stepId: currentStep.id,
        completed: true,
        attempts: attempts + 1,
        timeSpent,
        hintsUsed: hintIndex,
        completedAt: new Date()
      };

      onStepComplete(currentStep, stepProgress);
      setIsPlaying(false);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < tutorial.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setCurrentCode('');
      setValidationResult(null);
      setShowHints(false);
      setHintIndex(0);
      setTimeSpent(0);
      setAttempts(0);
      setIsPlaying(true);
    } else {
      // Tutorial completed
      onComplete(tutorial, userProgress);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setCurrentCode('');
      setValidationResult(null);
      setShowHints(false);
      setHintIndex(0);
      setTimeSpent(0);
      setAttempts(0);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "h-full flex flex-col bg-black text-white",
      isEmbedded ? "border border-gray-800 rounded-lg" : ""
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">{tutorial.title}</h2>
          </div>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            getDifficultyColor(tutorial.difficulty)
          )}>
            {tutorial.difficulty}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Step {currentStepIndex + 1} of {tutorial.steps.length}
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">+{currentStep.xpReward} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-800">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / tutorial.steps.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tutorial Content */}
        <div className="w-1/2 border-r border-gray-800 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Step Header */}
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>{currentStep.estimatedTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Code className="h-4 w-4" />
                  <span>{currentStep.type}</span>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {currentStep.content}
              </div>
            </div>

            {/* Code Example (if applicable) */}
            {currentStep.expectedCode && (
              <Card className="bg-gray-900 border-gray-700">
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-2">Expected Code:</h4>
                  <pre className="text-sm text-gray-300 bg-gray-800 p-3 rounded border overflow-x-auto">
                    <code>{currentStep.expectedCode}</code>
                  </pre>
                </div>
              </Card>
            )}

            {/* Hints */}
            {currentStep.hints.length > 0 && (
              <Card className="bg-blue-900/20 border-blue-700">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-blue-300 flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>Hints ({hintIndex + 1}/{currentStep.hints.length})</span>
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (hintIndex < currentStep.hints.length - 1) {
                          setHintIndex(prev => prev + 1);
                        }
                        setShowHints(true);
                      }}
                      disabled={hintIndex >= currentStep.hints.length - 1}
                      className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                    >
                      {hintIndex >= currentStep.hints.length - 1 ? 'All hints shown' : 'Next Hint'}
                    </Button>
                  </div>
                  {showHints && (
                    <p className="text-sm text-blue-200">
                      {currentStep.hints[hintIndex]}
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Validation Result */}
            {validationResult && (
              <Card className={cn(
                "border",
                validationResult.isValid 
                  ? "bg-green-900/20 border-green-700" 
                  : "bg-red-900/20 border-red-700"
              )}>
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {validationResult.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                    <span className={cn(
                      "font-medium",
                      validationResult.isValid ? "text-green-300" : "text-red-300"
                    )}>
                      {validationResult.isValid ? 'Success!' : 'Try Again'}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm",
                    validationResult.isValid ? "text-green-200" : "text-red-200"
                  )}>
                    {validationResult.message}
                  </p>
                  {validationResult.errors && (
                    <div className="mt-2">
                      <p className="text-xs text-red-300 mb-1">Missing concepts:</p>
                      <div className="flex flex-wrap gap-1">
                        {validationResult.errors.map((error, index) => (
                          <span key={index} className="px-2 py-1 bg-red-800 text-red-200 text-xs rounded">
                            {error}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Step Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-900 p-3 rounded">
                <div className="text-lg font-bold text-white">{attempts}</div>
                <div className="text-xs text-gray-400">Attempts</div>
              </div>
              <div className="bg-gray-900 p-3 rounded">
                <div className="text-lg font-bold text-white">{formatTime(timeSpent)}</div>
                <div className="text-xs text-gray-400">Time</div>
              </div>
              <div className="bg-gray-900 p-3 rounded">
                <div className="text-lg font-bold text-white">{hintIndex}</div>
                <div className="text-xs text-gray-400">Hints Used</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 border-b border-gray-800 bg-gray-900">
            <h4 className="text-sm font-medium text-white">Your Code</h4>
          </div>
          
          <div className="flex-1 p-4">
            <textarea
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              placeholder="Write your code here..."
              className="w-full h-full bg-gray-900 border border-gray-700 rounded p-4 text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={isCompleted}
            />
          </div>

          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isCompleted}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentCode('');
                    setValidationResult(null);
                    setAttempts(0);
                    setTimeSpent(0);
                  }}
                  disabled={isCompleted}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={isCompleted ? handleNextStep : handleCodeSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isCompleted ? (
                    <>
                      {currentStepIndex === tutorial.steps.length - 1 ? 'Complete Tutorial' : 'Next Step'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    'Check Code'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
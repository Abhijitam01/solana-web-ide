'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Circle,
  Lightbulb,
  Target,
  BookOpen,
  Code,
  Zap,
  Brain,
  Star,
  Clock,
  Users,
  Award
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  explanation?: string;
  hint?: string;
  solution?: string;
  type: 'concept' | 'code' | 'challenge' | 'quiz';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  isCompleted: boolean;
  isLocked: boolean;
}

interface InteractiveTutorialProps {
  tutorialId: string;
  onComplete?: (tutorialId: string) => void;
}

export default function InteractiveTutorial({ tutorialId, onComplete }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'what-is-solana',
      title: 'What is Solana?',
      description: 'Learn the fundamentals of Solana blockchain and how it differs from other blockchains.',
      explanation: 'Solana is a high-performance blockchain that can process thousands of transactions per second. It uses a unique consensus mechanism called Proof of History (PoH) combined with Proof of Stake (PoS).',
      type: 'concept',
      difficulty: 'beginner',
      estimatedTime: 5,
      isCompleted: false,
      isLocked: false
    },
    {
      id: 'accounts-and-programs',
      title: 'Accounts and Programs',
      description: 'Understand how data is stored and managed on Solana through accounts and programs.',
      explanation: 'In Solana, everything is an account. Programs are accounts that store executable code, while data accounts store information. Each account has an owner (usually a program) and can store data.',
      type: 'concept',
      difficulty: 'beginner',
      estimatedTime: 8,
      isCompleted: false,
      isLocked: false
    },
    {
      id: 'first-program',
      title: 'Your First Solana Program',
      description: 'Write your first Solana program using Anchor framework.',
      code: `use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }
}`,
      explanation: 'This is a basic Solana program that initializes a counter. The `#[program]` macro tells Anchor this is the main program logic.',
      type: 'code',
      difficulty: 'beginner',
      estimatedTime: 10,
      isCompleted: false,
      isLocked: false
    },
    {
      id: 'understanding-macros',
      title: 'Understanding Anchor Macros',
      description: 'Learn about the key macros used in Anchor development.',
      hint: 'Think about what each macro does and why it\'s important for Solana development.',
      type: 'quiz',
      difficulty: 'beginner',
      estimatedTime: 7,
      isCompleted: false,
      isLocked: false
    },
    {
      id: 'challenge-counter',
      title: 'Challenge: Build a Counter',
      description: 'Create a counter program that can increment and decrement values.',
      hint: 'You\'ll need to add increment and decrement functions to your program.',
      solution: `pub fn increment(ctx: Context<Increment>) -> Result<()> {
    let counter = &mut ctx.accounts.counter;
    counter.count += 1;
    Ok(())
}

pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
    let counter = &mut ctx.accounts.counter;
    counter.count -= 1;
    Ok(())
}`,
      type: 'challenge',
      difficulty: 'intermediate',
      estimatedTime: 15,
      isCompleted: false,
      isLocked: false
    }
  ];

  const currentStepData = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    setProgress(((currentStep + 1) / tutorialSteps.length) * 100);
  }, [currentStep, tutorialSteps.length]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      onComplete?.(tutorialId);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHint(false);
      setUserAnswer('');
      setIsCorrect(null);
    }
  };

  const handleCompleteStep = () => {
    const updatedSteps = [...tutorialSteps];
    updatedSteps[currentStep].isCompleted = true;
    setProgress(((currentStep + 1) / tutorialSteps.length) * 100);
  };

  const handleQuizSubmit = () => {
    // Simple quiz logic - in real implementation, this would be more sophisticated
    const correctAnswers = ['#[program]', 'declare_id!', 'use anchor_lang::prelude::*'];
    const isAnswerCorrect = correctAnswers.some(answer => 
      userAnswer.toLowerCase().includes(answer.toLowerCase())
    );
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      handleCompleteStep();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'concept': return BookOpen;
      case 'code': return Code;
      case 'challenge': return Target;
      case 'quiz': return Brain;
      default: return BookOpen;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Interactive Tutorial</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {tutorialSteps.length}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              size="sm"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setCurrentStep(0)}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Step Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${getDifficultyColor(currentStepData.difficulty)}`}></div>
              <span className="text-sm text-muted-foreground capitalize">
                {currentStepData.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{currentStepData.estimatedTime} min</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>{currentStepData.type}</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-2">{currentStepData.title}</h2>
            <p className="text-lg text-muted-foreground">{currentStepData.description}</p>
          </div>

          {/* Step Content */}
          <Card className="mb-6">
            <CardContent className="p-6">
              {currentStepData.type === 'concept' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Concept Explanation
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {currentStepData.explanation}
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Key Takeaways:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Solana uses a unique consensus mechanism</li>
                      <li>• High throughput and low latency</li>
                      <li>• Developer-friendly with Anchor framework</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentStepData.type === 'code' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    Code Example
                  </h3>
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{currentStepData.code}</code>
                    </pre>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentStepData.explanation}
                  </p>
                </div>
              )}

              {currentStepData.type === 'quiz' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Quiz Time
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    What are the three main macros used in Anchor development?
                  </p>
                  <div className="space-y-4">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter your answer here..."
                      className="w-full p-3 border border-border rounded-lg bg-background"
                      rows={3}
                    />
                    {isCorrect !== null && (
                      <div className={`p-3 rounded-lg ${
                        isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {isCorrect ? 'Correct! Well done!' : 'Not quite right. Try again!'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStepData.type === 'challenge' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Coding Challenge
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {currentStepData.description}
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">Your Task:</h4>
                    <p className="text-sm text-muted-foreground">
                      Implement the increment and decrement functions for the counter program.
                    </p>
                  </div>
                  {showHint && (
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-blue-400 mb-2">💡 Hint:</h4>
                      <p className="text-sm text-blue-300">{currentStepData.hint}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hint Button */}
          {currentStepData.hint && (
            <div className="mb-6">
              <Button
                onClick={() => setShowHint(!showHint)}
                variant="outline"
                className="w-full"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
            </div>
          )}

          {/* Solution (for challenges) */}
          {currentStepData.type === 'challenge' && showHint && currentStepData.solution && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    <code>{currentStepData.solution}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={handlePrevious}
              disabled={isFirstStep}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              variant="default"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isLastStep ? 'Complete Tutorial' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            {currentStepData.type === 'quiz' && (
              <Button
                onClick={handleQuizSubmit}
                disabled={!userAnswer.trim()}
                variant="outline"
              >
                Submit Answer
              </Button>
            )}
            {currentStepData.type !== 'quiz' && (
              <Button
                onClick={handleCompleteStep}
                variant="outline"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

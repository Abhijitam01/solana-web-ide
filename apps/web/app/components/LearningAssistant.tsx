'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Bot, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Lightbulb, 
  CheckCircle, 
  Clock, 
  Star,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Brain,
  Award,
  Users,
  BarChart3
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LearningInsight {
  id: string;
  type: 'concept' | 'pattern' | 'mistake' | 'suggestion';
  title: string;
  description: string;
  confidence: number;
  relatedCode?: string;
  resources: string[];
}

export interface UserProgress {
  userId: string;
  completedTutorials: string[];
  currentTutorial?: string;
  currentStep?: number;
  totalXp: number;
  level: number;
  streak: number;
  lastActive: Date;
  learningPath: 'beginner' | 'intermediate' | 'advanced' | 'custom';
  strengths: string[];
  weaknesses: string[];
  timeSpent: number; // in minutes
  achievements: string[];
}

export interface PersonalizedRecommendation {
  id: string;
  type: 'tutorial' | 'contract' | 'challenge' | 'concept';
  title: string;
  description: string;
  reason: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  xpReward: number;
  priority: 'high' | 'medium' | 'low';
}

interface LearningAssistantProps {
  userProgress: UserProgress;
  currentCode?: string;
  onRecommendationClick: (recommendation: PersonalizedRecommendation) => void;
  onInsightClick: (insight: LearningInsight) => void;
}

export default function LearningAssistant({
  userProgress,
  currentCode,
  onRecommendationClick,
  onInsightClick
}: LearningAssistantProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'insights' | 'progress'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);

  useEffect(() => {
    // Simulate AI analysis of current code
    if (currentCode) {
      setIsAnalyzing(true);
      setTimeout(() => {
        const newInsights = analyzeCode(currentCode);
        setInsights(newInsights);
        setIsAnalyzing(false);
      }, 2000);
    }
  }, [currentCode]);

  useEffect(() => {
    // Generate personalized recommendations based on user progress
    const newRecommendations = generateRecommendations(userProgress);
    setRecommendations(newRecommendations);
  }, [userProgress]);

  const analyzeCode = (code: string): LearningInsight[] => {
    // Simulate AI code analysis
    const mockInsights: LearningInsight[] = [
      {
        id: 'insight-1',
        type: 'pattern',
        title: 'Good Error Handling Pattern',
        description: 'You\'re using proper Result types for error handling. This is a best practice in Rust.',
        confidence: 0.95,
        relatedCode: 'Result<()>',
        resources: ['https://doc.rust-lang.org/book/ch09-00-error-handling.html']
      },
      {
        id: 'insight-2',
        type: 'suggestion',
        title: 'Consider Adding Input Validation',
        description: 'Add validation for the instruction data to prevent invalid inputs.',
        confidence: 0.87,
        relatedCode: 'instruction_data: &[u8]',
        resources: ['https://docs.solana.com/developing/programming-model/transactions']
      }
    ];

    return mockInsights;
  };

  const generateRecommendations = (progress: UserProgress): PersonalizedRecommendation[] => {
    const mockRecommendations: PersonalizedRecommendation[] = [
      {
        id: 'rec-1',
        type: 'tutorial',
        title: 'Advanced Anchor Patterns',
        description: 'Learn advanced Anchor framework patterns for complex applications.',
        reason: 'You\'ve mastered the basics, time to level up!',
        difficulty: 'intermediate',
        estimatedTime: 30,
        xpReward: 150,
        priority: 'high'
      },
      {
        id: 'rec-2',
        type: 'contract',
        title: 'DeFi Lending Protocol',
        description: 'Study a real-world lending protocol implementation.',
        reason: 'Based on your interest in DeFi concepts',
        difficulty: 'advanced',
        estimatedTime: 45,
        xpReward: 200,
        priority: 'medium'
      },
      {
        id: 'rec-3',
        type: 'challenge',
        title: 'Build a Token Vesting Contract',
        description: 'Create a contract that releases tokens over time.',
        reason: 'Great practice for time-based logic',
        difficulty: 'intermediate',
        estimatedTime: 25,
        xpReward: 100,
        priority: 'high'
      }
    ];

    return mockRecommendations;
  };

  const getLevelProgress = () => {
    const currentLevelXp = userProgress.level * 1000;
    const nextLevelXp = (userProgress.level + 1) * 1000;
    const progress = ((userProgress.totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'concept': return <BookOpen className="h-4 w-4" />;
      case 'pattern': return <Target className="h-4 w-4" />;
      case 'mistake': return <Lightbulb className="h-4 w-4" />;
      case 'suggestion': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'concept': return 'text-blue-400 bg-blue-400/20';
      case 'pattern': return 'text-green-400 bg-green-400/20';
      case 'mistake': return 'text-yellow-400 bg-yellow-400/20';
      case 'suggestion': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Learning Assistant</h3>
            <p className="text-sm text-gray-400">Personalized guidance for your Solana journey</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'recommendations', label: 'Learn', icon: Target },
          { id: 'insights', label: 'Insights', icon: Brain },
          { id: 'progress', label: 'Progress', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200',
              activeTab === tab.id
                ? 'bg-black text-white border-b-2 border-blue-600'
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Level Progress */}
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm font-medium text-white">Level {userProgress.level}</span>
                  </div>
                  <span className="text-sm text-gray-400">{userProgress.totalXp} XP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getLevelProgress()}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {Math.round(getLevelProgress())}% to Level {userProgress.level + 1}
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{userProgress.completedTutorials.length}</div>
                  <div className="text-xs text-gray-400">Tutorials</div>
                </div>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-4 text-center">
                  <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{userProgress.streak}</div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
              </Card>
            </div>

            {/* Current Learning Path */}
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-4">
                <h4 className="text-sm font-medium text-white mb-3">Current Learning Path</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    {userProgress.learningPath}
                  </span>
                  {userProgress.currentTutorial && (
                    <span className="text-sm text-gray-300">
                      Step {userProgress.currentStep || 1}
                    </span>
                  )}
                </div>
                {userProgress.currentTutorial && (
                  <div className="text-sm text-gray-400">
                    Currently learning: {userProgress.currentTutorial}
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-4">
                <h4 className="text-sm font-medium text-white mb-3">Recent Achievements</h4>
                <div className="space-y-2">
                  {userProgress.achievements.slice(-3).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Personalized Recommendations</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newRecs = generateRecommendations(userProgress);
                  setRecommendations(newRecs);
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {recommendations.map((rec) => (
              <Card key={rec.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="text-sm font-medium text-white">{rec.title}</h5>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getPriorityColor(rec.priority)
                        )}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{rec.description}</p>
                      <p className="text-xs text-blue-400">💡 {rec.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>{rec.estimatedTime} min</span>
                      <span>+{rec.xpReward} XP</span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs",
                        rec.difficulty === 'beginner' ? 'bg-green-400/20 text-green-400' :
                        rec.difficulty === 'intermediate' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-red-400/20 text-red-400'
                      )}>
                        {rec.difficulty}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onRecommendationClick(rec)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Code Insights</h4>
              {isAnalyzing && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  <span className="text-xs text-gray-400">Analyzing...</span>
                </div>
              )}
            </div>

            {insights.length === 0 && !isAnalyzing && (
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-6 text-center">
                  <Brain className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    Start coding to get AI insights about your Solana programs
                  </p>
                </div>
              </Card>
            )}

            {insights.map((insight) => (
              <Card key={insight.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      getInsightColor(insight.type)
                    )}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="text-sm font-medium text-white">{insight.title}</h5>
                        <span className="text-xs text-gray-400">
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{insight.description}</p>
                      {insight.relatedCode && (
                        <div className="bg-gray-900 p-2 rounded text-xs font-mono text-gray-300 mb-2">
                          {insight.relatedCode}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onInsightClick(insight)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Learning Statistics */}
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-4">
                <h4 className="text-sm font-medium text-white mb-4">Learning Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Time Spent</span>
                    <span className="text-sm text-white">{userProgress.timeSpent} minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Tutorials Completed</span>
                    <span className="text-sm text-white">{userProgress.completedTutorials.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Current Streak</span>
                    <span className="text-sm text-white">{userProgress.streak} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total XP</span>
                    <span className="text-sm text-white">{userProgress.totalXp}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProgress.strengths.map((strength, index) => (
                      <span key={index} className="px-2 py-1 bg-green-900/20 text-green-300 text-xs rounded">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Areas to Improve</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProgress.weaknesses.map((weakness, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-900/20 text-yellow-300 text-xs rounded">
                        {weakness}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Learning Path Progress */}
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-4">
                <h4 className="text-sm font-medium text-white mb-3">Learning Path Progress</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Current Path</span>
                    <span className="text-sm text-white capitalize">{userProgress.learningPath}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <div className="text-xs text-gray-400">65% complete</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { 
  BookOpen, 
  Play, 
  Award, 
  Users, 
  TrendingUp, 
  Clock,
  Star,
  Target,
  Zap,
  Brain,
  Code,
  Shield,
  Rocket,
  ChevronRight,
  CheckCircle,
  Circle,
  Lock
} from 'lucide-react';

interface LearningTrack {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: LearningModule[];
  progress: number;
  isLocked: boolean;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  concepts: string[];
}

export default function LearningDashboard() {
  const [selectedTrack, setSelectedTrack] = useState<string>('beginner');
  const [userProgress, setUserProgress] = useState({
    totalModules: 0,
    completedModules: 0,
    currentStreak: 0,
    totalTimeSpent: 0,
    achievements: 0
  });

  const learningTracks: LearningTrack[] = [
    {
      id: 'beginner',
      title: 'Beginner Track',
      description: 'Start your Solana journey with the fundamentals',
      difficulty: 'beginner',
      duration: '3 months',
      progress: 25,
      isLocked: false,
      modules: [
        {
          id: 'what-is-solana',
          title: 'What is Solana?',
          description: 'Understanding blockchain basics and Solana architecture',
          duration: '2 hours',
          isCompleted: true,
          isLocked: false,
          concepts: ['Blockchain', 'Accounts', 'Programs', 'Transactions']
        },
        {
          id: 'first-program',
          title: 'Your First Program',
          description: 'Write and deploy your first Solana program',
          duration: '3 hours',
          isCompleted: false,
          isLocked: false,
          concepts: ['Anchor', 'Rust', 'Program Structure', 'Deployment']
        },
        {
          id: 'understanding-accounts',
          title: 'Understanding Accounts',
          description: 'Learn how data is stored and managed on Solana',
          duration: '4 hours',
          isCompleted: false,
          isLocked: true,
          concepts: ['Account Model', 'Data Storage', 'Ownership', 'Rent']
        }
      ]
    },
    {
      id: 'intermediate',
      title: 'Intermediate Track',
      description: 'Build real-world applications with advanced patterns',
      difficulty: 'intermediate',
      duration: '6 months',
      progress: 0,
      isLocked: true,
      modules: [
        {
          id: 'advanced-patterns',
          title: 'Advanced Patterns',
          description: 'Learn PDAs, cross-program calls, and complex interactions',
          duration: '5 hours',
          isCompleted: false,
          isLocked: true,
          concepts: ['PDAs', 'Cross-program calls', 'Complex interactions']
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Track',
      description: 'Master Solana development and become a protocol expert',
      difficulty: 'advanced',
      duration: '9 months',
      progress: 0,
      isLocked: true,
      modules: [
        {
          id: 'defi-protocols',
          title: 'DeFi Protocols',
          description: 'Build complex DeFi applications like AMMs and lending',
          duration: '8 hours',
          isCompleted: false,
          isLocked: true,
          concepts: ['AMMs', 'Lending', 'Staking', 'Yield farming']
        }
      ]
    }
  ];

  const achievements = [
    { id: 'first-program', title: 'First Program', description: 'Deployed your first Solana program', icon: Rocket, isEarned: true },
    { id: 'week-streak', title: 'Week Streak', description: 'Learned for 7 days in a row', icon: Zap, isEarned: false },
    { id: 'community-helper', title: 'Community Helper', description: 'Helped 5 other learners', icon: Users, isEarned: false },
    { id: 'security-expert', title: 'Security Expert', description: 'Completed all security modules', icon: Shield, isEarned: false }
  ];

  const currentTrack = learningTracks.find(track => track.id === selectedTrack);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🎓</span>
            </div>
            <span className="text-2xl font-bold text-white">
              Solana Learning Platform
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-white/60">Learning Streak</p>
              <p className="text-2xl font-bold text-white">{userProgress.currentStreak} days</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Welcome to Your Learning Journey! 🚀
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Master Solana development with our AI-powered learning platform. 
            Learn at your own pace with interactive tutorials, real-time guidance, and community support.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Modules Completed</p>
                  <p className="text-3xl font-bold text-white">{userProgress.completedModules}/{userProgress.totalModules}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Time Spent</p>
                  <p className="text-3xl font-bold text-white">{userProgress.totalTimeSpent}h</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Achievements</p>
                  <p className="text-3xl font-bold text-white">{userProgress.achievements}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-white">{userProgress.currentStreak}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Learning Tracks */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Learning Tracks</h2>
              <div className="flex space-x-2">
                {learningTracks.map((track) => (
                  <Button
                    key={track.id}
                    variant={selectedTrack === track.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTrack(track.id)}
                    className={selectedTrack === track.id ? "bg-blue-600" : "border-gray-600 text-gray-300"}
                  >
                    {getDifficultyText(track.difficulty)}
                  </Button>
                ))}
              </div>
            </div>

            {currentTrack && (
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-gray-700 bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white">{currentTrack.title}</CardTitle>
                      <CardDescription className="text-gray-300 mt-2">
                        {currentTrack.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getDifficultyColor(currentTrack.difficulty)}`}></div>
                      <span className="text-sm text-gray-400">{getDifficultyText(currentTrack.difficulty)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-white font-semibold">{currentTrack.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${currentTrack.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {currentTrack.modules.map((module, index) => (
                      <div key={module.id} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                        <div className="flex-shrink-0">
                          {module.isCompleted ? (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          ) : module.isLocked ? (
                            <Lock className="h-6 w-6 text-gray-400" />
                          ) : (
                            <Circle className="h-6 w-6 text-white/40" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                          <p className="text-sm text-gray-300 mb-2">{module.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{module.duration}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Code className="h-3 w-3" />
                              <span>{module.concepts.length} concepts</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {module.isLocked ? (
                            <Button variant="outline" size="sm" disabled className="border-gray-600 text-gray-400">
                              Locked
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {module.isCompleted ? 'Review' : 'Start'}
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Achievements & Quick Actions */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Achievements</h2>
            <div className="space-y-4 mb-8">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card 
                    key={achievement.id} 
                    className={`bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden ${
                      achievement.isEarned ? 'ring-2 ring-yellow-400/50' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          achievement.isEarned ? 'bg-yellow-400/20' : 'bg-gray-700'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            achievement.isEarned ? 'text-yellow-400' : 'text-white/40'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${
                            achievement.isEarned ? 'text-yellow-400' : 'text-white'
                          }`}>
                            {achievement.title}
                          </h3>
                          <p className="text-xs text-gray-400">{achievement.description}</p>
                        </div>
                        {achievement.isEarned && (
                          <Star className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-gray-700 bg-gray-800/50">
                <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800">
                    <Users className="h-4 w-4 mr-2" />
                    Join Study Group
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Tutorials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

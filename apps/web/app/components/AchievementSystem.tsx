'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Clock, 
  Users, 
  Code, 
  BookOpen,
  Award,
  Flame,
  Crown,
  Shield,
  Rocket,
  CheckCircle,
  Lock,
  Gift,
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: 'learning' | 'coding' | 'community' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  requirements: {
    type: 'tutorials_completed' | 'code_lines' | 'days_streak' | 'deployments' | 'community_help' | 'special';
    value: number;
    description: string;
  };
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'code' | 'learn' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  timeLimit: number; // in minutes
  completed: boolean;
  expiresAt: Date;
  requirements: string[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  achievements: number;
  isCurrentUser: boolean;
}

interface AchievementSystemProps {
  userXp: number;
  userLevel: number;
  userStreak: number;
  onAchievementUnlocked: (achievement: Achievement) => void;
  onChallengeCompleted: (challenge: DailyChallenge) => void;
}

export default function AchievementSystem({
  userXp,
  userLevel,
  userStreak,
  onAchievementUnlocked,
  onChallengeCompleted
}: AchievementSystemProps) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges' | 'leaderboard'>('achievements');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showUnlockedAnimation, setShowUnlockedAnimation] = useState<Achievement | null>(null);

  useEffect(() => {
    // Load achievements
    const mockAchievements: Achievement[] = [
      {
        id: 'first-program',
        title: 'First Program',
        description: 'Deploy your first Solana program',
        icon: Rocket,
        category: 'coding',
        rarity: 'common',
        xpReward: 100,
        requirements: {
          type: 'deployments',
          value: 1,
          description: 'Deploy 1 program'
        },
        unlocked: true,
        unlockedAt: new Date('2024-01-15'),
        progress: 100
      },
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: Flame,
        category: 'learning',
        rarity: 'rare',
        xpReward: 250,
        requirements: {
          type: 'days_streak',
          value: 7,
          description: '7-day streak'
        },
        unlocked: true,
        unlockedAt: new Date('2024-01-20'),
        progress: 100
      },
      {
        id: 'code-master',
        title: 'Code Master',
        description: 'Write 1000 lines of Solana code',
        icon: Code,
        category: 'coding',
        rarity: 'epic',
        xpReward: 500,
        requirements: {
          type: 'code_lines',
          value: 1000,
          description: 'Write 1000 lines of code'
        },
        unlocked: false,
        progress: 65
      },
      {
        id: 'tutorial-completer',
        title: 'Tutorial Completer',
        description: 'Complete 10 tutorials',
        icon: BookOpen,
        category: 'learning',
        rarity: 'rare',
        xpReward: 300,
        requirements: {
          type: 'tutorials_completed',
          value: 10,
          description: 'Complete 10 tutorials'
        },
        unlocked: false,
        progress: 30
      },
      {
        id: 'community-helper',
        title: 'Community Helper',
        description: 'Help 5 other developers',
        icon: Users,
        category: 'community',
        rarity: 'epic',
        xpReward: 400,
        requirements: {
          type: 'community_help',
          value: 5,
          description: 'Help 5 developers'
        },
        unlocked: false,
        progress: 0
      },
      {
        id: 'legendary-builder',
        title: 'Legendary Builder',
        description: 'Deploy 50 programs and maintain a 30-day streak',
        icon: Crown,
        category: 'special',
        rarity: 'legendary',
        xpReward: 1000,
        requirements: {
          type: 'special',
          value: 1,
          description: 'Deploy 50 programs + 30-day streak'
        },
        unlocked: false,
        progress: 15
      }
    ];
    setAchievements(mockAchievements);

    // Load daily challenges
    const mockChallenges: DailyChallenge[] = [
      {
        id: 'daily-1',
        title: 'Build a Counter Program',
        description: 'Create and deploy a simple counter program using Anchor',
        type: 'code',
        difficulty: 'easy',
        xpReward: 50,
        timeLimit: 30,
        completed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        requirements: ['Use Anchor framework', 'Include increment function', 'Deploy to devnet']
      },
      {
        id: 'daily-2',
        title: 'Learn About PDAs',
        description: 'Complete the Program Derived Addresses tutorial',
        type: 'learn',
        difficulty: 'medium',
        xpReward: 75,
        timeLimit: 45,
        completed: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        requirements: ['Watch tutorial video', 'Complete quiz', 'Build example program']
      },
      {
        id: 'daily-3',
        title: 'Help a Fellow Developer',
        description: 'Answer a question in the community forum',
        type: 'community',
        difficulty: 'easy',
        xpReward: 25,
        timeLimit: 15,
        completed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        requirements: ['Post helpful answer', 'Get upvoted', 'Follow up with user']
      }
    ];
    setDailyChallenges(mockChallenges);

    // Load leaderboard
    const mockLeaderboard: LeaderboardEntry[] = [
      { rank: 1, username: 'SolanaMaster', avatar: '/avatars/1.png', xp: 15420, level: 15, streak: 45, achievements: 23, isCurrentUser: false },
      { rank: 2, username: 'DeFiBuilder', avatar: '/avatars/2.png', xp: 12850, level: 12, streak: 32, achievements: 19, isCurrentUser: false },
      { rank: 3, username: 'You', avatar: '/avatars/current.png', xp: 8750, level: 8, streak: 7, achievements: 12, isCurrentUser: true },
      { rank: 4, username: 'RustDev', avatar: '/avatars/4.png', xp: 7200, level: 7, streak: 15, achievements: 10, isCurrentUser: false },
      { rank: 5, username: 'BlockchainNewbie', avatar: '/avatars/5.png', xp: 6800, level: 6, streak: 5, achievements: 8, isCurrentUser: false }
    ];
    setLeaderboard(mockLeaderboard);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-400/20';
      case 'rare': return 'text-blue-400 bg-blue-400/20';
      case 'epic': return 'text-purple-400 bg-purple-400/20';
      case 'legendary': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return BookOpen;
      case 'coding': return Code;
      case 'community': return Users;
      case 'special': return Crown;
      default: return Trophy;
    }
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleChallengeStart = (challenge: DailyChallenge) => {
    console.log('Starting challenge:', challenge.title);
    // In real implementation, start the challenge
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Achievements</h3>
            <p className="text-sm text-gray-400">Track your progress and compete</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {[
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'challenges', label: 'Daily', icon: Calendar },
          { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200',
              activeTab === tab.id
                ? 'bg-black text-white border-b-2 border-yellow-600'
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
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{achievements.filter(a => a.unlocked).length}</div>
                  <div className="text-xs text-gray-400">Unlocked</div>
                </div>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{achievements.length}</div>
                  <div className="text-xs text-gray-400">Total</div>
                </div>
              </Card>
            </div>

            {/* Achievements List */}
            <div className="space-y-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                const CategoryIcon = getCategoryIcon(achievement.category);
                
                return (
                  <Card key={achievement.id} className={cn(
                    "border transition-all duration-300",
                    achievement.unlocked 
                      ? "bg-gray-800 border-gray-600" 
                      : "bg-gray-800/50 border-gray-700"
                  )}>
                    <div className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center",
                          achievement.unlocked 
                            ? "bg-yellow-600" 
                            : "bg-gray-700"
                        )}>
                          <Icon className={cn(
                            "h-6 w-6",
                            achievement.unlocked ? "text-white" : "text-gray-400"
                          )} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={cn(
                              "text-sm font-medium",
                              achievement.unlocked ? "text-white" : "text-gray-400"
                            )}>
                              {achievement.title}
                            </h4>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              getRarityColor(achievement.rarity)
                            )}>
                              {achievement.rarity}
                            </span>
                            {achievement.unlocked && (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            )}
                          </div>
                          
                          <p className={cn(
                            "text-sm mb-2",
                            achievement.unlocked ? "text-gray-300" : "text-gray-500"
                          )}>
                            {achievement.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-400">
                              <div className="flex items-center space-x-1">
                                <CategoryIcon className="h-3 w-3" />
                                <span>{achievement.category}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3" />
                                <span>+{achievement.xpReward} XP</span>
                              </div>
                            </div>
                            
                            {achievement.unlocked && achievement.unlockedAt && (
                              <div className="text-xs text-gray-400">
                                {achievement.unlockedAt.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          
                          {!achievement.unlocked && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                <span>{achievement.requirements.description}</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${achievement.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-white mb-2">Daily Challenges</h4>
              <p className="text-sm text-gray-400">Complete challenges to earn bonus XP</p>
            </div>

            {dailyChallenges.map((challenge) => (
              <Card key={challenge.id} className={cn(
                "border transition-all duration-300",
                challenge.completed 
                  ? "bg-green-900/20 border-green-700" 
                  : "bg-gray-800 border-gray-700"
              )}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-white">{challenge.title}</h4>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getDifficultyColor(challenge.difficulty)
                        )}>
                          {challenge.difficulty}
                        </span>
                        {challenge.completed && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{challenge.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{challenge.timeLimit} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>+{challenge.xpReward} XP</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTimeRemaining(challenge.expiresAt)} left</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">Requirements:</div>
                    <div className="flex flex-wrap gap-1">
                      {challenge.requirements.map((req, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleChallengeStart(challenge)}
                    disabled={challenge.completed}
                    className={cn(
                      "w-full",
                      challenge.completed 
                        ? "bg-green-600 text-white" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    {challenge.completed ? 'Completed' : 'Start Challenge'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-white mb-2">Weekly Leaderboard</h4>
              <p className="text-sm text-gray-400">Compete with other developers</p>
            </div>

            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <Card key={entry.rank} className={cn(
                  "border transition-all duration-300",
                  entry.isCurrentUser 
                    ? "bg-blue-900/20 border-blue-700" 
                    : "bg-gray-800 border-gray-700"
                )}>
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white font-bold text-sm">
                        {entry.rank}
                      </div>
                      
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {entry.username[0].toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-white">{entry.username}</h4>
                          {entry.isCurrentUser && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>Level {entry.level}</span>
                          <span>{entry.xp} XP</span>
                          <span>{entry.streak} day streak</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{entry.achievements}</div>
                        <div className="text-xs text-gray-400">achievements</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Achievement Unlocked Animation */}
      {showUnlockedAnimation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-yellow-600 p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Achievement Unlocked!</h3>
              <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                {showUnlockedAnimation.title}
              </h4>
              <p className="text-gray-400 mb-4">{showUnlockedAnimation.description}</p>
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <Star className="h-5 w-5" />
                <span className="font-medium">+{showUnlockedAnimation.xpReward} XP</span>
              </div>
              <Button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowUnlockedAnimation(null)}
              >
                Awesome!
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

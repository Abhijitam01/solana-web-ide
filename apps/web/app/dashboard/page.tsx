'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import ResourceCards from '../components/ResourceCards';
import TutorialSection from '../components/TutorialSection';
import { 
  Plus, 
  Code, 
  Play, 
  Download, 
  Star, 
  Clock, 
  Users,
  TrendingUp,
  Zap,
  Bot,
  BookOpen,
  Settings,
  LogOut
} from 'lucide-react';

interface Game {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  lastPlayed: string;
  progress: number;
  players: number;
}

export default function DashboardPage() {
  const [games, setGames] = useState<Game[]>([
    {
      id: '1',
      name: 'Solana Counter Game',
      description: 'A simple counter program with increment/decrement functionality',
      status: 'active',
      lastPlayed: '2 hours ago',
      progress: 75,
      players: 12
    },
    {
      id: '2',
      name: 'NFT Marketplace',
      description: 'Complete NFT marketplace with minting and trading',
      status: 'paused',
      lastPlayed: '1 day ago',
      progress: 45,
      players: 8
    },
    {
      id: '3',
      name: 'DeFi Lending Protocol',
      description: 'Decentralized lending and borrowing platform',
      status: 'completed',
      lastPlayed: '3 days ago',
      progress: 100,
      players: 25
    }
  ]);

  const stats = [
    { label: 'Total Games', value: '12', icon: Code, change: '+2 this week' },
    { label: 'Active Players', value: '156', icon: Users, change: '+12% from last month' },
    { label: 'Games Completed', value: '8', icon: Star, change: '+3 this month' },
    { label: 'Avg. Play Time', value: '2.4h', icon: Clock, change: '+15% from last week' }
  ];

  const quickActions = [
    { title: 'Create New Game', description: 'Start building a new Solana program', icon: Plus, action: () => console.log('Create game') },
    { title: 'AI Assistant', description: 'Get help with your code', icon: Bot, action: () => console.log('AI Assistant') },
    { title: 'Documentation', description: 'Learn Solana development', icon: BookOpen, action: () => console.log('Documentation') },
    { title: 'Settings', description: 'Configure your workspace', icon: Settings, action: () => console.log('Settings') }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Solana AI IDE
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Welcome back, Developer! 👋
          </h1>
          <p className="text-xl text-white/70">Here's what's happening with your Solana programs today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/60 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-xs text-green-400">{stat.change}</p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Games List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Your Games</h2>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                New Game
              </Button>
            </div>

            <div className="space-y-6">
              {games.map((game) => (
                <div key={game.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-bold text-white">{game.name}</h3>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(game.status)}`}></div>
                            <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">{getStatusText(game.status)}</span>
                          </div>
                          <p className="text-white/70 mb-4 leading-relaxed">{game.description}</p>
                          
                          <div className="flex items-center space-x-8 text-sm text-white/50 mb-6">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Last played {game.lastPlayed}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{game.players} players</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/80">Progress</span>
                          <span className="text-white font-semibold">{game.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${game.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Deploy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-white">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div key={index} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Card 
                      className="relative cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105" 
                      onClick={action.action}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">{action.title}</h3>
                            <p className="text-sm text-white/60">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <Card className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/10 bg-white/5">
                <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">Deployed Counter Game</p>
                      <p className="text-xs text-white/50">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">Completed NFT Marketplace</p>
                      <p className="text-xs text-white/50">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">Started DeFi Protocol</p>
                      <p className="text-xs text-white/50">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resources & Tutorials Section */}
        <div className="mt-16 space-y-16">
          {/* Resources */}
          <ResourceCards />
          
          {/* Tutorials */}
          <TutorialSection />
        </div>
      </div>
    </div>
  );
}

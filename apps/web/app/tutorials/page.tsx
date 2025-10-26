'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  BookOpen, 
  Play, 
  Star, 
  Clock, 
  Target, 
  TrendingUp,
  Filter,
  Search,
  ChevronRight,
  Award,
  Users,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import InteractiveTutorial from '../components/InteractiveTutorial';
import ContractLibrary from '../components/ContractLibrary';
import LearningAssistant from '../components/LearningAssistant';
import { Tutorial, TutorialProgress } from '../components/InteractiveTutorial';
import { Contract } from '../components/ContractLibrary';
import { UserProgress } from '../components/LearningAssistant';
import { sampleTutorials } from '../data/tutorials';

export default function TutorialsPage() {
  const [activeView, setActiveView] = useState<'tutorials' | 'contracts' | 'assistant'>('tutorials');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mock user progress - in real implementation, this would come from user context
  const userProgress: UserProgress = {
    userId: 'user-123',
    completedTutorials: ['solana-basics-1'],
    currentTutorial: 'anchor-basics-1',
    currentStep: 2,
    totalXp: 1250,
    level: 3,
    streak: 7,
    lastActive: new Date(),
    learningPath: 'intermediate',
    strengths: ['Error Handling', 'Account Management', 'Basic Rust'],
    weaknesses: ['Advanced Patterns', 'Security Best Practices', 'Testing'],
    timeSpent: 180,
    achievements: ['First Program', 'Counter Master', 'Week Warrior']
  };

  const categories = [
    { id: 'all', name: 'All Categories', count: sampleTutorials.length },
    { id: 'basics', name: 'Basics', count: sampleTutorials.filter(t => t.category === 'basics').length },
    { id: 'anchor', name: 'Anchor', count: sampleTutorials.filter(t => t.category === 'anchor').length },
    { id: 'defi', name: 'DeFi', count: sampleTutorials.filter(t => t.category === 'defi').length },
    { id: 'nft', name: 'NFTs', count: sampleTutorials.filter(t => t.category === 'nft').length }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels', count: sampleTutorials.length },
    { id: 'beginner', name: 'Beginner', count: sampleTutorials.filter(t => t.difficulty === 'beginner').length },
    { id: 'intermediate', name: 'Intermediate', count: sampleTutorials.filter(t => t.difficulty === 'intermediate').length },
    { id: 'advanced', name: 'Advanced', count: sampleTutorials.filter(t => t.difficulty === 'advanced').length }
  ];

  const filteredTutorials = sampleTutorials.filter(tutorial => {
    const matchesSearch = searchQuery === '' || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleTutorialStart = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
  };

  const handleTutorialComplete = (tutorial: Tutorial, progress: TutorialProgress[]) => {
    console.log('Tutorial completed:', tutorial.title, progress);
    setSelectedTutorial(null);
    // In real implementation, update user progress
  };

  const handleStepComplete = (step: any, progress: TutorialProgress) => {
    console.log('Step completed:', step.title, progress);
    // In real implementation, update step progress
  };

  const handleContractImport = (contract: Contract) => {
    console.log('Importing contract:', contract.name);
    // In real implementation, import contract to IDE
  };

  const handleContractView = (contract: Contract) => {
    console.log('Viewing contract:', contract.name);
    // In real implementation, open contract in viewer
  };

  const handleContractRun = (contract: Contract) => {
    console.log('Running contract:', contract.name);
    // In real implementation, run contract in sandbox
  };

  const handleRecommendationClick = (recommendation: any) => {
    console.log('Starting recommendation:', recommendation.title);
    // In real implementation, start recommended content
  };

  const handleInsightClick = (insight: any) => {
    console.log('Viewing insight:', insight.title);
    // In real implementation, show detailed insight
  };

  if (selectedTutorial) {
    return (
      <div className="h-screen bg-black">
        <InteractiveTutorial
          tutorial={selectedTutorial}
          onComplete={handleTutorialComplete}
          onStepComplete={handleStepComplete}
          userProgress={[]}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Learning Hub</h1>
            <p className="text-gray-400">Master Solana development with interactive tutorials and real-world examples</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Level {userProgress.level}</div>
              <div className="text-lg font-bold text-white">{userProgress.totalXp} XP</div>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
            { id: 'contracts', label: 'Contract Library', icon: Target },
            { id: 'assistant', label: 'AI Assistant', icon: Zap }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                activeView === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'tutorials' && (
          <div className="h-full flex">
            {/* Left Panel - Tutorial List */}
            <div className="w-1/2 border-r border-gray-800 p-6 overflow-y-auto">
              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tutorials..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty.id} value={difficulty.id}>
                        {difficulty.name} ({difficulty.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tutorial List */}
              <div className="space-y-4">
                {filteredTutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                    <div className="p-4" onClick={() => handleTutorialStart(tutorial)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{tutorial.title}</h3>
                          <p className="text-sm text-gray-400 line-clamp-2">{tutorial.description}</p>
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getDifficultyColor(tutorial.difficulty)
                        )}>
                          {tutorial.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{tutorial.estimatedTime} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{tutorial.steps.length} steps</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>+{tutorial.xpReward} XP</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                            {tutorial.category}
                          </span>
                          {tutorial.badge && (
                            <span className="px-2 py-1 bg-blue-900/20 text-blue-300 text-xs rounded">
                              {tutorial.badge}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
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
            </div>

            {/* Right Panel - Learning Assistant */}
            <div className="w-1/2">
              <LearningAssistant
                userProgress={userProgress}
                onRecommendationClick={handleRecommendationClick}
                onInsightClick={handleInsightClick}
              />
            </div>
          </div>
        )}

        {activeView === 'contracts' && (
          <ContractLibrary
            onImportContract={handleContractImport}
            onViewContract={handleContractView}
            onRunContract={handleContractRun}
          />
        )}

        {activeView === 'assistant' && (
          <div className="h-full flex">
            <div className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">AI Learning Assistant</h2>
                  <p className="text-gray-400">
                    Get personalized recommendations and insights to accelerate your Solana development journey
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-900 border-gray-700">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Learning Progress</h3>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Track your progress and get insights into your learning patterns
                      </p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        View Progress
                      </Button>
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Personalized Recommendations</h3>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Get AI-powered suggestions based on your current skill level and interests
                      </p>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        Get Recommendations
                      </Button>
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Code Insights</h3>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Get real-time feedback and suggestions as you write Solana programs
                      </p>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        Analyze Code
                      </Button>
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Community Learning</h3>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Connect with other learners and get help from the community
                      </p>
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                        Join Community
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

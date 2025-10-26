'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Star, 
  Download, 
  Eye, 
  Play, 
  Code, 
  Shield, 
  Zap,
  Users,
  Database,
  Target,
  BookOpen,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  GitBranch,
  Package
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RealWorldTemplate {
  id: string;
  name: string;
  description: string;
  category: 'nft' | 'defi' | 'dao' | 'gaming' | 'social' | 'infrastructure';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in hours
  features: string[];
  techStack: string[];
  architecture: {
    programs: number;
    accounts: number;
    instructions: number;
    complexity: 'simple' | 'moderate' | 'complex';
  };
  deployment: {
    networks: ('devnet' | 'testnet' | 'mainnet')[];
    verified: boolean;
    explorerUrl?: string;
  };
  documentation: {
    setup: string;
    architecture: string;
    api: string;
    examples: string;
  };
  code: {
    program: string;
    client: string;
    tests: string;
    deployment: string;
  };
  stats: {
    downloads: number;
    stars: number;
    forks: number;
    lastUpdated: Date;
  };
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    github: string;
  };
  tags: string[];
  requirements: string[];
  screenshots: string[];
  videoUrl?: string;
  liveDemo?: string;
  price: 'free' | 'premium';
  license: string;
}

interface RealWorldTemplatesProps {
  onTemplateSelect: (template: RealWorldTemplate) => void;
  onTemplatePreview: (template: RealWorldTemplate) => void;
  onTemplateDeploy: (template: RealWorldTemplate) => void;
}

export default function RealWorldTemplates({
  onTemplateSelect,
  onTemplatePreview,
  onTemplateDeploy
}: RealWorldTemplatesProps) {
  const [templates, setTemplates] = useState<RealWorldTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  useEffect(() => {
    // Mock templates - in real implementation, these would come from an API
    const mockTemplates: RealWorldTemplate[] = [
      {
        id: 'nft-marketplace',
        name: 'NFT Marketplace',
        description: 'Complete NFT marketplace with minting, listing, buying, and auction functionality. Built with Anchor and React.',
        category: 'nft',
        difficulty: 'advanced',
        estimatedTime: 8,
        features: [
          'NFT Minting with Metadata',
          'Marketplace Listings',
          'Auction System',
          'Royalty Management',
          'Collection Management',
          'Search & Filtering',
          'User Profiles',
          'Analytics Dashboard'
        ],
        techStack: ['Anchor', 'React', 'TypeScript', 'Metaplex', 'IPFS'],
        architecture: {
          programs: 3,
          accounts: 15,
          instructions: 25,
          complexity: 'complex'
        },
        deployment: {
          networks: ['devnet', 'testnet', 'mainnet'],
          verified: true,
          explorerUrl: 'https://explorer.solana.com/address/...'
        },
        documentation: {
          setup: 'https://docs.example.com/nft-marketplace/setup',
          architecture: 'https://docs.example.com/nft-marketplace/architecture',
          api: 'https://docs.example.com/nft-marketplace/api',
          examples: 'https://docs.example.com/nft-marketplace/examples'
        },
        code: {
          program: 'anchor build && anchor deploy',
          client: 'npm install && npm run dev',
          tests: 'anchor test',
          deployment: 'anchor deploy --provider.cluster mainnet'
        },
        stats: {
          downloads: 1250,
          stars: 89,
          forks: 23,
          lastUpdated: new Date('2024-01-20')
        },
        author: {
          name: 'Metaplex Team',
          avatar: '/avatars/metaplex.png',
          verified: true,
          github: 'metaplex-foundation'
        },
        tags: ['nft', 'marketplace', 'metaplex', 'anchor', 'react'],
        requirements: ['Node.js 16+', 'Anchor 0.28+', 'Solana CLI 1.14+'],
        screenshots: ['/screenshots/nft-marketplace-1.png', '/screenshots/nft-marketplace-2.png'],
        videoUrl: 'https://youtube.com/watch?v=...',
        liveDemo: 'https://nft-marketplace-demo.vercel.app',
        price: 'free',
        license: 'MIT'
      },
      {
        id: 'dex-protocol',
        name: 'DEX Protocol',
        description: 'Automated Market Maker (AMM) with liquidity pools, token swaps, and yield farming. Inspired by Uniswap V3.',
        category: 'defi',
        difficulty: 'advanced',
        estimatedTime: 12,
        features: [
          'Concentrated Liquidity',
          'Multiple Fee Tiers',
          'Liquidity Mining',
          'Price Oracle Integration',
          'Flash Swaps',
          'Governance Token',
          'Fee Distribution',
          'Multi-hop Swaps'
        ],
        techStack: ['Anchor', 'React', 'TypeScript', 'Pyth', 'Jupiter'],
        architecture: {
          programs: 5,
          accounts: 25,
          instructions: 40,
          complexity: 'complex'
        },
        deployment: {
          networks: ['devnet', 'testnet'],
          verified: true
        },
        documentation: {
          setup: 'https://docs.example.com/dex/setup',
          architecture: 'https://docs.example.com/dex/architecture',
          api: 'https://docs.example.com/dex/api',
          examples: 'https://docs.example.com/dex/examples'
        },
        code: {
          program: 'anchor build && anchor deploy',
          client: 'npm install && npm run dev',
          tests: 'anchor test',
          deployment: 'anchor deploy --provider.cluster testnet'
        },
        stats: {
          downloads: 890,
          stars: 156,
          forks: 45,
          lastUpdated: new Date('2024-01-18')
        },
        author: {
          name: 'DeFi Builder',
          avatar: '/avatars/defi-builder.png',
          verified: false,
          github: 'defi-builder'
        },
        tags: ['defi', 'dex', 'amm', 'liquidity', 'yield-farming'],
        requirements: ['Node.js 16+', 'Anchor 0.28+', 'Rust 1.70+'],
        screenshots: ['/screenshots/dex-1.png', '/screenshots/dex-2.png'],
        price: 'premium',
        license: 'Commercial'
      },
      {
        id: 'dao-governance',
        name: 'DAO Governance',
        description: 'Decentralized governance system with voting, proposals, and treasury management. Built for community-driven projects.',
        category: 'dao',
        difficulty: 'intermediate',
        estimatedTime: 6,
        features: [
          'Proposal Creation',
          'Voting System',
          'Treasury Management',
          'Member Management',
          'Quorum Requirements',
          'Execution Delays',
          'Multi-sig Support',
          'Governance Analytics'
        ],
        techStack: ['Anchor', 'React', 'TypeScript', 'Spl-Governance'],
        architecture: {
          programs: 2,
          accounts: 12,
          instructions: 18,
          complexity: 'moderate'
        },
        deployment: {
          networks: ['devnet', 'testnet', 'mainnet'],
          verified: true
        },
        documentation: {
          setup: 'https://docs.example.com/dao/setup',
          architecture: 'https://docs.example.com/dao/architecture',
          api: 'https://docs.example.com/dao/api',
          examples: 'https://docs.example.com/dao/examples'
        },
        code: {
          program: 'anchor build && anchor deploy',
          client: 'npm install && npm run dev',
          tests: 'anchor test',
          deployment: 'anchor deploy --provider.cluster mainnet'
        },
        stats: {
          downloads: 650,
          stars: 78,
          forks: 19,
          lastUpdated: new Date('2024-01-15')
        },
        author: {
          name: 'Governance Labs',
          avatar: '/avatars/governance-labs.png',
          verified: true,
          github: 'governance-labs'
        },
        tags: ['dao', 'governance', 'voting', 'treasury', 'community'],
        requirements: ['Node.js 16+', 'Anchor 0.28+', 'Solana CLI 1.14+'],
        screenshots: ['/screenshots/dao-1.png', '/screenshots/dao-2.png'],
        price: 'free',
        license: 'MIT'
      },
      {
        id: 'lending-protocol',
        name: 'Lending Protocol',
        description: 'Decentralized lending and borrowing protocol with collateral management and interest rate models.',
        category: 'defi',
        difficulty: 'advanced',
        estimatedTime: 10,
        features: [
          'Collateralized Lending',
          'Interest Rate Models',
          'Liquidation System',
          'Multi-asset Support',
          'Risk Management',
          'Oracle Integration',
          'Governance Token',
          'Flash Loans'
        ],
        techStack: ['Anchor', 'React', 'TypeScript', 'Pyth', 'Switchboard'],
        architecture: {
          programs: 4,
          accounts: 20,
          instructions: 35,
          complexity: 'complex'
        },
        deployment: {
          networks: ['devnet', 'testnet'],
          verified: true
        },
        documentation: {
          setup: 'https://docs.example.com/lending/setup',
          architecture: 'https://docs.example.com/lending/architecture',
          api: 'https://docs.example.com/lending/api',
          examples: 'https://docs.example.com/lending/examples'
        },
        code: {
          program: 'anchor build && anchor deploy',
          client: 'npm install && npm run dev',
          tests: 'anchor test',
          deployment: 'anchor deploy --provider.cluster testnet'
        },
        stats: {
          downloads: 720,
          stars: 134,
          forks: 32,
          lastUpdated: new Date('2024-01-12')
        },
        author: {
          name: 'Lending Protocol Team',
          avatar: '/avatars/lending-team.png',
          verified: true,
          github: 'lending-protocol'
        },
        tags: ['defi', 'lending', 'borrowing', 'collateral', 'liquidation'],
        requirements: ['Node.js 16+', 'Anchor 0.28+', 'Rust 1.70+'],
        screenshots: ['/screenshots/lending-1.png', '/screenshots/lending-2.png'],
        price: 'premium',
        license: 'Commercial'
      },
      {
        id: 'play-to-earn-game',
        name: 'Play-to-Earn Game',
        description: 'Complete P2E game infrastructure with NFT characters, battle system, and reward distribution.',
        category: 'gaming',
        difficulty: 'advanced',
        estimatedTime: 15,
        features: [
          'NFT Characters',
          'Battle System',
          'Reward Distribution',
          'Leaderboards',
          'Tournament System',
          'Marketplace Integration',
          'Achievement System',
          'Social Features'
        ],
        techStack: ['Anchor', 'React', 'TypeScript', 'Unity', 'Metaplex'],
        architecture: {
          programs: 6,
          accounts: 30,
          instructions: 50,
          complexity: 'complex'
        },
        deployment: {
          networks: ['devnet', 'testnet'],
          verified: true
        },
        documentation: {
          setup: 'https://docs.example.com/p2e-game/setup',
          architecture: 'https://docs.example.com/p2e-game/architecture',
          api: 'https://docs.example.com/p2e-game/api',
          examples: 'https://docs.example.com/p2e-game/examples'
        },
        code: {
          program: 'anchor build && anchor deploy',
          client: 'npm install && npm run dev',
          tests: 'anchor test',
          deployment: 'anchor deploy --provider.cluster testnet'
        },
        stats: {
          downloads: 450,
          stars: 67,
          forks: 15,
          lastUpdated: new Date('2024-01-10')
        },
        author: {
          name: 'Game Studio',
          avatar: '/avatars/game-studio.png',
          verified: false,
          github: 'game-studio'
        },
        tags: ['gaming', 'p2e', 'nft', 'battle', 'rewards'],
        requirements: ['Node.js 16+', 'Anchor 0.28+', 'Unity 2022+'],
        screenshots: ['/screenshots/p2e-1.png', '/screenshots/p2e-2.png'],
        price: 'premium',
        license: 'Commercial'
      }
    ];

    setTemplates(mockTemplates);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories', count: templates.length },
    { id: 'nft', name: 'NFT', count: templates.filter(t => t.category === 'nft').length },
    { id: 'defi', name: 'DeFi', count: templates.filter(t => t.category === 'defi').length },
    { id: 'dao', name: 'DAO', count: templates.filter(t => t.category === 'dao').length },
    { id: 'gaming', name: 'Gaming', count: templates.filter(t => t.category === 'gaming').length },
    { id: 'social', name: 'Social', count: templates.filter(t => t.category === 'social').length },
    { id: 'infrastructure', name: 'Infrastructure', count: templates.filter(t => t.category === 'infrastructure').length }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels', count: templates.length },
    { id: 'beginner', name: 'Beginner', count: templates.filter(t => t.difficulty === 'beginner').length },
    { id: 'intermediate', name: 'Intermediate', count: templates.filter(t => t.difficulty === 'intermediate').length },
    { id: 'advanced', name: 'Advanced', count: templates.filter(t => t.difficulty === 'advanced').length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.stats.downloads - a.stats.downloads;
      case 'stars':
        return b.stats.stars - a.stats.stars;
      case 'newest':
        return b.stats.lastUpdated.getTime() - a.stats.lastUpdated.getTime();
      case 'time':
        return a.estimatedTime - b.estimatedTime;
      default:
        return 0;
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nft': return <Star className="h-4 w-4" />;
      case 'defi': return <TrendingUp className="h-4 w-4" />;
      case 'dao': return <Users className="h-4 w-4" />;
      case 'gaming': return <Target className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'infrastructure': return <Database className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
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

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'complex': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Real-World Templates</h1>
            <p className="text-gray-400">Production-ready Solana applications to learn from and build upon</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              {filteredTemplates.length} templates
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates by name, description, or tags..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
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

            {/* Difficulty Filter */}
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

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="popular">Most Popular</option>
              <option value="stars">Most Stars</option>
              <option value="newest">Newest</option>
              <option value="time">Quickest to Build</option>
            </select>

            {/* Price Filter */}
            <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="all">All Prices</option>
              <option value="free">Free Only</option>
              <option value="premium">Premium Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getCategoryIcon(template.category)}
                      <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                      {template.author.verified && (
                        <Shield className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{template.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getDifficultyColor(template.difficulty)
                    )}>
                      {template.difficulty}
                    </span>
                    <span className={cn(
                      "text-xs font-medium",
                      template.price === 'free' ? 'text-green-400' : 'text-yellow-400'
                    )}>
                      {template.price === 'free' ? 'Free' : 'Premium'}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{template.stats.downloads}</div>
                    <div className="text-xs text-gray-400">Downloads</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{template.stats.stars}</div>
                    <div className="text-xs text-gray-400">Stars</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{template.estimatedTime}h</div>
                    <div className="text-xs text-gray-400">Est. Time</div>
                  </div>
                </div>

                {/* Architecture */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-1">Architecture:</div>
                  <div className="flex items-center space-x-4 text-xs text-gray-300">
                    <span>{template.architecture.programs} programs</span>
                    <span>{template.architecture.accounts} accounts</span>
                    <span className={getComplexityColor(template.architecture.complexity)}>
                      {template.architecture.complexity}
                    </span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-1">Tech Stack:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {template.techStack.length > 3 && (
                      <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                        +{template.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Author and Date */}
                <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs">{template.author.name[0]}</span>
                    </div>
                    <span>{template.author.name}</span>
                  </div>
                  <span>{formatDate(template.stats.lastUpdated)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => onTemplateSelect(template)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTemplatePreview(template)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTemplateDeploy(template)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>

                {/* Expandable Details */}
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedTemplate(
                      expandedTemplate === template.id ? null : template.id
                    )}
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    {expandedTemplate === template.id ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    {expandedTemplate === template.id ? 'Hide Details' : 'Show Details'}
                  </Button>

                  {expandedTemplate === template.id && (
                    <div className="mt-4 space-y-4 border-t border-gray-700 pt-4">
                      {/* Features */}
                      <div>
                        <div className="text-sm font-medium text-white mb-2">Features:</div>
                        <div className="grid grid-cols-2 gap-1">
                          {template.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs text-gray-300">
                              <CheckCircle className="h-3 w-3 text-green-400" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Start */}
                      <div>
                        <div className="text-sm font-medium text-white mb-2">Quick Start:</div>
                        <div className="bg-gray-800 rounded p-3">
                          <pre className="text-xs text-gray-300">
                            <code>{template.code.program}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="flex items-center space-x-2">
                        {template.liveDemo && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(template.liveDemo, '_blank')}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Live Demo
                          </Button>
                        )}
                        {template.videoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(template.videoUrl, '_blank')}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Video
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(template.documentation.setup, '_blank')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <BookOpen className="h-3 w-3 mr-1" />
                          Docs
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No templates found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

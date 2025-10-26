'use client';

import { useState, useMemo } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Code, 
  Shield, 
  Zap,
  BookOpen,
  TrendingUp,
  Users,
  Clock,
  ChevronDown,
  ChevronRight,
  Play,
  Copy,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Contract {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  code: string;
  explanation: string;
  tests: string[];
  deployment: {
    network: 'devnet' | 'testnet' | 'mainnet';
    programId: string;
    explorerUrl: string;
  };
  rating: number;
  downloads: number;
  views: number;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  size: number; // in lines of code
  dependencies: string[];
  features: string[];
  securityAudit: boolean;
  documentation: string;
}

interface ContractLibraryProps {
  onImportContract: (contract: Contract) => void;
  onViewContract: (contract: Contract) => void;
  onRunContract: (contract: Contract) => void;
}

export default function ContractLibrary({
  onImportContract,
  onViewContract,
  onRunContract
}: ContractLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sample contract data - in real implementation, this would come from an API
  const contracts: Contract[] = [
    {
      id: 'simple-counter',
      name: 'Simple Counter',
      description: 'A basic counter program that demonstrates fundamental Solana concepts like account management and program instructions.',
      difficulty: 'beginner',
      category: 'basics',
      tags: ['counter', 'account', 'instruction', 'beginner'],
      code: `use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::ProgramError,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Implementation here
    Ok(())
}`,
      explanation: 'This is a simple counter program that demonstrates the basic structure of a Solana program.',
      tests: ['test_increment', 'test_decrement', 'test_reset'],
      deployment: {
        network: 'devnet',
        programId: '11111111111111111111111111111111',
        explorerUrl: 'https://explorer.solana.com/address/11111111111111111111111111111111'
      },
      rating: 4.8,
      downloads: 1250,
      views: 3200,
      author: {
        name: 'Solana Team',
        avatar: '/avatars/solana-team.png',
        verified: true
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      size: 45,
      dependencies: ['solana-program'],
      features: ['Account Management', 'Basic Instructions', 'Error Handling'],
      securityAudit: true,
      documentation: 'https://docs.solana.com/developing/programming-model/overview'
    },
    {
      id: 'token-transfer',
      name: 'Token Transfer',
      description: 'A program for transferring SPL tokens between accounts with proper validation and error handling.',
      difficulty: 'beginner',
      category: 'tokens',
      tags: ['spl-token', 'transfer', 'validation', 'beginner'],
      code: `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("11111111111111111111111111111111");

#[program]
pub mod token_transfer {
    use super::*;

    pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }
}`,
      explanation: 'This program demonstrates how to transfer SPL tokens between accounts using Anchor framework.',
      tests: ['test_transfer_success', 'test_transfer_insufficient_funds', 'test_transfer_unauthorized'],
      deployment: {
        network: 'devnet',
        programId: '22222222222222222222222222222222',
        explorerUrl: 'https://explorer.solana.com/address/22222222222222222222222222222222'
      },
      rating: 4.6,
      downloads: 980,
      views: 2100,
      author: {
        name: 'Anchor Team',
        avatar: '/avatars/anchor-team.png',
        verified: true
      },
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      size: 78,
      dependencies: ['anchor-lang', 'anchor-spl'],
      features: ['SPL Token Integration', 'CPI Calls', 'Account Validation'],
      securityAudit: true,
      documentation: 'https://docs.anchor-lang.com/chapter_2/transfers.html'
    },
    {
      id: 'nft-marketplace',
      name: 'NFT Marketplace',
      description: 'A complete NFT marketplace with minting, listing, buying, and auction functionality.',
      difficulty: 'advanced',
      category: 'nft',
      tags: ['nft', 'marketplace', 'auction', 'advanced', 'defi'],
      code: `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use mpl_token_metadata::{
    instruction as mpl_instruction,
    state as mpl_state,
};

declare_id!("33333333333333333333333333333333");

#[program]
pub mod nft_marketplace {
    use super::*;

    pub fn create_nft(
        ctx: Context<CreateNft>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        // NFT creation logic
        Ok(())
    }

    pub fn list_nft(
        ctx: Context<ListNft>,
        price: u64,
    ) -> Result<()> {
        // NFT listing logic
        Ok(())
    }

    pub fn buy_nft(
        ctx: Context<BuyNft>,
    ) -> Result<()> {
        // NFT purchase logic
        Ok(())
    }
}`,
      explanation: 'A comprehensive NFT marketplace implementation with all essential features for trading NFTs.',
      tests: ['test_create_nft', 'test_list_nft', 'test_buy_nft', 'test_auction'],
      deployment: {
        network: 'mainnet',
        programId: '33333333333333333333333333333333',
        explorerUrl: 'https://explorer.solana.com/address/33333333333333333333333333333333'
      },
      rating: 4.9,
      downloads: 2100,
      views: 5600,
      author: {
        name: 'Metaplex Team',
        avatar: '/avatars/metaplex-team.png',
        verified: true
      },
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-25'),
      size: 450,
      dependencies: ['anchor-lang', 'anchor-spl', 'mpl-token-metadata'],
      features: ['NFT Minting', 'Marketplace', 'Auctions', 'Royalties', 'Metadata'],
      securityAudit: true,
      documentation: 'https://docs.metaplex.com/programs/token-metadata/'
    },
    {
      id: 'simple-dex',
      name: 'Simple DEX',
      description: 'A basic decentralized exchange with liquidity pools and token swapping functionality.',
      difficulty: 'intermediate',
      category: 'defi',
      tags: ['dex', 'amm', 'liquidity', 'swap', 'intermediate'],
      code: `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

declare_id!("44444444444444444444444444444444");

#[program]
pub mod simple_dex {
    use super::*;

    pub fn create_pool(
        ctx: Context<CreatePool>,
        initial_liquidity_a: u64,
        initial_liquidity_b: u64,
    ) -> Result<()> {
        // Pool creation logic
        Ok(())
    }

    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        amount_a: u64,
        amount_b: u64,
    ) -> Result<()> {
        // Add liquidity logic
        Ok(())
    }

    pub fn swap(
        ctx: Context<Swap>,
        amount_in: u64,
        minimum_amount_out: u64,
    ) -> Result<()> {
        // Swap logic using constant product formula
        Ok(())
    }
}`,
      explanation: 'A simple DEX implementation using the constant product formula (x * y = k) for price determination.',
      tests: ['test_create_pool', 'test_add_liquidity', 'test_swap', 'test_price_calculation'],
      deployment: {
        network: 'testnet',
        programId: '44444444444444444444444444444444',
        explorerUrl: 'https://explorer.solana.com/address/44444444444444444444444444444444'
      },
      rating: 4.7,
      downloads: 1800,
      views: 4200,
      author: {
        name: 'DeFi Builder',
        avatar: '/avatars/defi-builder.png',
        verified: false
      },
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-22'),
      size: 320,
      dependencies: ['anchor-lang', 'anchor-spl'],
      features: ['AMM', 'Liquidity Pools', 'Token Swaps', 'Price Calculation'],
      securityAudit: false,
      documentation: 'https://docs.raydium.io/raydium-clmm/'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: contracts.length },
    { id: 'basics', name: 'Basics', count: contracts.filter(c => c.category === 'basics').length },
    { id: 'tokens', name: 'Tokens', count: contracts.filter(c => c.category === 'tokens').length },
    { id: 'nft', name: 'NFTs', count: contracts.filter(c => c.category === 'nft').length },
    { id: 'defi', name: 'DeFi', count: contracts.filter(c => c.category === 'defi').length },
    { id: 'gaming', name: 'Gaming', count: contracts.filter(c => c.category === 'gaming').length },
    { id: 'dao', name: 'DAO', count: contracts.filter(c => c.category === 'dao').length }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels', count: contracts.length },
    { id: 'beginner', name: 'Beginner', count: contracts.filter(c => c.difficulty === 'beginner').length },
    { id: 'intermediate', name: 'Intermediate', count: contracts.filter(c => c.difficulty === 'intermediate').length },
    { id: 'advanced', name: 'Advanced', count: contracts.filter(c => c.difficulty === 'advanced').length }
  ];

  const filteredContracts = useMemo(() => {
    let filtered = contracts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(contract =>
        contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(contract => contract.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(contract => contract.difficulty === selectedDifficulty);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'size':
        filtered.sort((a, b) => a.size - b.size);
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
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
            <h1 className="text-2xl font-bold text-white">Contract Library</h1>
            <p className="text-gray-400">Discover and import Solana programs to learn from</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              {filteredContracts.length} contracts
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts by name, description, or tags..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.id} value={difficulty.id}>
                      {difficulty.name} ({difficulty.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="size">Smallest First</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contract Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <Card key={contract.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{contract.name}</h3>
                      {contract.author.verified && (
                        <Shield className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{contract.description}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getDifficultyColor(contract.difficulty)
                  )}>
                    {contract.difficulty}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {contract.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {contract.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                      +{contract.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{contract.rating}</span>
                    </div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{contract.downloads}</div>
                    <div className="text-xs text-gray-400">Downloads</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{contract.size}</div>
                    <div className="text-xs text-gray-400">Lines</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-1">Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {contract.features.slice(0, 2).map((feature) => (
                      <span key={feature} className="px-2 py-1 bg-blue-900/20 text-blue-300 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                    {contract.features.length > 2 && (
                      <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                        +{contract.features.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Author and Date */}
                <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs">{contract.author.name[0]}</span>
                    </div>
                    <span>{contract.author.name}</span>
                  </div>
                  <span>{formatDate(contract.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => onImportContract(contract)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewContract(contract)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRunContract(contract)}
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
                    onClick={() => setExpandedContract(
                      expandedContract === contract.id ? null : contract.id
                    )}
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    {expandedContract === contract.id ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    {expandedContract === contract.id ? 'Hide Details' : 'Show Details'}
                  </Button>

                  {expandedContract === contract.id && (
                    <div className="mt-4 space-y-4 border-t border-gray-700 pt-4">
                      {/* Dependencies */}
                      <div>
                        <div className="text-sm font-medium text-white mb-2">Dependencies:</div>
                        <div className="flex flex-wrap gap-1">
                          {contract.dependencies.map((dep) => (
                            <span key={dep} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Deployment Info */}
                      <div>
                        <div className="text-sm font-medium text-white mb-2">Deployment:</div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-green-900/20 text-green-300 text-xs rounded">
                            {contract.deployment.network}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(contract.deployment.explorerUrl, '_blank')}
                            className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Documentation */}
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(contract.documentation, '_blank')}
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Documentation
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredContracts.length === 0 && (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No contracts found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

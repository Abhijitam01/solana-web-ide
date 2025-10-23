import { Router } from 'express';
import { generateCode, healthCheck as aiHealthCheck } from './ai';
import { 
  getBalance, 
  getAccountInfo, 
  getProgramAccounts, 
  callProgramMethod, 
  getHealth as solanaHealthCheck 
} from './solana';

const router = Router();

// AI Routes
router.post('/ai/generate', generateCode);
router.get('/ai/health', aiHealthCheck);

// Error Simplification Routes
router.post('/ai/simplify-error', async (req, res) => {
  try {
    const { errorMessage, context } = req.body;
    
    if (!errorMessage) {
      return res.status(400).json({ error: 'Error message is required' });
    }

    const { aiService } = await import('../lib/ai');
    const simplifiedError = await aiService.simplifyError(errorMessage, context);
    
    res.json({
      success: true,
      originalError: errorMessage,
      simplifiedExplanation: simplifiedError,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error simplification failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to simplify error',
      timestamp: new Date()
    });
  }
});

router.post('/ai/analyze-compilation-error', async (req, res) => {
  try {
    const { errorOutput, code } = req.body;
    
    if (!errorOutput) {
      return res.status(400).json({ error: 'Error output is required' });
    }

    const { aiService } = await import('../lib/ai');
    const analysis = await aiService.analyzeCompilationError(errorOutput, code);
    
    res.json({
      success: true,
      originalError: errorOutput,
      analysis: analysis,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Compilation error analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze compilation error',
      timestamp: new Date()
    });
  }
});

// Compilation Routes
router.post('/compile', async (req, res) => {
  try {
    const { programCode, programName } = req.body;
    
    // Simulate compilation for now
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    res.json({
      success: true,
      message: 'Program compiled successfully',
      output: 'Build completed without errors',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({
      success: false,
      error: 'Compilation failed',
      timestamp: new Date()
    });
  }
});

// Deployment Routes
router.post('/deploy', async (req, res) => {
  try {
    const { programIdl, programName } = req.body;
    
    // Simulate deployment for now
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    res.json({
      success: true,
      message: 'Program deployed successfully',
      programId: '11111111111111111111111111111111',
      explorerUrl: 'https://explorer.solana.com/address/11111111111111111111111111111111?cluster=devnet',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({
      success: false,
      error: 'Deployment failed',
      timestamp: new Date()
    });
  }
});

// Template Routes
router.get('/templates', async (req, res) => {
  const templates = [
    {
      id: 'nft-mint',
      name: 'NFT Mint Program',
      description: 'Complete NFT minting program with metadata',
      category: 'NFT',
      difficulty: 'Beginner',
      features: ['Mint', 'Metadata', 'Royalties'],
    },
    {
      id: 'token-vault',
      name: 'Token Vault',
      description: 'Secure token storage and management',
      category: 'DeFi',
      difficulty: 'Intermediate',
      features: ['Deposit', 'Withdraw', 'Multi-sig'],
    },
    {
      id: 'dao-voting',
      name: 'DAO Voting',
      description: 'Decentralized governance voting system',
      category: 'Governance',
      difficulty: 'Advanced',
      features: ['Proposals', 'Voting', 'Execution'],
    },
    {
      id: 'airdrop-program',
      name: 'Token Airdrop',
      description: 'Automated token distribution system',
      category: 'Utility',
      difficulty: 'Beginner',
      features: ['Batch Transfer', 'Whitelist', 'Claim'],
    },
  ];

  res.json({
    success: true,
    templates,
    timestamp: new Date()
  });
});

router.get('/templates/:id', async (req, res) => {
  const { id } = req.params;
  
  const templateCode = {
    'nft-mint': `use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod nft_mint {
    use super::*;

    pub fn mint_nft(ctx: Context<MintNft>, metadata_uri: String) -> Result<()> {
        // NFT minting logic here
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub mint: Signer<'info>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub mint_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}`,
    'token-vault': `use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod token_vault {
    use super::*;

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        // Deposit logic here
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        // Withdraw logic here
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    // Deposit account structure
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    // Withdraw account structure
}`,
    // Add more templates...
  };

  res.json({
    success: true,
    code: templateCode[id] || 'Template not found',
    timestamp: new Date()
  });
});

// Solana Routes
router.get('/solana/balance/:publicKey', getBalance);
router.get('/solana/account/:publicKey', getAccountInfo);
router.get('/solana/program/:programId/accounts', getProgramAccounts);
router.post('/solana/program/:programId/:method', callProgramMethod);
router.get('/solana/health', solanaHealthCheck);

// General health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    services: ['ai', 'solana']
  });
});

export default router;

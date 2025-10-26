"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_1 = require("./ai");
const error_simplification_1 = require("./error-simplification");
const solana_1 = require("./solana");
const router = (0, express_1.Router)();
// AI Routes
router.post('/ai/generate', ai_1.generateCode);
router.get('/ai/health', ai_1.healthCheck);
// Error Simplification Routes
router.post('/ai/simplify-error', error_simplification_1.simplifyError);
router.post('/ai/analyze-compilation-error', error_simplification_1.analyzeCompilationError);
// Compilation Routes
router.post('/compile', async (req, res) => {
    try {
        const { programCode, programName } = req.body;
        if (!programCode || !programName) {
            return res.status(400).json({
                success: false,
                error: 'Program code and name are required'
            });
        }
        const { compilationService } = await Promise.resolve().then(() => __importStar(require('../lib/compilation')));
        const result = await compilationService.compileProgram(programCode, programName);
        res.json({
            success: result.success,
            output: result.output,
            errors: result.errors,
            artifacts: result.artifacts,
            timestamp: new Date()
        });
    }
    catch (error) {
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
        const { programBuffer, programName } = req.body;
        if (!programBuffer || !programName) {
            return res.status(400).json({
                success: false,
                error: 'Program buffer and name are required'
            });
        }
        // Convert base64 buffer to Buffer
        const buffer = Buffer.from(programBuffer, 'base64');
        const { deploymentService } = await Promise.resolve().then(() => __importStar(require('../lib/deployment')));
        const result = await deploymentService.deployProgram(buffer, programName);
        res.json(result);
    }
    catch (error) {
        console.error('Deployment error:', error);
        res.status(500).json({
            success: false,
            error: 'Deployment failed',
            timestamp: new Date()
        });
    }
});
// Add deployment status endpoint
router.get('/deploy/status/:programId', async (req, res) => {
    try {
        const { programId } = req.params;
        const { deploymentService } = await Promise.resolve().then(() => __importStar(require('../lib/deployment')));
        const status = await deploymentService.getDeploymentStatus(programId);
        res.json(status);
    }
    catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ error: 'Failed to check deployment status' });
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
router.get('/solana/balance/:publicKey', solana_1.getBalance);
router.get('/solana/account/:publicKey', solana_1.getAccountInfo);
router.get('/solana/program/:programId/accounts', solana_1.getProgramAccounts);
router.post('/solana/program/:programId/:method', solana_1.callProgramMethod);
router.get('/solana/health', solana_1.getHealth);
// General health check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        services: ['ai', 'solana']
    });
});
exports.default = router;

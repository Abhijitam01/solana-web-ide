import { Request, Response } from 'express';
import { aiService } from '../lib/ai';

export const generateCode = async (req: Request, res: Response) => {
  try {
    console.log('AI API called with:', req.body);
    
    const { prompt, context, type } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // For now, return a mock response to test the API
    const mockResponse = `Here's a simple Solana counter program:

\`\`\`rust
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    pub count: u64,
}
\`\`\`

This program creates a simple counter that can be initialized and incremented.`;

    res.json({
      content: mockResponse,
      type: type || 'generate',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('AI API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const healthCheck = async (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    service: 'ai',
    timestamp: new Date()
  });
};

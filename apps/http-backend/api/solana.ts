import { Request, Response } from 'express';
import { PublicKey } from '@solana/web3.js';
import { solanaService, programService } from '../lib/solana';

export const getBalance = async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.params;

    if (!publicKey) {
      return res.status(400).json({ error: 'Public key is required' });
    }

    const pubKey = new PublicKey(publicKey);
    const balance = await solanaService.getBalance(pubKey);

    res.json({
      publicKey,
      balance,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
};

export const getAccountInfo = async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.params;

    if (!publicKey) {
      return res.status(400).json({ error: 'Public key is required' });
    }

    const pubKey = new PublicKey(publicKey);
    const accountInfo = await solanaService.getAccountInfo(pubKey);

    res.json({
      publicKey,
      accountInfo,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get account info error:', error);
    res.status(500).json({ error: 'Failed to get account info' });
  }
};

export const getProgramAccounts = async (req: Request, res: Response) => {
  try {
    const { programId } = req.params;

    if (!programId) {
      return res.status(400).json({ error: 'Program ID is required' });
    }

    const accounts = await programService.getProgramAccounts(programId);

    res.json({
      programId,
      accounts: accounts.map(account => ({
        pubkey: account.pubkey.toString(),
        account: {
          lamports: account.account.lamports,
          data: account.account.data.toString('base64'),
          owner: account.account.owner.toString(),
          executable: account.account.executable
        }
      })),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get program accounts error:', error);
    res.status(500).json({ error: 'Failed to get program accounts' });
  }
};

export const callProgramMethod = async (req: Request, res: Response) => {
  try {
    const { programId, method } = req.params;
    const { args = [] } = req.body;

    if (!programId || !method) {
      return res.status(400).json({ error: 'Program ID and method are required' });
    }

    const tx = await programService.callProgramMethod(programId, method, args);

    res.json({
      programId,
      method,
      transaction: tx,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Call program method error:', error);
    res.status(500).json({ error: 'Failed to call program method' });
  }
};

export const getHealth = async (req: Request, res: Response) => {
  try {
    const isHealthy = await solanaService.getHealth();
    const slot = await solanaService.getSlot();

    res.json({
      status: isHealthy ? 'ok' : 'error',
      service: 'solana',
      slot,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Solana health check error:', error);
    res.status(500).json({ 
      status: 'error',
      service: 'solana',
      error: 'Health check failed'
    });
  }
};

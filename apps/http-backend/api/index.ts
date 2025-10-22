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

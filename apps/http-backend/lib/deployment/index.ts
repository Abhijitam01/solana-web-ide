import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction,
  SystemProgram,
  BPF_LOADER_PROGRAM_ID,
  sendAndConfirmTransaction,
  TransactionInstruction
} from '@solana/web3.js';
import { SolanaService } from '../solana/connection';

export class DeploymentService {
  private solanaService: SolanaService;

  constructor() {
    this.solanaService = new SolanaService();
  }

  async deployProgram(
    programBuffer: Buffer, 
    programName: string
  ): Promise<DeploymentResult> {
    try {
      const connection = this.solanaService.getConnection();
      const wallet = this.solanaService.getWallet();
      
      // Create program account
      const programKeypair = Keypair.generate();
      const programId = programKeypair.publicKey;
      
      // Calculate space needed
      const space = programBuffer.length;
      const rent = await connection.getMinimumBalanceForRentExemption(space);
      
      // Create and send deployment transaction
      const transaction = new Transaction();
      
      // Create account instruction
      const createAccountIx = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: programId,
        lamports: rent,
        space: space,
        programId: BPF_LOADER_PROGRAM_ID,
      });
      
      // Assign program instruction
      const assignIx = SystemProgram.assign({
        accountPubkey: programId,
        programId: BPF_LOADER_PROGRAM_ID,
      });
      
      // Deploy program instruction
      const deployIx = new TransactionInstruction({
        keys: [
          { pubkey: programId, isSigner: true, isWritable: true },
          { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
        ],
        programId: BPF_LOADER_PROGRAM_ID,
        data: programBuffer,
      });
      
      transaction.add(createAccountIx, assignIx, deployIx);
      
      // Send transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [wallet.payer, programKeypair],
        { commitment: 'confirmed' }
      );
      
      return {
        success: true,
        programId: programId.toString(),
        signature,
        explorerUrl: `https://explorer.solana.com/address/${programId.toString()}?cluster=devnet`,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Deployment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed',
        timestamp: new Date()
      };
    }
  }

  async getDeploymentStatus(programId: string): Promise<DeploymentStatus> {
    try {
      const connection = this.solanaService.getConnection();
      const pubkey = new PublicKey(programId);
      const accountInfo = await connection.getAccountInfo(pubkey);
      
      return {
        deployed: !!accountInfo,
        programId,
        owner: accountInfo?.owner.toString(),
        executable: accountInfo?.executable,
        lamports: accountInfo?.lamports,
        dataLength: accountInfo?.data.length
      };
    } catch (error) {
      return {
        deployed: false,
        programId,
        error: error instanceof Error ? error.message : 'Failed to check status'
      };
    }
  }
}

interface DeploymentResult {
  success: boolean;
  programId?: string;
  signature?: string;
  explorerUrl?: string;
  error?: string;
  timestamp: Date;
}

interface DeploymentStatus {
  deployed: boolean;
  programId: string;
  owner?: string;
  executable?: boolean;
  lamports?: number;
  dataLength?: number;
  error?: string;
}

export const deploymentService = new DeploymentService();

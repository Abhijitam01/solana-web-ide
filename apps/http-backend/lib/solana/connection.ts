import { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';

export class SolanaService {
  private connection: Connection;
  private provider: AnchorProvider;
  private wallet: Wallet;

  constructor() {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'http://localhost:8899';
    this.connection = new Connection(rpcUrl, 'confirmed');
    
    // Initialize wallet (in production, use proper key management)
    const privateKey = process.env.SOLANA_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('SOLANA_PRIVATE_KEY environment variable is required');
    }
    
    const keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)));
    this.wallet = new Wallet(keypair);
    
    this.provider = new AnchorProvider(
      this.connection,
      this.wallet,
      { commitment: 'confirmed' }
    );
  }

  getConnection(): Connection {
    return this.connection;
  }

  getProvider(): AnchorProvider {
    return this.provider;
  }

  getWallet(): Wallet {
    return this.wallet;
  }

  async getBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get balance');
    }
  }

  async getAccountInfo(publicKey: PublicKey) {
    try {
      return await this.connection.getAccountInfo(publicKey);
    } catch (error) {
      console.error('Error getting account info:', error);
      throw new Error('Failed to get account info');
    }
  }

  async sendTransaction(transaction: Transaction): Promise<string> {
    try {
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet.payer]
      );
      return signature;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw new Error('Failed to send transaction');
    }
  }

  async getRecentBlockhash() {
    try {
      const { blockhash } = await this.connection.getLatestBlockhash();
      return blockhash;
    } catch (error) {
      console.error('Error getting recent blockhash:', error);
      throw new Error('Failed to get recent blockhash');
    }
  }

  async getProgramAccounts(programId: PublicKey) {
    try {
      return await this.connection.getProgramAccounts(programId);
    } catch (error) {
      console.error('Error getting program accounts:', error);
      throw new Error('Failed to get program accounts');
    }
  }

  async getSlot(): Promise<number> {
    try {
      return await this.connection.getSlot();
    } catch (error) {
      console.error('Error getting slot:', error);
      throw new Error('Failed to get slot');
    }
  }

  async getHealth(): Promise<boolean> {
    try {
      const health = await this.connection.getHealth();
      return health === 'ok';
    } catch (error) {
      console.error('Error checking health:', error);
      return false;
    }
  }
}

export const solanaService = new SolanaService();

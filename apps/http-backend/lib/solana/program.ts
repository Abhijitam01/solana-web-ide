import { PublicKey, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { SolanaService } from './connection';

export class ProgramService {
  private solanaService: SolanaService;
  private programs: Map<string, Program> = new Map();

  constructor() {
    this.solanaService = new SolanaService();
  }

  async loadProgram(programId: string, idl: Idl): Promise<Program> {
    try {
      const programPublicKey = new PublicKey(programId);
      const provider = this.solanaService.getProvider();
      
      const program = new Program(idl, provider);
      this.programs.set(programId, program);
      
      return program;
    } catch (error) {
      console.error('Error loading program:', error);
      throw new Error(`Failed to load program ${programId}`);
    }
  }

  getProgram(programId: string): Program | undefined {
    return this.programs.get(programId);
  }

  async deployProgram(
    programId: string,
    idl: Idl,
    programBuffer: Buffer
  ): Promise<string> {
    try {
      const program = await this.loadProgram(programId, idl);
      const provider = this.solanaService.getProvider();
      
      // Deploy the program
      // For now, return a mock transaction
      const tx = 'mock_transaction_signature';
      
      return tx;
    } catch (error) {
      console.error('Error deploying program:', error);
      throw new Error('Failed to deploy program');
    }
  }

  async callProgramMethod(
    programId: string,
    method: string,
    args: any[] = []
  ): Promise<string> {
    try {
      const program = this.getProgram(programId);
      if (!program) {
        throw new Error(`Program ${programId} not loaded`);
      }

      // For now, return a mock transaction
      const tx = 'mock_transaction_signature';
      return tx;
    } catch (error) {
      console.error('Error calling program method:', error);
      throw new Error(`Failed to call method ${method}`);
    }
  }

  async getProgramAccounts(programId: string) {
    try {
      const programPublicKey = new PublicKey(programId);
      const connection = this.solanaService.getConnection();
      
      return await connection.getProgramAccounts(programPublicKey);
    } catch (error) {
      console.error('Error getting program accounts:', error);
      throw new Error('Failed to get program accounts');
    }
  }

  async getProgramData(programId: string) {
    try {
      const programPublicKey = new PublicKey(programId);
      const connection = this.solanaService.getConnection();
      
      return await connection.getAccountInfo(programPublicKey);
    } catch (error) {
      console.error('Error getting program data:', error);
      throw new Error('Failed to get program data');
    }
  }

  // Helper method to create a new keypair
  createKeypair(): Keypair {
    return Keypair.generate();
  }

  // Helper method to get program ID from string
  getProgramId(programId: string): PublicKey {
    try {
      return new PublicKey(programId);
    } catch (error) {
      throw new Error(`Invalid program ID: ${programId}`);
    }
  }
}

export const programService = new ProgramService();

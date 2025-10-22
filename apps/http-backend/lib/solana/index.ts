export { SolanaService, solanaService } from './connection';
export { ProgramService, programService } from './program';

export interface SolanaConfig {
  rpcUrl: string;
  wsUrl: string;
  privateKey: string;
  programId: string;
}

export interface TransactionResult {
  signature: string;
  slot: number;
  error?: string;
}

export interface AccountInfo {
  publicKey: string;
  lamports: number;
  data: Buffer;
  owner: string;
  executable: boolean;
}

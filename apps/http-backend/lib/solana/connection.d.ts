import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
export declare class SolanaService {
    private connection;
    private provider;
    private wallet;
    constructor();
    getConnection(): Connection;
    getProvider(): AnchorProvider;
    getWallet(): Wallet;
    getBalance(publicKey: PublicKey): Promise<number>;
    getAccountInfo(publicKey: PublicKey): Promise<import("@solana/web3.js").AccountInfo<Buffer<ArrayBufferLike>> | null>;
    sendTransaction(transaction: Transaction): Promise<string>;
    getRecentBlockhash(): Promise<string>;
    getProgramAccounts(programId: PublicKey): Promise<import("@solana/web3.js").GetProgramAccountsResponse>;
    getSlot(): Promise<number>;
    getHealth(): Promise<boolean>;
}
export declare const solanaService: SolanaService;
//# sourceMappingURL=connection.d.ts.map
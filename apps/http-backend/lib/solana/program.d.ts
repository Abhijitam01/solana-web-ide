import { PublicKey, Keypair } from '@solana/web3.js';
import { Program, Idl } from '@coral-xyz/anchor';
export declare class ProgramService {
    private solanaService;
    private programs;
    constructor();
    loadProgram(programId: string, idl: Idl): Promise<Program>;
    getProgram(programId: string): Program | undefined;
    deployProgram(programId: string, idl: Idl, programBuffer: Buffer): Promise<string>;
    callProgramMethod(programId: string, method: string, args?: any[]): Promise<string>;
    getProgramAccounts(programId: string): Promise<import("@solana/web3.js").GetProgramAccountsResponse>;
    getProgramData(programId: string): Promise<import("@solana/web3.js").AccountInfo<Buffer<ArrayBufferLike>> | null>;
    createKeypair(): Keypair;
    getProgramId(programId: string): PublicKey;
}
export declare const programService: ProgramService;
//# sourceMappingURL=program.d.ts.map
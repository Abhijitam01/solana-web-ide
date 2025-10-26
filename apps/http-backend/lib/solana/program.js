"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programService = exports.ProgramService = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const connection_1 = require("./connection");
class ProgramService {
    constructor() {
        this.programs = new Map();
        this.solanaService = new connection_1.SolanaService();
    }
    async loadProgram(programId, idl) {
        try {
            const programPublicKey = new web3_js_1.PublicKey(programId);
            const provider = this.solanaService.getProvider();
            const program = new anchor_1.Program(idl, programPublicKey, provider);
            this.programs.set(programId, program);
            return program;
        }
        catch (error) {
            console.error('Error loading program:', error);
            throw new Error(`Failed to load program ${programId}`);
        }
    }
    getProgram(programId) {
        return this.programs.get(programId);
    }
    async deployProgram(programId, idl, programBuffer) {
        try {
            const program = await this.loadProgram(programId, idl);
            const provider = this.solanaService.getProvider();
            // Deploy the program
            const tx = await program.methods
                .initialize()
                .rpc();
            return tx;
        }
        catch (error) {
            console.error('Error deploying program:', error);
            throw new Error('Failed to deploy program');
        }
    }
    async callProgramMethod(programId, method, args = []) {
        try {
            const program = this.getProgram(programId);
            if (!program) {
                throw new Error(`Program ${programId} not loaded`);
            }
            const tx = await program.methods[method](...args).rpc();
            return tx;
        }
        catch (error) {
            console.error('Error calling program method:', error);
            throw new Error(`Failed to call method ${method}`);
        }
    }
    async getProgramAccounts(programId) {
        try {
            const programPublicKey = new web3_js_1.PublicKey(programId);
            const connection = this.solanaService.getConnection();
            return await connection.getProgramAccounts(programPublicKey);
        }
        catch (error) {
            console.error('Error getting program accounts:', error);
            throw new Error('Failed to get program accounts');
        }
    }
    async getProgramData(programId) {
        try {
            const programPublicKey = new web3_js_1.PublicKey(programId);
            const connection = this.solanaService.getConnection();
            return await connection.getAccountInfo(programPublicKey);
        }
        catch (error) {
            console.error('Error getting program data:', error);
            throw new Error('Failed to get program data');
        }
    }
    // Helper method to create a new keypair
    createKeypair() {
        return web3_js_1.Keypair.generate();
    }
    // Helper method to get program ID from string
    getProgramId(programId) {
        try {
            return new web3_js_1.PublicKey(programId);
        }
        catch (error) {
            throw new Error(`Invalid program ID: ${programId}`);
        }
    }
}
exports.ProgramService = ProgramService;
exports.programService = new ProgramService();

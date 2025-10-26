"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solanaService = exports.SolanaService = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
class SolanaService {
    constructor() {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
        this.connection = new web3_js_1.Connection(rpcUrl, 'confirmed');
        // Initialize wallet (in production, use proper key management)
        const privateKey = process.env.SOLANA_PRIVATE_KEY;
        if (!privateKey) {
            console.warn('SOLANA_PRIVATE_KEY not found, using dummy wallet for development');
            // Create a dummy wallet for development
            const dummyKeypair = web3_js_1.Keypair.generate();
            this.wallet = new anchor_1.Wallet(dummyKeypair);
        }
        else {
            const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)));
            this.wallet = new anchor_1.Wallet(keypair);
        }
        this.provider = new anchor_1.AnchorProvider(this.connection, this.wallet, { commitment: 'confirmed' });
    }
    getConnection() {
        return this.connection;
    }
    getProvider() {
        return this.provider;
    }
    getWallet() {
        return this.wallet;
    }
    async getBalance(publicKey) {
        try {
            const balance = await this.connection.getBalance(publicKey);
            return balance / 1e9; // Convert lamports to SOL
        }
        catch (error) {
            console.error('Error getting balance:', error);
            throw new Error('Failed to get balance');
        }
    }
    async getAccountInfo(publicKey) {
        try {
            return await this.connection.getAccountInfo(publicKey);
        }
        catch (error) {
            console.error('Error getting account info:', error);
            throw new Error('Failed to get account info');
        }
    }
    async sendTransaction(transaction) {
        try {
            const signature = await (0, web3_js_1.sendAndConfirmTransaction)(this.connection, transaction, [this.wallet.payer]);
            return signature;
        }
        catch (error) {
            console.error('Error sending transaction:', error);
            throw new Error('Failed to send transaction');
        }
    }
    async getRecentBlockhash() {
        try {
            const { blockhash } = await this.connection.getLatestBlockhash();
            return blockhash;
        }
        catch (error) {
            console.error('Error getting recent blockhash:', error);
            throw new Error('Failed to get recent blockhash');
        }
    }
    async getProgramAccounts(programId) {
        try {
            return await this.connection.getProgramAccounts(programId);
        }
        catch (error) {
            console.error('Error getting program accounts:', error);
            throw new Error('Failed to get program accounts');
        }
    }
    async getSlot() {
        try {
            return await this.connection.getSlot();
        }
        catch (error) {
            console.error('Error getting slot:', error);
            throw new Error('Failed to get slot');
        }
    }
    async getHealth() {
        try {
            const health = await this.connection.getHealth();
            return health === 'ok';
        }
        catch (error) {
            console.error('Error checking health:', error);
            return false;
        }
    }
}
exports.SolanaService = SolanaService;
exports.solanaService = new SolanaService();

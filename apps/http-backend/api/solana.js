"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = exports.callProgramMethod = exports.getProgramAccounts = exports.getAccountInfo = exports.getBalance = void 0;
const web3_js_1 = require("@solana/web3.js");
const solana_1 = require("../lib/solana");
const getBalance = async (req, res) => {
    try {
        const { publicKey } = req.params;
        if (!publicKey) {
            return res.status(400).json({ error: 'Public key is required' });
        }
        const pubKey = new web3_js_1.PublicKey(publicKey);
        const balance = await solana_1.solanaService.getBalance(pubKey);
        res.json({
            publicKey,
            balance,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({ error: 'Failed to get balance' });
    }
};
exports.getBalance = getBalance;
const getAccountInfo = async (req, res) => {
    try {
        const { publicKey } = req.params;
        if (!publicKey) {
            return res.status(400).json({ error: 'Public key is required' });
        }
        const pubKey = new web3_js_1.PublicKey(publicKey);
        const accountInfo = await solana_1.solanaService.getAccountInfo(pubKey);
        res.json({
            publicKey,
            accountInfo,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('Get account info error:', error);
        res.status(500).json({ error: 'Failed to get account info' });
    }
};
exports.getAccountInfo = getAccountInfo;
const getProgramAccounts = async (req, res) => {
    try {
        const { programId } = req.params;
        if (!programId) {
            return res.status(400).json({ error: 'Program ID is required' });
        }
        const accounts = await solana_1.programService.getProgramAccounts(programId);
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
    }
    catch (error) {
        console.error('Get program accounts error:', error);
        res.status(500).json({ error: 'Failed to get program accounts' });
    }
};
exports.getProgramAccounts = getProgramAccounts;
const callProgramMethod = async (req, res) => {
    try {
        const { programId, method } = req.params;
        const { args = [] } = req.body;
        if (!programId || !method) {
            return res.status(400).json({ error: 'Program ID and method are required' });
        }
        const tx = await solana_1.programService.callProgramMethod(programId, method, args);
        res.json({
            programId,
            method,
            transaction: tx,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('Call program method error:', error);
        res.status(500).json({ error: 'Failed to call program method' });
    }
};
exports.callProgramMethod = callProgramMethod;
const getHealth = async (req, res) => {
    try {
        const isHealthy = await solana_1.solanaService.getHealth();
        const slot = await solana_1.solanaService.getSlot();
        res.json({
            status: isHealthy ? 'ok' : 'error',
            service: 'solana',
            slot,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('Solana health check error:', error);
        res.status(500).json({
            status: 'error',
            service: 'solana',
            error: 'Health check failed'
        });
    }
};
exports.getHealth = getHealth;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.generateCode = void 0;
const ai_1 = require("../lib/ai");
const generateCode = async (req, res) => {
    try {
        console.log('AI API called with:', req.body);
        const { prompt, context, type } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        // Use real AI service instead of mock
        const response = await ai_1.aiService.generateCode(prompt, context);
        res.json({
            content: response,
            type: type || 'generate',
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('AI API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.generateCode = generateCode;
const healthCheck = async (req, res) => {
    res.json({
        status: 'ok',
        service: 'ai',
        timestamp: new Date()
    });
};
exports.healthCheck = healthCheck;

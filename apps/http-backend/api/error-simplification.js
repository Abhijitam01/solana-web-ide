"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCompilationError = exports.simplifyError = void 0;
const ai_1 = require("../lib/ai");
const simplifyError = async (req, res) => {
    try {
        const { errorMessage, context } = req.body;
        if (!errorMessage) {
            return res.status(400).json({ error: 'Error message is required' });
        }
        const simplifiedError = await ai_1.aiService.simplifyError(errorMessage, context);
        res.json({
            success: true,
            originalError: errorMessage,
            simplifiedExplanation: simplifiedError,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('Error simplification failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to simplify error',
            timestamp: new Date()
        });
    }
};
exports.simplifyError = simplifyError;
const analyzeCompilationError = async (req, res) => {
    try {
        const { errorOutput, code } = req.body;
        if (!errorOutput) {
            return res.status(400).json({ error: 'Error output is required' });
        }
        const analysis = await ai_1.aiService.analyzeCompilationError(errorOutput, code);
        res.json({
            success: true,
            originalError: errorOutput,
            analysis: analysis,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('Compilation error analysis failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze compilation error',
            timestamp: new Date()
        });
    }
};
exports.analyzeCompilationError = analyzeCompilationError;

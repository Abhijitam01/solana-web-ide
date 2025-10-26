import { Request, Response } from 'express';
import { aiService } from '../lib/ai';

export const simplifyError = async (req: Request, res: Response) => {
  try {
    const { errorMessage, context } = req.body;
    
    if (!errorMessage) {
      return res.status(400).json({ error: 'Error message is required' });
    }

    const simplifiedError = await aiService.simplifyError(errorMessage, context);
    
    res.json({
      success: true,
      originalError: errorMessage,
      simplifiedExplanation: simplifiedError,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error simplification failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to simplify error',
      timestamp: new Date()
    });
  }
};

export const analyzeCompilationError = async (req: Request, res: Response) => {
  try {
    const { errorOutput, code } = req.body;
    
    if (!errorOutput) {
      return res.status(400).json({ error: 'Error output is required' });
    }

    const analysis = await aiService.analyzeCompilationError(errorOutput, code);
    
    res.json({
      success: true,
      originalError: errorOutput,
      analysis: analysis,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Compilation error analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze compilation error',
      timestamp: new Date()
    });
  }
};


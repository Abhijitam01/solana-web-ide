import { Request, Response } from 'express';
import { aiService } from '../lib/ai';

export const generateCode = async (req: Request, res: Response) => {
  try {
    console.log('AI API called with:', req.body);
    
    const { prompt, context, type } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Use real AI service instead of mock
    const response = await aiService.generateCode(prompt, context);
    
    res.json({
      content: response,
      type: type || 'generate',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('AI API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const healthCheck = async (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    service: 'ai',
    timestamp: new Date()
  });
};

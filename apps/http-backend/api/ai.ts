import { Request, Response } from 'express';
import { aiService } from '../lib/ai';

export const generateCode = async (req: Request, res: Response) => {
  try {
    const { prompt, context, type } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let result: string;

    switch (type) {
      case 'generate':
        result = await aiService.generateCode(prompt, context);
        break;
      case 'explain':
        result = await aiService.explainCode(prompt);
        break;
      case 'optimize':
        result = await aiService.optimizeCode(prompt);
        break;
      case 'test':
        result = await aiService.generateTests(prompt);
        break;
      default:
        return res.status(400).json({ error: 'Invalid type. Must be generate, explain, optimize, or test' });
    }

    res.json({
      content: result,
      type,
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

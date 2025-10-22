import OpenAI from 'openai';

export class AIService {
  private openai: OpenAI;
  private model: string;
  private maxTokens: number;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.AI_MODEL || 'gpt-4';
    this.maxTokens = parseInt(process.env.AI_MAX_TOKENS || '4000');
  }

  async generateCode(prompt: string, context?: string): Promise<string> {
    try {
      const systemPrompt = `You are an expert Solana developer. Generate clean, efficient, and well-documented code.
      ${context ? `Context: ${context}` : ''}
      
      Requirements:
      - Use modern Solana/Anchor patterns
      - Include proper error handling
      - Add comprehensive comments
      - Follow Rust best practices
      - Optimize for gas efficiency`;

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI code generation error:', error);
      throw new Error('Failed to generate code with AI');
    }
  }

  async explainCode(code: string): Promise<string> {
    try {
      const prompt = `Explain this Solana/Anchor code in detail:
      
      \`\`\`rust
      ${code}
      \`\`\`
      
      Provide:
      - What the code does
      - Key functions and their purposes
      - Security considerations
      - Potential improvements`;

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert Solana developer and educator.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.3,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI code explanation error:', error);
      throw new Error('Failed to explain code with AI');
    }
  }

  async optimizeCode(code: string): Promise<string> {
    try {
      const prompt = `Optimize this Solana/Anchor code for:
      - Gas efficiency
      - Security
      - Performance
      - Best practices
      
      \`\`\`rust
      ${code}
      \`\`\`
      
      Return the optimized code with explanations of changes.`;

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert Solana developer focused on optimization.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.5,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI code optimization error:', error);
      throw new Error('Failed to optimize code with AI');
    }
  }

  async generateTests(code: string): Promise<string> {
    try {
      const prompt = `Generate comprehensive tests for this Solana/Anchor code:
      
      \`\`\`rust
      ${code}
      \`\`\`
      
      Include:
      - Unit tests for all functions
      - Integration tests
      - Edge cases
      - Error conditions
      - Mock data setup`;

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert Solana developer and testing specialist.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.4,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI test generation error:', error);
      throw new Error('Failed to generate tests with AI');
    }
  }
}

export const aiService = new AIService();

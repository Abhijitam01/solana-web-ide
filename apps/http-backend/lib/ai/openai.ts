import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private maxTokens: number;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Gemini API Key loaded:', apiKey ? 'Yes' : 'No');
    
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found, AI features will not work');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
      - Optimize for gas efficiency
      - Include security best practices
      - Add proper account validation
      - Use PDAs where appropriate`;

      const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
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
      - What the code does (high-level overview)
      - Key functions and their purposes
      - Account structures and their roles
      - Security considerations and potential vulnerabilities
      - Gas optimization opportunities
      - Best practices being followed or missing
      - Potential improvements and suggestions
      - Common pitfalls to avoid`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI code explanation error:', error);
      throw new Error('Failed to explain code with AI');
    }
  }

  async optimizeCode(code: string): Promise<string> {
    try {
      const prompt = `Optimize this Solana/Anchor code for:
      - Gas efficiency (minimize compute units)
      - Security (prevent common vulnerabilities)
      - Performance (faster execution)
      - Best practices (modern Solana patterns)
      - Account validation (proper checks)
      - Error handling (comprehensive coverage)
      
      \`\`\`rust
      ${code}
      \`\`\`
      
      Return the optimized code with:
      1. Detailed explanations of each change
      2. Before/after comparison
      3. Security improvements made
      4. Gas savings achieved
      5. Performance improvements`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
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
      - Integration tests with real Solana accounts
      - Edge cases and boundary conditions
      - Error conditions and failure scenarios
      - Mock data setup and test fixtures
      - Security tests (malicious inputs)
      - Performance tests (gas usage)
      - Test utilities and helpers
      - Setup and teardown procedures`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI test generation error:', error);
      throw new Error('Failed to generate tests with AI');
    }
  }

  // Enhanced AI Features
  async analyzeSecurity(code: string): Promise<string> {
    try {
      const prompt = `Analyze this Solana/Anchor code for security vulnerabilities:
      
      \`\`\`rust
      ${code}
      \`\`\`
      
      Check for:
      - Reentrancy attacks
      - Integer overflow/underflow
      - Access control issues
      - Account validation bypasses
      - PDA manipulation
      - Cross-program invocation risks
      - Token transfer vulnerabilities
      - State manipulation attacks
      
      Provide:
      - Security score (1-10)
      - List of vulnerabilities found
      - Severity levels (Critical, High, Medium, Low)
      - Fix recommendations
      - Security best practices to follow`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI security analysis error:', error);
      throw new Error('Failed to analyze security with AI');
    }
  }

  async suggestImprovements(code: string): Promise<string> {
    try {
      const prompt = `Suggest improvements for this Solana/Anchor code:
      
      \`\`\`rust
      ${code}
      \`\`\`
      
      Focus on:
      - Code organization and structure
      - Error handling improvements
      - Performance optimizations
      - Security enhancements
      - Documentation and comments
      - Testing coverage
      - Modern Solana patterns
      - Gas optimization
      
      Provide:
      - Specific improvement suggestions
      - Code examples for each suggestion
      - Priority levels (High, Medium, Low)
      - Implementation difficulty
      - Expected benefits`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI improvement suggestions error:', error);
      throw new Error('Failed to suggest improvements with AI');
    }
  }

  async generateDocumentation(code: string): Promise<string> {
    try {
      const prompt = `Generate comprehensive documentation for this Solana/Anchor code:
      
      \`\`\`rust
      ${code}
      \`\`\`
      
      Include:
      - High-level overview and purpose
      - Function documentation with parameters
      - Account structure explanations
      - Usage examples
      - Error handling documentation
      - Security considerations
      - Deployment instructions
      - Integration guide
      - API reference`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI documentation generation error:', error);
      throw new Error('Failed to generate documentation with AI');
    }
  }
}

export const aiService = new AIService();

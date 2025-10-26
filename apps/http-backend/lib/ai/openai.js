"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class AIService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('Gemini API Key loaded:', apiKey ? 'Yes' : 'No');
        if (!apiKey) {
            console.warn('GEMINI_API_KEY not found, AI features will not work');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey || 'dummy-key');
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        this.maxTokens = parseInt(process.env.AI_MAX_TOKENS || '4000');
    }
    async generateCode(prompt, context) {
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
        }
        catch (error) {
            console.error('AI code generation error:', error);
            throw new Error('Failed to generate code with AI');
        }
    }
    async explainCode(code) {
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
        }
        catch (error) {
            console.error('AI code explanation error:', error);
            throw new Error('Failed to explain code with AI');
        }
    }
    async optimizeCode(code) {
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
        }
        catch (error) {
            console.error('AI code optimization error:', error);
            throw new Error('Failed to optimize code with AI');
        }
    }
    async generateTests(code) {
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
        }
        catch (error) {
            console.error('AI test generation error:', error);
            throw new Error('Failed to generate tests with AI');
        }
    }
    // Enhanced AI Features
    async analyzeSecurity(code) {
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
        }
        catch (error) {
            console.error('AI security analysis error:', error);
            throw new Error('Failed to analyze security with AI');
        }
    }
    async suggestImprovements(code) {
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
        }
        catch (error) {
            console.error('AI improvement suggestions error:', error);
            throw new Error('Failed to suggest improvements with AI');
        }
    }
    async generateDocumentation(code) {
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
        }
        catch (error) {
            console.error('AI documentation generation error:', error);
            throw new Error('Failed to generate documentation with AI');
        }
    }
    async simplifyError(errorMessage, context) {
        try {
            const prompt = `You are an expert Solana developer and technical writer. Simplify this complex error message into easy-to-understand language:

      **Error Message:**
      \`\`\`
      ${errorMessage}
      \`\`\`

      ${context ? `**Context:** ${context}` : ''}

      Please provide:
      1. **What went wrong** (in simple terms)
      2. **Why it happened** (root cause explanation)
      3. **How to fix it** (step-by-step solution)
      4. **Prevention tips** (how to avoid this in the future)
      5. **Common mistakes** (related issues to watch out for)

      Format your response as:
      ## 🚨 What's Wrong?
      [Simple explanation]

      ## 🔍 Why This Happened
      [Root cause analysis]

      ## ✅ How to Fix It
      [Step-by-step solution]

      ## 🛡️ How to Prevent This
      [Prevention tips]

      ## ⚠️ Common Related Issues
      [Additional things to watch out for]

      Keep the language simple, use emojis for visual appeal, and provide actionable solutions.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('AI error simplification error:', error);
            throw new Error('Failed to simplify error with AI');
        }
    }
    async analyzeCompilationError(errorOutput, code) {
        try {
            const prompt = `Analyze this Solana/Anchor compilation error and provide a comprehensive solution:

      **Compilation Error:**
      \`\`\`
      ${errorOutput}
      \`\`\`

      ${code ? `**Code that caused the error:**
      \`\`\`rust
      ${code}
      \`\`\`` : ''}

      Provide:
      1. **Error Type** (syntax, type, import, etc.)
      2. **Root Cause** (what specifically is wrong)
      3. **Quick Fix** (immediate solution)
      4. **Detailed Solution** (step-by-step fix)
      5. **Code Example** (corrected version if applicable)
      6. **Prevention** (how to avoid this error)
      7. **Related Errors** (other similar issues to watch for)

      Format as:
      ## 🔍 Error Analysis
      **Type:** [Error type]
      **Severity:** [Critical/High/Medium/Low]

      ## 🎯 Root Cause
      [Detailed explanation of what's wrong]

      ## ⚡ Quick Fix
      [Immediate solution]

      ## 🔧 Detailed Solution
      [Step-by-step instructions]

      ## 💡 Code Example
      [Corrected code if applicable]

      ## 🛡️ Prevention Tips
      [How to avoid this error]

      ## ⚠️ Related Issues
      [Other similar errors to watch for]`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('AI compilation error analysis error:', error);
            throw new Error('Failed to analyze compilation error with AI');
        }
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();

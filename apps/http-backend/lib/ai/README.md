# AI Library

This module contains AI-powered functionality for the Solana IDE application.

## Features

- **Code Generation**: Generate Solana/Anchor code from natural language prompts
- **Code Explanation**: Explain complex Solana code in plain language
- **Code Optimization**: Optimize code for gas efficiency and performance
- **Test Generation**: Generate comprehensive test suites for Solana programs

## Usage

```typescript
import { aiService } from './lib/ai';

// Generate code
const code = await aiService.generateCode('Create a simple token program');

// Explain code
const explanation = await aiService.explainCode(rustCode);

// Optimize code
const optimized = await aiService.optimizeCode(rustCode);

// Generate tests
const tests = await aiService.generateTests(rustCode);
```

## Configuration

Set the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `AI_MODEL`: Model to use (default: gpt-4)
- `AI_MAX_TOKENS`: Maximum tokens for responses (default: 4000)

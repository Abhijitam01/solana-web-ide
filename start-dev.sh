#!/bin/bash

# Solana AI IDE Development Startup Script
echo "🚀 Starting Solana AI IDE Development Environment"
echo "================================================"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: OPENAI_API_KEY environment variable is not set."
    echo "   AI features will not work without it."
    echo "   Set it in your .env file or export it:"
    echo "   export OPENAI_API_KEY=your_api_key_here"
    echo ""
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
pnpm install

# Start the development servers
echo "🔥 Starting development servers..."
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start both servers in parallel
pnpm dev

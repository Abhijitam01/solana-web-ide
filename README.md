# 🚀 Solana AI IDE

> **The ultimate AI-powered development environment for Solana blockchain**

Build, deploy, and learn Solana programs with integrated AI assistance, wallet connection, and modern web IDE. Think of it as "Cursor meets Remix, but for Solana."

## ✨ Features

### 🧩 AI-Powered Code Assistance
- Built-in AI chat trained specifically on Solana + Anchor codebases
- Understands Solana-specific concepts like PDAs, Accounts, CPI, and instruction serialization
- Generates and explains contract code snippets
- Suggests optimizations and security improvements

### ⚙️ One-Click Build & Deploy
- Integrated Anchor compiler and Solana test-validator
- Click a button → builds the program, deploys to Devnet
- Works seamlessly with Phantom, Solflare, or Backpack wallets
- "Compile → Deploy → Interact" in one flow

### 🎨 Modern, Elegant Web IDE
- Monaco Editor (VSCode-like experience)
- Auto dark mode
- File explorer, tabs, and syntax highlighting
- Template gallery for common contracts

### 🧭 AI Mentor Mode
- Toggle switch that turns the AI into a mentor
- Explains contract structure line-by-line
- Generates interactive tutorials
- Contextual feedback and learning

### 🏗️ Auto Frontend Generator
- Analyzes contract's instruction schema
- Auto-generates Next.js frontend boilerplate with wallet connection
- React hooks for contract interaction
- Export to Vercel with one click

### 🧰 Template Gallery
- Battle-tested open-source Solana templates
- AI-generated ready-to-deploy projects
- Examples: NFT mint, token vault, DAO voting, airdrop programs

## 🏗️ Architecture

```
Layer                Tech Stack                    Description
Frontend            Next.js 15 + TypeScript +     Rich web IDE, chat UI, file system
                    Tailwind + shadcn/ui +        contract editor
                    Monaco

Backend             Express + Node.js + OpenAI     API routes for compiling, deploying,
                    API + Solana Web3.js +        AI chat, mentor mode
                    Anchor

Blockchain Layer    Solana Devnet/Test Validator  Smart contract build/deploy testing

AI Layer            OpenAI GPT-4o-mini            Code generation, explanation, and
                    (fine-tuned for Solana)       debugging

Infra               Turborepo + Docker +          Scalable modular structure
                    PostgreSQL

Deployment          DigitalOcean App Platform /   Simple cloud deploys for hackathon
                    Vercel / Railway              or production
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- OpenAI API key
- Solana CLI (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/solana-ai-ide.git
   cd solana-ai-ide
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd apps/http-backend
   cp env.example .env
   # Add your OpenAI API key to .env
   ```

4. **Start the development servers**
   ```bash
   # From the root directory
   pnpm dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Environment Variables

Create a `.env` file in `apps/http-backend/`:

```env
# OpenAI API Key for AI assistance
OPENAI_API_KEY=your_openai_api_key_here

# Solana RPC Endpoint (optional, defaults to devnet)
SOLANA_RPC_URL=https://api.devnet.solana.com

# Server Port (optional, defaults to 3001)
PORT=3001
```

## 🎯 Usage

### 1. **Start Coding**
- Open the IDE in your browser
- Choose a template or start from scratch
- Write your Solana program in Rust

### 2. **AI Assistance**
- Use the chat panel to ask questions
- Generate contracts from descriptions
- Get code explanations and optimizations

### 3. **Compile & Deploy**
- Click the "Compile" button to build your program
- Connect your wallet (Phantom, Solflare, etc.)
- Deploy to Solana Devnet with one click

### 4. **Generate Frontend**
- After deployment, generate a Next.js frontend
- Customize the UI and export to Vercel

## 🧰 Available Templates

- **NFT Mint Program** - Complete NFT minting with metadata
- **Token Vault** - Secure token storage and management
- **DAO Voting** - Decentralized governance voting system
- **Token Airdrop** - Automated token distribution
- **Marketplace Listing** - NFT marketplace functionality

## 🤖 AI Commands

The AI assistant understands these commands:

- `"Generate an NFT minting program"`
- `"Explain this PDA usage"`
- `"Fix my CPI error"`
- `"Optimize this contract for gas"`
- `"Create a token vault with multi-sig"`

## 🔧 Development

### Project Structure

```
solana-ai-ide/
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── http-backend/        # Express API server
│   └── ws-backend/          # WebSocket server (future)
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── eslint-config/       # Shared ESLint config
│   └── typescript-config/  # Shared TypeScript config
└── turbo.json              # Turborepo configuration
```

### Adding New Templates

1. Add template to `apps/http-backend/src/index.ts`
2. Create template code in the `templateCode` object
3. Update the templates array with metadata

### Extending AI Capabilities

The AI system can be extended by:

1. Adding new system prompts in `/api/ai/chat`
2. Creating specialized endpoints for different contract types
3. Integrating with additional AI models

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### DigitalOcean App Platform

1. Create a new app from GitHub
2. Set environment variables
3. Deploy with automatic scaling

### Railway

1. Connect GitHub repository
2. Add environment variables
3. Deploy with one click

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana](https://solana.com/) - The blockchain platform
- [Anchor](https://www.anchor-lang.com/) - The Solana framework
- [OpenAI](https://openai.com/) - AI capabilities
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Next.js](https://nextjs.org/) - React framework
- [Turborepo](https://turbo.build/) - Monorepo tooling

## 📞 Support

- 📧 Email: support@solana-ai-ide.com
- 💬 Discord: [Join our community](https://discord.gg/solana-ai-ide)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/solana-ai-ide/issues)
- 📖 Docs: [Documentation](https://docs.solana-ai-ide.com)

---

**Built with ❤️ for the Solana community**
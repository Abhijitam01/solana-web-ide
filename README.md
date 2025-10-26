# 🚀 Modern Solana Browser IDE

A comprehensive, AI-powered browser IDE for Solana development with interactive learning, real-time collaboration, and seamless deployment.

## ✨ Features

### 🎯 **Core IDE Features**
- **VS Code-like Interface**: Multi-panel layout with file explorer, code editor, AI assistant, and terminal
- **Monaco Editor**: Full-featured code editor with syntax highlighting, IntelliSense, and error detection
- **AI-Powered Development**: Inline code suggestions, explanations, optimization, and security reviews
- **One-Click Deployment**: Deploy to devnet, testnet, or mainnet with a single click
- **Error Simplification**: AI-powered error explanations in plain English

### 🎓 **Learning & Education**
- **Interactive Tutorials**: Step-by-step guided coding with real-time validation
- **Comprehensive Contract Library**: Curated examples from beginner to advanced
- **AI Learning Assistant**: Personalized learning paths and concept explanations
- **Gamified Learning**: Achievements, XP points, daily challenges, and leaderboards
- **Visual Program Builder**: Drag-and-drop interface for building Solana programs

### 🤝 **Collaboration & Community**
- **Live Coding Sessions**: Real-time collaborative development
- **Study Groups**: Join learning communities and coding sessions
- **Mentorship Platform**: Connect with experienced developers
- **Code Review System**: Get feedback and suggestions from the community

### 🛠 **Advanced Development Tools**
- **Step-through Debugger**: Debug Solana programs with account inspection
- **CI/CD Integration**: GitHub Actions integration with environment management
- **Real-world Templates**: Production-ready templates for NFT marketplace, DEX, DAO, etc.
- **Mobile Optimization**: Touch-friendly interface for mobile development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd solana-web
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development servers**
   ```bash
   # Start both frontend and backend
   pnpm dev
   
   # Or start individually
   pnpm dev --filter web          # Frontend (port 3000)
   pnpm dev --filter http-backend # Backend (port 3001)
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🧪 Testing

### Run Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for CI
pnpm test:ci
```

### Test Structure
```
apps/web/__tests__/
├── components/          # Component unit tests
├── pages/              # Page integration tests
└── integration/        # End-to-end workflow tests
```

## 🏗 Project Structure

```
solana-web/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/               # App router pages and components
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── learn/         # Learning dashboard
│   │   │   ├── tutorials/     # Interactive tutorials
│   │   │   ├── sandbox/       # Sandbox environment
│   │   │   └── docs/          # Documentation system
│   │   ├── __tests__/         # Test files
│   │   └── globals.css        # Global styles and design system
│   └── http-backend/          # Express.js backend API
│       ├── api/               # API endpoints
│       ├── lib/               # Utility libraries
│       └── middleware/        # Express middleware
├── packages/
│   └── ui/                    # Shared UI components
└── docs/                      # Project documentation
```

## 🎨 Design System

### Color Palette
- **Primary**: Black (#000000) and White (#FFFFFF)
- **Accent**: Blue (#0066FF, #3B82F6) for highlights and interactive elements
- **Background**: Pure blacks (#000, #0A0A0A) and dark grays (#1A1A1A, #2A2A2A)
- **Success**: Blue-green (#00B4D8)
- **Error**: Red (#EF4444) with blue undertones

### Typography
- **Headings**: Bold, clean typography with proper hierarchy
- **Body**: Readable font sizes with optimal line spacing
- **Code**: Monaco Editor with syntax highlighting

### Animations
- **Smooth Transitions**: 250ms cubic-bezier easing
- **Micro-interactions**: Hover effects, scale transforms, and glow effects
- **Loading States**: Skeleton loaders and smooth loading transitions

## 🔧 Development

### Available Scripts

#### Frontend (apps/web)
```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm check-types      # Run TypeScript type checking
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
```

#### Backend (apps/http-backend)
```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Environment Variables

Create `.env.local` files in the respective app directories:

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_ANCHOR_PROGRAM_ID=your_program_id_here
```

#### Backend (.env)
```env
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
ANCHOR_PROGRAM_ID=your_program_id_here
OPENAI_API_KEY=your_openai_api_key_here
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./docs/contributing.md)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on ports 3000 and 3001
   pkill -f "node.*3000\|node.*3001"
   ```

2. **Dependencies not installing**
   ```bash
   # Clear cache and reinstall
   pnpm store prune
   pnpm install
   ```

3. **Tests failing**
   ```bash
   # Clear Jest cache
   pnpm test --clearCache
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana](https://solana.com/) - The blockchain platform
- [Anchor](https://www.anchor-lang.com/) - Solana development framework
- [Next.js](https://nextjs.org/) - React framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

- 📧 Email: support@solanaide.com
- 💬 Discord: [Join our community](https://discord.gg/solanaide)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/solana-web/issues)
- 📖 Docs: [Documentation](https://docs.solanaide.com)

---

**Built with ❤️ for the Solana community**
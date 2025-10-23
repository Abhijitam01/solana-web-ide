# 🔧 Backend Fixes & Real Compilation/Deployment Plan

## 🚨 **Critical Backend Issues Identified**

### 1. **AI Service Issues** ⚠️
- **Problem**: AI service returns mock responses instead of real AI calls
- **Location**: `apps/http-backend/api/ai.ts` line 14-60
- **Impact**: AI features don't work properly
- **Fix**: Replace mock with real AI service calls

### 2. **Missing Compilation System** ⚠️
- **Problem**: No real Solana program compilation
- **Location**: `apps/http-backend/api/index.ts` line 18-39
- **Impact**: Compilation always succeeds (fake)
- **Fix**: Implement Docker-based Anchor compilation

### 3. **Missing Deployment System** ⚠️
- **Problem**: No real Solana program deployment
- **Location**: `apps/http-backend/api/index.ts` line 42-64
- **Impact**: Deployment always succeeds (fake)
- **Fix**: Implement real Solana program deployment

### 4. **Incomplete Solana Services** ⚠️
- **Problem**: Solana service methods are incomplete
- **Location**: `apps/http-backend/lib/solana/`
- **Impact**: No real blockchain interaction
- **Fix**: Complete Solana service implementation

## 🛠️ **Backend Fixes Implementation Plan**

### **Phase 1: Fix AI Service (Day 1)**

#### 1.1 Replace Mock AI Responses
```typescript
// Current (MOCK):
const mockResponse = `Here's a simple Solana counter program...`;

// Fix (REAL):
const { aiService } = await import('../lib/ai');
const response = await aiService.generateCode(prompt, context);
```

#### 1.2 Update AI API Endpoints
```typescript
// File: apps/http-backend/api/ai.ts
export const generateCode = async (req: Request, res: Response) => {
  try {
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
```

### **Phase 2: Implement Real Compilation (Day 2-3)**

#### 2.1 Docker-Based Compilation System
```typescript
// File: apps/http-backend/lib/compilation/index.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

export class CompilationService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp', 'compilation');
  }

  async compileProgram(code: string, programName: string): Promise<CompilationResult> {
    const sessionId = uuidv4();
    const workDir = path.join(this.tempDir, sessionId);
    
    try {
      // Create temporary directory
      await fs.mkdir(workDir, { recursive: true });
      
      // Create Anchor project structure
      await this.createAnchorProject(workDir, code, programName);
      
      // Compile using Docker
      const result = await this.compileWithDocker(workDir);
      
      // Clean up
      await this.cleanup(workDir);
      
      return result;
    } catch (error) {
      await this.cleanup(workDir);
      throw error;
    }
  }

  private async createAnchorProject(workDir: string, code: string, programName: string) {
    // Create Anchor.toml
    const anchorToml = `[features]
seeds = false
skip-lint = false

[programs.localnet]
${programName} = "11111111111111111111111111111111"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"

[test]
startup_wait = 5000

[[test.genesis]]
address = "11111111111111111111111111111111"
program = "./target/deploy/${programName}.so"`;

    await fs.writeFile(path.join(workDir, 'Anchor.toml'), anchorToml);

    // Create Cargo.toml
    const cargoToml = `[package]
name = "${programName}"
version = "0.1.0"
description = "Created with Anchor"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "${programName}"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.29.0"
anchor-spl = "0.29.0"`;

    await fs.writeFile(path.join(workDir, 'Cargo.toml'), cargoToml);

    // Create program directory
    const programDir = path.join(workDir, 'programs', programName, 'src');
    await fs.mkdir(programDir, { recursive: true });

    // Write the program code
    await fs.writeFile(path.join(programDir, 'lib.rs'), code);
  }

  private async compileWithDocker(workDir: string): Promise<CompilationResult> {
    try {
      // Use Docker to compile with Anchor
      const command = `docker run --rm -v "${workDir}":/workspace -w /workspace anchorprotocol/anchor:latest anchor build`;
      
      const { stdout, stderr } = await execAsync(command, {
        timeout: 120000, // 2 minutes timeout
        cwd: workDir
      });

      return {
        success: true,
        output: stdout,
        errors: stderr,
        artifacts: await this.collectArtifacts(workDir)
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || '',
        errors: error.stderr || error.message,
        artifacts: []
      };
    }
  }

  private async collectArtifacts(workDir: string): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];
    
    try {
      // Look for compiled .so file
      const soFile = path.join(workDir, 'target', 'deploy', '*.so');
      const soFiles = await fs.readdir(path.dirname(soFile));
      
      for (const file of soFiles) {
        if (file.endsWith('.so')) {
          const filePath = path.join(path.dirname(soFile), file);
          const content = await fs.readFile(filePath);
          artifacts.push({
            name: file,
            type: 'program',
            content: content.toString('base64'),
            size: content.length
          });
        }
      }

      // Look for IDL file
      const idlFile = path.join(workDir, 'target', 'idl', '*.json');
      try {
        const idlFiles = await fs.readdir(path.dirname(idlFile));
        for (const file of idlFiles) {
          if (file.endsWith('.json')) {
            const filePath = path.join(path.dirname(idlFile), file);
            const content = await fs.readFile(filePath);
            artifacts.push({
              name: file,
              type: 'idl',
              content: content.toString('base64'),
              size: content.length
            });
          }
        }
      } catch (error) {
        // IDL file might not exist
      }
    } catch (error) {
      console.error('Error collecting artifacts:', error);
    }

    return artifacts;
  }

  private async cleanup(workDir: string) {
    try {
      await fs.rm(workDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Error cleaning up:', error);
    }
  }
}

interface CompilationResult {
  success: boolean;
  output: string;
  errors: string;
  artifacts: Artifact[];
}

interface Artifact {
  name: string;
  type: 'program' | 'idl';
  content: string;
  size: number;
}

export const compilationService = new CompilationService();
```

#### 2.2 Update Compilation API
```typescript
// File: apps/http-backend/api/index.ts
import { compilationService } from '../lib/compilation';

// Replace the mock compilation route
router.post('/compile', async (req, res) => {
  try {
    const { programCode, programName } = req.body;
    
    if (!programCode || !programName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Program code and name are required' 
      });
    }

    const result = await compilationService.compileProgram(programCode, programName);
    
    res.json({
      success: result.success,
      output: result.output,
      errors: result.errors,
      artifacts: result.artifacts,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({
      success: false,
      error: 'Compilation failed',
      timestamp: new Date()
    });
  }
});
```

### **Phase 3: Implement Real Deployment (Day 4-5)**

#### 3.1 Solana Program Deployment Service
```typescript
// File: apps/http-backend/lib/deployment/index.ts
import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction,
  SystemProgram,
  BPF_LOADER_PROGRAM_ID,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { SolanaService } from '../solana/connection';

export class DeploymentService {
  private solanaService: SolanaService;

  constructor() {
    this.solanaService = new SolanaService();
  }

  async deployProgram(
    programBuffer: Buffer, 
    programName: string
  ): Promise<DeploymentResult> {
    try {
      const connection = this.solanaService.getConnection();
      const wallet = this.solanaService.getWallet();
      
      // Create program account
      const programKeypair = Keypair.generate();
      const programId = programKeypair.publicKey;
      
      // Calculate space needed
      const space = programBuffer.length;
      const rent = await connection.getMinimumBalanceForRentExemption(space);
      
      // Create and send deployment transaction
      const transaction = new Transaction();
      
      // Create account instruction
      const createAccountIx = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: programId,
        lamports: rent,
        space: space,
        programId: BPF_LOADER_PROGRAM_ID,
      });
      
      // Assign program instruction
      const assignIx = SystemProgram.assign({
        accountPubkey: programId,
        programId: BPF_LOADER_PROGRAM_ID,
      });
      
      // Deploy program instruction
      const deployIx = {
        keys: [
          { pubkey: programId, isSigner: true, isWritable: true },
          { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
        ],
        programId: BPF_LOADER_PROGRAM_ID,
        data: programBuffer,
      };
      
      transaction.add(createAccountIx, assignIx, deployIx);
      
      // Send transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [wallet.payer, programKeypair],
        { commitment: 'confirmed' }
      );
      
      return {
        success: true,
        programId: programId.toString(),
        signature,
        explorerUrl: `https://explorer.solana.com/address/${programId.toString()}?cluster=devnet`,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Deployment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed',
        timestamp: new Date()
      };
    }
  }

  async getDeploymentStatus(programId: string): Promise<DeploymentStatus> {
    try {
      const connection = this.solanaService.getConnection();
      const pubkey = new PublicKey(programId);
      const accountInfo = await connection.getAccountInfo(pubkey);
      
      return {
        deployed: !!accountInfo,
        programId,
        owner: accountInfo?.owner.toString(),
        executable: accountInfo?.executable,
        lamports: accountInfo?.lamports,
        dataLength: accountInfo?.data.length
      };
    } catch (error) {
      return {
        deployed: false,
        programId,
        error: error instanceof Error ? error.message : 'Failed to check status'
      };
    }
  }
}

interface DeploymentResult {
  success: boolean;
  programId?: string;
  signature?: string;
  explorerUrl?: string;
  error?: string;
  timestamp: Date;
}

interface DeploymentStatus {
  deployed: boolean;
  programId: string;
  owner?: string;
  executable?: boolean;
  lamports?: number;
  dataLength?: number;
  error?: string;
}

export const deploymentService = new DeploymentService();
```

#### 3.2 Update Deployment API
```typescript
// File: apps/http-backend/api/index.ts
import { deploymentService } from '../lib/deployment';

// Replace the mock deployment route
router.post('/deploy', async (req, res) => {
  try {
    const { programBuffer, programName } = req.body;
    
    if (!programBuffer || !programName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Program buffer and name are required' 
      });
    }

    // Convert base64 buffer to Buffer
    const buffer = Buffer.from(programBuffer, 'base64');
    
    const result = await deploymentService.deployProgram(buffer, programName);
    
    res.json(result);
  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({
      success: false,
      error: 'Deployment failed',
      timestamp: new Date()
    });
  }
});

// Add deployment status endpoint
router.get('/deploy/status/:programId', async (req, res) => {
  try {
    const { programId } = req.params;
    const status = await deploymentService.getDeploymentStatus(programId);
    res.json(status);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check deployment status' });
  }
});
```

### **Phase 4: Complete Solana Services (Day 6-7)**

#### 4.1 Enhanced Solana Service
```typescript
// File: apps/http-backend/lib/solana/connection.ts
// Add these methods to the existing SolanaService class

async getAccountInfo(publicKey: PublicKey) {
  try {
    const accountInfo = await this.connection.getAccountInfo(publicKey);
    if (!accountInfo) {
      throw new Error('Account not found');
    }
    return {
      publicKey: publicKey.toString(),
      lamports: accountInfo.lamports,
      data: accountInfo.data.toString('base64'),
      owner: accountInfo.owner.toString(),
      executable: accountInfo.executable,
      rentEpoch: accountInfo.rentEpoch
    };
  } catch (error) {
    console.error('Error getting account info:', error);
    throw new Error('Failed to get account info');
  }
}

async getProgramAccounts(programId: PublicKey) {
  try {
    const accounts = await this.connection.getProgramAccounts(programId);
    return accounts.map(account => ({
      pubkey: account.pubkey.toString(),
      account: {
        lamports: account.account.lamports,
        data: account.account.data.toString('base64'),
        owner: account.account.owner.toString(),
        executable: account.account.executable,
        rentEpoch: account.account.rentEpoch
      }
    }));
  } catch (error) {
    console.error('Error getting program accounts:', error);
    throw new Error('Failed to get program accounts');
  }
}

async sendTransaction(transaction: Transaction): Promise<string> {
  try {
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet.payer],
      { commitment: 'confirmed' }
    );
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw new Error('Failed to send transaction');
  }
}
```

## 🐳 **Docker Setup for Compilation**

### **Dockerfile for Compilation**
```dockerfile
# File: apps/http-backend/docker/Dockerfile.compilation
FROM rust:1.75-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
RUN avm install latest
RUN avm use latest

# Set working directory
WORKDIR /workspace

# Default command
CMD ["anchor", "build"]
```

### **Docker Compose for Development**
```yaml
# File: docker-compose.dev.yml
version: '3.8'

services:
  compilation:
    build:
      context: ./apps/http-backend/docker
      dockerfile: Dockerfile.compilation
    volumes:
      - ./temp/compilation:/workspace
    environment:
      - ANCHOR_WALLET=/workspace/.config/solana/id.json
    networks:
      - solana-network

  solana-test-validator:
    image: solanalabs/solana:v1.17.0
    command: solana-test-validator --reset
    ports:
      - "8899:8899"
      - "8900:8900"
    networks:
      - solana-network

networks:
  solana-network:
    driver: bridge
```

## 📦 **Required Dependencies**

### **Backend Dependencies**
```json
// File: apps/http-backend/package.json
{
  "dependencies": {
    "@solana/web3.js": "^1.87.6",
    "@coral-xyz/anchor": "^0.29.0",
    "dockerode": "^4.0.2",
    "uuid": "^9.0.1",
    "child_process": "^1.0.2"
  }
}
```

### **Environment Variables**
```env
# File: apps/http-backend/.env
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
AI_MAX_TOKENS=4000

# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your_private_key_here
SOLANA_CLUSTER=devnet

# Docker Configuration
DOCKER_HOST=unix:///var/run/docker.sock
COMPILATION_TIMEOUT=120000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## 🚀 **Implementation Timeline**

### **Day 1: AI Service Fixes**
- [ ] Replace mock AI responses with real calls
- [ ] Test AI endpoints
- [ ] Add error handling

### **Day 2-3: Compilation System**
- [ ] Implement Docker-based compilation
- [ ] Create compilation service
- [ ] Test compilation with real Rust code
- [ ] Add artifact collection

### **Day 4-5: Deployment System**
- [ ] Implement Solana program deployment
- [ ] Create deployment service
- [ ] Test deployment to devnet
- [ ] Add deployment status checking

### **Day 6-7: Solana Services**
- [ ] Complete Solana service methods
- [ ] Add transaction handling
- [ ] Test blockchain interactions
- [ ] Add error handling

## 🧪 **Testing Strategy**

### **Unit Tests**
```typescript
// File: apps/http-backend/tests/compilation.test.ts
import { compilationService } from '../lib/compilation';

describe('Compilation Service', () => {
  test('should compile valid Rust code', async () => {
    const code = `use anchor_lang::prelude::*;
    
    declare_id!("11111111111111111111111111111111");
    
    #[program]
    pub mod test_program {
        use super::*;
        
        pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
            Ok(())
        }
    }`;
    
    const result = await compilationService.compileProgram(code, 'test_program');
    expect(result.success).toBe(true);
  });
});
```

### **Integration Tests**
```typescript
// File: apps/http-backend/tests/deployment.test.ts
import { deploymentService } from '../lib/deployment';

describe('Deployment Service', () => {
  test('should deploy program to devnet', async () => {
    const programBuffer = Buffer.from('mock_program_data');
    const result = await deploymentService.deployProgram(programBuffer, 'test_program');
    
    expect(result.success).toBe(true);
    expect(result.programId).toBeDefined();
  });
});
```

## 🎯 **Success Metrics**

### **Compilation Metrics**
- [ ] < 30 seconds compilation time
- [ ] Real error detection and reporting
- [ ] Artifact generation (program + IDL)
- [ ] Docker-based isolation

### **Deployment Metrics**
- [ ] < 60 seconds deployment time
- [ ] Real Solana network deployment
- [ ] Transaction confirmation
- [ ] Program ID generation

### **AI Service Metrics**
- [ ] Real AI responses (not mock)
- [ ] < 5 seconds response time
- [ ] Error simplification working
- [ ] Code generation working

## 🚀 **Next Steps**

1. **Start with AI Service Fixes** (Day 1)
2. **Implement Compilation System** (Day 2-3)
3. **Add Deployment System** (Day 4-5)
4. **Complete Solana Services** (Day 6-7)
5. **Test Everything End-to-End** (Day 8)

This plan will transform your Solana AI IDE from a prototype into a fully functional development environment with real compilation and deployment capabilities!

# Solana Library

This module contains Solana blockchain functionality for the IDE application.

## Features

- **Connection Management**: Handle Solana RPC connections
- **Program Management**: Load, deploy, and interact with Solana programs
- **Transaction Handling**: Send and confirm transactions
- **Account Management**: Get account info and balances
- **Wallet Integration**: Manage keypairs and wallets

## Usage

```typescript
import { solanaService, programService } from './lib/solana';

// Get connection
const connection = solanaService.getConnection();

// Get balance
const balance = await solanaService.getBalance(publicKey);

// Load program
const program = await programService.loadProgram(programId, idl);

// Call program method
const tx = await programService.callProgramMethod(programId, 'methodName', args);
```

## Configuration

Set the following environment variables:

- `SOLANA_RPC_URL`: Solana RPC endpoint (default: http://localhost:8899)
- `SOLANA_WS_URL`: Solana WebSocket endpoint (default: ws://localhost:8900)
- `SOLANA_PRIVATE_KEY`: Private key for wallet operations
- `SOLANA_PROGRAM_ID`: Default program ID to use

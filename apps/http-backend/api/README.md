# API Routes

This module contains lightweight API routes for the Solana IDE application.

## Endpoints

### AI Routes
- `POST /api/ai/generate` - Generate, explain, optimize, or test code
- `GET /api/ai/health` - AI service health check

### Solana Routes
- `GET /api/solana/balance/:publicKey` - Get account balance
- `GET /api/solana/account/:publicKey` - Get account information
- `GET /api/solana/program/:programId/accounts` - Get program accounts
- `POST /api/solana/program/:programId/:method` - Call program method
- `GET /api/solana/health` - Solana service health check

### General Routes
- `GET /api/health` - Overall service health check

## Usage Examples

```typescript
// Generate code
POST /api/ai/generate
{
  "prompt": "Create a simple token program",
  "type": "generate"
}

// Get balance
GET /api/solana/balance/11111111111111111111111111111112

// Call program method
POST /api/solana/program/YourProgramId/initialize
{
  "args": ["arg1", "arg2"]
}
```

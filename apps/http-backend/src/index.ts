import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from '../api';

// Load environment variables from multiple locations
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../env.local') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api', apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Solana AI IDE Backend running on port ${PORT}`);
  console.log(`📡 Connected to Solana ${process.env.SOLANA_RPC_URL || 'http://localhost:8899'}`);
  console.log(`🤖 AI integration ready`);
  console.log(`🔗 CORS enabled for ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});
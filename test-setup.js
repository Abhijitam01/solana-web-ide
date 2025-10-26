#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Solana IDE Setup...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Check if pnpm is installed
try {
  execSync('pnpm --version', { stdio: 'pipe' });
  console.log('✅ pnpm is installed');
} catch (error) {
  console.error('❌ pnpm is not installed. Please install it first: npm install -g pnpm');
  process.exit(1);
}

// Check if dependencies are installed
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('pnpm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies are installed');
}

// Check if frontend builds
console.log('🏗️  Testing frontend build...');
try {
  execSync('pnpm build --filter web', { stdio: 'pipe' });
  console.log('✅ Frontend builds successfully');
} catch (error) {
  console.error('❌ Frontend build failed');
  console.error(error.message);
}

// Check if backend builds
console.log('🏗️  Testing backend build...');
try {
  execSync('pnpm build --filter http-backend', { stdio: 'pipe' });
  console.log('✅ Backend builds successfully');
} catch (error) {
  console.error('❌ Backend build failed');
  console.error(error.message);
}

// Check if tests can run
console.log('🧪 Testing test setup...');
try {
  execSync('pnpm test --filter web --passWithNoTests', { stdio: 'pipe' });
  console.log('✅ Tests can run successfully');
} catch (error) {
  console.error('❌ Tests failed to run');
  console.error(error.message);
}

console.log('\n🎉 Setup verification complete!');
console.log('\n📋 Next steps:');
console.log('1. Start the development servers: pnpm dev');
console.log('2. Open http://localhost:3000 in your browser');
console.log('3. Start building amazing Solana applications! 🚀');

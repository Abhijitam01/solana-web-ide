import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fsExtra from 'fs-extra';

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
      // For now, simulate compilation and return mock artifacts
      // TODO: Implement real Docker-based compilation
      
      // Simulate compilation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if the code has basic syntax
      const codePath = path.join(workDir, 'programs', 'program', 'src', 'lib.rs');
      const code = await fs.readFile(codePath, 'utf-8');
      
      // Simple syntax check
      if (code.includes('use anchor_lang::prelude::*') && code.includes('#[program]')) {
        return {
          success: true,
          output: 'Compilation successful!',
          errors: '',
          artifacts: await this.createMockArtifacts()
        };
      } else {
        return {
          success: false,
          output: '',
          errors: 'Error: Missing required Anchor imports or program structure',
          artifacts: []
        };
      }
    } catch (error: any) {
      return {
        success: false,
        output: '',
        errors: error.message || 'Compilation failed',
        artifacts: []
      };
    }
  }

  private async createMockArtifacts(): Promise<Artifact[]> {
    // Create mock artifacts for testing
    const mockProgram = Buffer.from('mock_program_data');
    const mockIdl = JSON.stringify({
      version: "0.1.0",
      name: "program",
      instructions: [
        {
          name: "initialize",
          accounts: [],
          args: []
        }
      ]
    });

    return [
      {
        name: 'program.so',
        type: 'program',
        content: mockProgram.toString('base64'),
        size: mockProgram.length
      },
      {
        name: 'program.json',
        type: 'idl',
        content: Buffer.from(mockIdl).toString('base64'),
        size: mockIdl.length
      }
    ];
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
      await fsExtra.remove(workDir);
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

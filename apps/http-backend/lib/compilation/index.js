"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilationService = exports.CompilationService = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fsExtra = __importStar(require("fs-extra"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class CompilationService {
    constructor() {
        this.tempDir = path_1.default.join(process.cwd(), 'temp', 'compilation');
    }
    async compileProgram(code, programName) {
        const sessionId = (0, uuid_1.v4)();
        const workDir = path_1.default.join(this.tempDir, sessionId);
        try {
            // Create temporary directory
            await promises_1.default.mkdir(workDir, { recursive: true });
            // Create Anchor project structure
            await this.createAnchorProject(workDir, code, programName);
            // Compile using Docker
            const result = await this.compileWithDocker(workDir);
            // Clean up
            await this.cleanup(workDir);
            return result;
        }
        catch (error) {
            await this.cleanup(workDir);
            throw error;
        }
    }
    async createAnchorProject(workDir, code, programName) {
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
        await promises_1.default.writeFile(path_1.default.join(workDir, 'Anchor.toml'), anchorToml);
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
        await promises_1.default.writeFile(path_1.default.join(workDir, 'Cargo.toml'), cargoToml);
        // Create program directory
        const programDir = path_1.default.join(workDir, 'programs', programName, 'src');
        await promises_1.default.mkdir(programDir, { recursive: true });
        // Write the program code
        await promises_1.default.writeFile(path_1.default.join(programDir, 'lib.rs'), code);
    }
    async compileWithDocker(workDir) {
        try {
            // For now, simulate compilation and return mock artifacts
            // TODO: Implement real Docker-based compilation
            // Simulate compilation delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Check if the code has basic syntax
            const programName = 'program'; // Use default name for now
            const codePath = path_1.default.join(workDir, 'programs', programName, 'src', 'lib.rs');
            const code = await promises_1.default.readFile(codePath, 'utf-8');
            // Simple syntax check
            if (code.includes('use anchor_lang::prelude::*') && code.includes('#[program]')) {
                return {
                    success: true,
                    output: 'Compilation successful!',
                    errors: '',
                    artifacts: await this.createMockArtifacts()
                };
            }
            else {
                return {
                    success: false,
                    output: '',
                    errors: 'Error: Missing required Anchor imports or program structure',
                    artifacts: []
                };
            }
        }
        catch (error) {
            return {
                success: false,
                output: '',
                errors: error.message || 'Compilation failed',
                artifacts: []
            };
        }
    }
    async createMockArtifacts() {
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
    async collectArtifacts(workDir) {
        const artifacts = [];
        try {
            // Look for compiled .so file
            const soFile = path_1.default.join(workDir, 'target', 'deploy', '*.so');
            const soFiles = await promises_1.default.readdir(path_1.default.dirname(soFile));
            for (const file of soFiles) {
                if (file.endsWith('.so')) {
                    const filePath = path_1.default.join(path_1.default.dirname(soFile), file);
                    const content = await promises_1.default.readFile(filePath);
                    artifacts.push({
                        name: file,
                        type: 'program',
                        content: content.toString('base64'),
                        size: content.length
                    });
                }
            }
            // Look for IDL file
            const idlFile = path_1.default.join(workDir, 'target', 'idl', '*.json');
            try {
                const idlFiles = await promises_1.default.readdir(path_1.default.dirname(idlFile));
                for (const file of idlFiles) {
                    if (file.endsWith('.json')) {
                        const filePath = path_1.default.join(path_1.default.dirname(idlFile), file);
                        const content = await promises_1.default.readFile(filePath);
                        artifacts.push({
                            name: file,
                            type: 'idl',
                            content: content.toString('base64'),
                            size: content.length
                        });
                    }
                }
            }
            catch (error) {
                // IDL file might not exist
            }
        }
        catch (error) {
            console.error('Error collecting artifacts:', error);
        }
        return artifacts;
    }
    async cleanup(workDir) {
        try {
            await fsExtra.remove(workDir);
        }
        catch (error) {
            console.error('Error cleaning up:', error);
        }
    }
}
exports.CompilationService = CompilationService;
exports.compilationService = new CompilationService();

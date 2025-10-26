export declare class CompilationService {
    private tempDir;
    constructor();
    compileProgram(code: string, programName: string): Promise<CompilationResult>;
    private createAnchorProject;
    private compileWithDocker;
    private createMockArtifacts;
    private collectArtifacts;
    private cleanup;
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
export declare const compilationService: CompilationService;
export {};
//# sourceMappingURL=index.d.ts.map
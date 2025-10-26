export declare class AIService {
    private genAI;
    private model;
    private maxTokens;
    constructor();
    generateCode(prompt: string, context?: string): Promise<string>;
    explainCode(code: string): Promise<string>;
    optimizeCode(code: string): Promise<string>;
    generateTests(code: string): Promise<string>;
    analyzeSecurity(code: string): Promise<string>;
    suggestImprovements(code: string): Promise<string>;
    generateDocumentation(code: string): Promise<string>;
    simplifyError(errorMessage: string, context?: string): Promise<string>;
    analyzeCompilationError(errorOutput: string, code?: string): Promise<string>;
}
export declare const aiService: AIService;
//# sourceMappingURL=openai.d.ts.map
export { AIService, aiService } from './openai';
export interface AIRequest {
    prompt: string;
    context?: string;
    type: 'generate' | 'explain' | 'optimize' | 'test';
}
export interface AIResponse {
    content: string;
    type: string;
    timestamp: Date;
}
//# sourceMappingURL=index.d.ts.map
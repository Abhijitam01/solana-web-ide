export declare class DeploymentService {
    private solanaService;
    constructor();
    deployProgram(programBuffer: Buffer, programName: string): Promise<DeploymentResult>;
    getDeploymentStatus(programId: string): Promise<DeploymentStatus>;
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
export declare const deploymentService: DeploymentService;
export {};
//# sourceMappingURL=index.d.ts.map
import { Request, Response } from 'express';
export declare const getBalance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAccountInfo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProgramAccounts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const callProgramMethod: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getHealth: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=solana.d.ts.map
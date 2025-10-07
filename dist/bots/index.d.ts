/**
 * Consolidated bot detection module
 * Converted from Bots-fSOCIETY PHP files
 */
import { Request, Response } from 'express';
import { detectBot } from './detect.js';
import { blockRequest } from '../system/blocker.js';
export declare function comprehensiveBotCheck(req: Request, res: Response): Promise<boolean>;
export { detectBot, blockRequest };
//# sourceMappingURL=index.d.ts.map
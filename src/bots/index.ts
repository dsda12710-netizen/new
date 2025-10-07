/**
 * Consolidated bot detection module
 * Converted from Bots-fSOCIETY PHP files
 */

import { Request, Response } from 'express';

// Import individual bot detection modules
import { detectBot } from './detect.js';
import { blockRequest } from '../system/blocker.js';

// Main bot detection function that runs all checks
export async function comprehensiveBotCheck(req: Request, res: Response): Promise<boolean> {
    try {
        // Run geolocation detection
        await detectBot(req);

        // Run blocking checks
        await blockRequest(req, res);

        // If we reach here, the request is allowed
        return true;
    } catch (error) {
        console.error('Error in comprehensive bot check:', error);
        return false;
    }
}

// Export individual functions for use in other modules
export { detectBot, blockRequest };
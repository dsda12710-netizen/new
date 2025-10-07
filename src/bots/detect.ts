/**
 * Bot detection and IP geolocation module
 * Converted from PHP detect.php
 */

import axios from 'axios';
import { Request, Response } from 'express';

interface GeoLocationData {
    geoplugin_countryCode?: string;
    geoplugin_countryName?: string;
    geoplugin_city?: string;
}

function getUserIP(req: Request): string {
    const client = req.get('HTTP_CLIENT_IP') || req.get('HTTP_X_FORWARDED_FOR') || req.ip || req.socket.remoteAddress || 'unknown';

    // Simple IP validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (ipRegex.test(client)) {
        return client;
    }

    return req.ip || req.socket.remoteAddress || 'unknown';
}

async function getGeoLocation(ip: string): Promise<GeoLocationData | null> {
    try {
        const response = await axios.get(`http://www.geoplugin.net/json.gp?ip=${ip}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching geolocation:', error);
        return null;
    }
}

export async function detectBot(req: Request): Promise<void> {
    const ip = getUserIP(req);

    try {
        const details = await getGeoLocation(ip);

        if (details) {
            // Store in session (we'll use a simple in-memory store for now)
            if (details.geoplugin_countryCode) {
                req.session.countrycode1 = details.geoplugin_countryCode;
            }

            if (details.geoplugin_countryName) {
                req.session.country1 = details.geoplugin_countryName;
            }

            if (details.geoplugin_city) {
                req.session.countrycity = details.geoplugin_city;
            }
        }
    } catch (error) {
        console.error('Error in detectBot:', error);
    }
}
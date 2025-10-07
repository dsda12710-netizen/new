/**
 * System information module
 * Converted from PHP system.php
 */

const OS_PATTERNS = [
    { pattern: /windows nt 10/i, os: 'Windows 10' },
    { pattern: /windows nt 6.3/i, os: 'Windows 8.1' },
    { pattern: /windows nt 6.2/i, os: 'Windows 8' },
    { pattern: /windows nt 6.1/i, os: 'Windows 7' },
    { pattern: /windows nt 6.0/i, os: 'Windows Vista' },
    { pattern: /windows nt 5.2/i, os: 'Windows Server 2003/XP x64' },
    { pattern: /windows nt 5.1/i, os: 'Windows XP' },
    { pattern: /windows xp/i, os: 'Windows XP' },
    { pattern: /windows nt 5.0/i, os: 'Windows 2000' },
    { pattern: /windows me/i, os: 'Windows ME' },
    { pattern: /win98/i, os: 'Windows 98' },
    { pattern: /win95/i, os: 'Windows 95' },
    { pattern: /win16/i, os: 'Windows 3.11' },
    { pattern: /macintosh|mac os x/i, os: 'Mac OS X' },
    { pattern: /mac_powerpc/i, os: 'Mac OS 9' },
    { pattern: /linux/i, os: 'Linux' },
    { pattern: /ubuntu/i, os: 'Ubuntu' },
    { pattern: /iphone/i, os: 'iPhone' },
    { pattern: /ipod/i, os: 'iPod' },
    { pattern: /ipad/i, os: 'iPad' },
    { pattern: /android/i, os: 'Android' },
    { pattern: /blackberry/i, os: 'BlackBerry' },
    { pattern: /webos/i, os: 'Mobile' }
];

export function getOS(userAgent: string): string {
    for (const { pattern, os } of OS_PATTERNS) {
        if (pattern.test(userAgent)) {
            return os;
        }
    }

    return "Unknown OS Platform";
}

export function getBrowser(userAgent: string): string {
    const browserPatterns = [
        { pattern: /Chrome\/([0-9.]+)/, name: 'Chrome' },
        { pattern: /Firefox\/([0-9.]+)/, name: 'Firefox' },
        { pattern: /Safari\/([0-9.]+)/, name: 'Safari' },
        { pattern: /Opera\/([0-9.]+)/, name: 'Opera' },
        { pattern: /Edge\/([0-9.]+)/, name: 'Edge' },
        { pattern: /MSIE ([0-9.]+)/, name: 'Internet Explorer' }
    ];

    for (const { pattern, name } of browserPatterns) {
        const match = userAgent.match(pattern);
        if (match) {
            return `${name} ${match[1]}`;
        }
    }

    return 'Unknown Browser';
}
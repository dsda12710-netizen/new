/**
 * Telegram notification module
 * Converted from PHP Add_Your_TelegramAPi.php
 */
import axios from 'axios';
export class TelegramNotifier {
    constructor(botToken, chatId) {
        this.config = { botToken, chatId };
    }
    async sendMessage(text) {
        try {
            const website = `https://api.telegram.org/bot${this.config.botToken}`;
            const params = {
                chat_id: this.config.chatId,
                text: text,
            };
            const response = await axios.post(`${website}/sendMessage`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return response.data.ok;
        }
        catch (error) {
            console.error('Error sending Telegram message:', error);
            return false;
        }
    }
    async sendDocument(filePath, caption) {
        try {
            const website = `https://api.telegram.org/bot${this.config.botToken}`;
            const formData = new FormData();
            formData.append('chat_id', this.config.chatId);
            formData.append('document', filePath);
            if (caption) {
                formData.append('caption', caption);
            }
            const response = await axios.post(`${website}/sendDocument`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.ok;
        }
        catch (error) {
            console.error('Error sending Telegram document:', error);
            return false;
        }
    }
}
// Default instance with configuration from environment variables
export const telegramNotifier = new TelegramNotifier(process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN', process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID');
//# sourceMappingURL=telegram.js.map
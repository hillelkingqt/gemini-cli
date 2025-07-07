
import axios from 'axios';

const TELEGRAM_BOT_URL = 'http://localhost:3000/send-message';

export async function sendToTelegram(message: string) {
    try {
        await axios.post(TELEGRAM_BOT_URL, { message });
        // console.log('Message sent to Telegram bot.'); // For debugging, can be removed
    } catch (error) {
        console.error('Failed to send message to Telegram bot:', error.message);
    }
}


const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

// Replace with your bot's API token
const token = '7178010007:AAF2FGMMuY109WD_UWnAaaa5XgkmdRoUnS0';
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(bodyParser.json());

const PORT = 3000; // Port for the local HTTP server

let logSubscribers = new Set();

// Handle /logs command
bot.onText(/\/logs/, (msg) => {
    const chatId = msg.chat.id;
    logSubscribers.add(chatId);
    bot.sendMessage(chatId, 'You will now receive real-time logs from the Gemini CLI.');
    console.log(`Chat ID ${chatId} subscribed to logs.`);
});

// Handle other messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text !== '/logs') {
        bot.sendMessage(chatId, 'Please send the /logs command to receive updates from the Gemini CLI.');
    }
});

// HTTP endpoint to receive messages from the CLI
app.post('/send-message', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send('Message is required.');
    }

    logSubscribers.forEach(chatId => {
        bot.sendMessage(chatId, message).catch(error => {
            console.error(`Failed to send message to chat ID ${chatId}:`, error.message);
            // Optionally remove subscriber if sending consistently fails
            // logSubscribers.delete(chatId);
        });
    });
    res.status(200).send('Message sent to subscribers.');
});

app.listen(PORT, () => {
    console.log(`Telegram bot HTTP server listening on port ${PORT}`);
});

console.log('Telegram bot started in polling mode.');

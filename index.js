import TelegramBot from 'node-telegram-bot-api';

import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.TELEGRAM_TOKEN);
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });



bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data; // Data from the web app

  // Send a message back to the user in the chat
  bot.sendMessage(chatId, `Received: ${data}`);
});

// Inline button to open the web app
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;  // Remove the 'gi' here

  bot.sendMessage(chatId, 'Open the web app:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Open Web App', web_app: { url: 'https://commuserver-production.up.railway.app/' } }]
      ]
    }
  });
});



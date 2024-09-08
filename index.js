import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

console.log('TELEGRAM_TOKEN:', process.env.TELEGRAM_TOKEN);

let bot;

function startBot() {
  bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

  bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
    if (error.code === 'ETELEGRAM' && error.message.includes('terminated by other getUpdates request')) {
      console.log('Attempting to restart bot in 10 seconds...');
      setTimeout(restartBot, 10000);
    }
  });

  bot.on('error', (error) => {
    console.error('General error:', error);
  });

  bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    bot.sendMessage(chatId, `Received: ${data}`);
  });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Open the web app:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Open Web App', web_app: { url: 'https://commuserver-production.up.railway.app/' } }]
        ]
      }
    });
  });

  bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const data = msg.web_app_data.data;

    console.log('Received data from web app:', data);

    try {
      const parsedData = JSON.parse(data);
      bot.sendMessage(chatId, `Received data: ${JSON.stringify(parsedData, null, 2)}`);
    } catch (error) {
      console.error('Error parsing data:', error);
      bot.sendMessage(chatId, `Received raw data: ${data}`);
    }
  });

  console.log('Bot started successfully');
}

function restartBot() {
  if (bot) {
    bot.stopPolling();
  }
  startBot();
}

startBot();



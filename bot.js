const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

// Замените на ваш токен от BotFather
const token = process.env.TELEGRAM_BOT_TOKEN || '8932788278:AAFzaV47qHyBZ7vnMsQ6koK4cPsDweaiXi4';

// URL приложения (для Render, ngrok или localhost)
const APP_URL = process.env.RENDER_URL || process.env.NGROK_URL || 'http://localhost:3000';

const bot = new TelegramBot(token, { polling: true });
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;

    const webAppUrl = `${APP_URL}/telegram-main.html?user=${username}&id=${msg.from.id}`;
    
    bot.sendMessage(chatId, `👋 Добро пожаловать в PayPol банк!\n\nНажмите кнопку ниже для открытия приложения.`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '💳 Открыть PayPol',
                        web_app: { url: webAppUrl }
                    }
                ]
            ]
        }
    });
});

// Обработка команды /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
📱 PayPol - цифровой банк в Telegram

Команды:
/start - Начать работу с банком
/help - Справка
/balance - Показать баланс

Нажмите кнопку ниже для открытия приложения.
    `, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '💳 Открыть PayPol',
                        web_app: { url: `${APP_URL}/telegram-main.html` }
                    }
                ]
            ]
        }
    });
});

// Обработка других сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text.startsWith('/')) {
        bot.sendMessage(chatId, '👋 Привет! Введите /start для открытия банка или /help для справки.');
    }
});

// REST API для фронтенда
app.post('/api/telegram-login', (req, res) => {
    const { telegramId, username } = req.body;
    res.json({ success: true, user: { name: username, id: telegramId } });
});

app.listen(PORT, () => {
    console.log(`🤖 PayPol Telegram Bot запущен на порту ${PORT}`);
    console.log(`⚠️  ВАЖНО: Замените токен в переменной окружения TELEGRAM_BOT_TOKEN`);
    console.log(`ℹ️  Получить токен: t.me/BotFather`);
});

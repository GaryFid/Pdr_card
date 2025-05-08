import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import { BOT_TOKEN, PORT } from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Инициализация бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// URL для мини-приложения
const webAppUrl = process.env.WEB_APP_URL || 'https://your-render-app.onrender.com';

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  // Отправляем приветственное сообщение с кнопкой для запуска мини-приложения
  bot.sendMessage(chatId, 'Привет! Я бот для игры "Разгильдяй". Нажми на кнопку, чтобы начать игру.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎮 Играть', web_app: { url: webAppUrl } }]
      ]
    }
  });
});

// Обработка callback-запросов от webapp
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;
  
  bot.sendMessage(chatId, `Получены данные из мини-приложения: ${data}`);
});

// Обработка обычных сообщений
bot.on('message', (msg) => {
  // Игнорируем сообщения от webapp и команды
  if (msg.web_app_data || (msg.text && msg.text.startsWith('/'))) {
    return;
  }
  
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, `Используйте команду /start, чтобы начать игру.`);
});

// Создаем веб-сервер для Render
const app = express();

// Настраиваем статические файлы
app.use(express.static(path.join(__dirname, '../dist')));

// Основной маршрут для веб-сервера
app.get('/', (req, res) => {
  res.send('Бот работает!');
});

// Маршрут для проверки здоровья
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Маршрут для обработки всех остальных запросов (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 
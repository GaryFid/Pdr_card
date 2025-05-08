import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import { BOT_TOKEN, PORT, WEB_APP_URL } from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Логирование для отладки
console.log('Запуск приложения...');
console.log(`PORT: ${PORT}`);
console.log(`BOT_TOKEN присутствует: ${BOT_TOKEN ? 'Да' : 'Нет'}`);
console.log(`WEB_APP_URL: ${WEB_APP_URL || 'не указан'}`);

// Создаем веб-сервер для Render
const app = express();

// Настраиваем статические файлы
try {
  app.use(express.static(path.join(__dirname, '../dist')));
  console.log('Статические файлы настроены');
} catch (error) {
  console.error('Ошибка при настройке статических файлов:', error);
}

// Основной маршрут для веб-сервера
app.get('/', (req, res) => {
  console.log('Получен запрос на главную страницу');
  try {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } catch (error) {
    console.error('Ошибка при отправке index.html:', error);
    res.send('Бот работает!');
  }
});

// Маршрут для проверки здоровья
app.get('/health', (req, res) => {
  console.log('Получен запрос на проверку здоровья');
  res.status(200).send('OK');
});

// Конкретные маршруты для Telegram Web App
app.get('/app', (req, res) => {
  console.log('Получен запрос на страницу приложения');
  try {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } catch (error) {
    console.error('Ошибка при отправке index.html:', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

app.get('/assets/:file', (req, res) => {
  console.log(`Запрос статического файла: ${req.params.file}`);
  res.sendStatus(404);
});

// Запускаем сервер
const server = app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Инициализация бота (только если есть токен)
let bot;
if (BOT_TOKEN) {
  try {
    console.log('Инициализация бота Telegram...');
    bot = new TelegramBot(BOT_TOKEN, { polling: true });

    // URL для мини-приложения
    const webAppUrl = WEB_APP_URL || 'https://pdr-card.onrender.com';
    console.log(`Используется WEB_APP_URL: ${webAppUrl}`);

    // Обработка команды /start
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      console.log(`Получена команда /start от пользователя ${chatId}`);
      
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
      console.log(`Получены данные из webapp от пользователя ${chatId}: ${data}`);
      
      bot.sendMessage(chatId, `Получены данные из мини-приложения: ${data}`);
    });

    // Обработка обычных сообщений
    bot.on('message', (msg) => {
      // Игнорируем сообщения от webapp и команды
      if (msg.web_app_data || (msg.text && msg.text.startsWith('/'))) {
        return;
      }
      
      const chatId = msg.chat.id;
      console.log(`Получено обычное сообщение от пользователя ${chatId}`);
      
      bot.sendMessage(chatId, `Используйте команду /start, чтобы начать игру.`);
    });
    
    bot.on('error', (error) => {
      console.error('Ошибка в боте Telegram:', error);
    });

    console.log('Бот Telegram успешно запущен');
  } catch (error) {
    console.error('Ошибка при инициализации бота Telegram:', error);
  }
} else {
  console.warn('TELEGRAM_BOT_TOKEN не указан, бот не будет запущен');
}

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('Необработанное исключение:', error);
  // Продолжаем работу, чтобы сервер не падал
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Необработанный промис:', reason);
  // Продолжаем работу, чтобы сервер не падал
}); 

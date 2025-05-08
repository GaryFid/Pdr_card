# Разгильдяй - Telegram Mini App

Карточная игра "Разгильдяй" в виде мини-приложения для Telegram.

## Что это такое?

Это мини-приложение, которое можно запустить прямо из Telegram. Приложение реализует популярную карточную игру "Разгильдяй" с возможностью игры против ботов.

## Настройка и запуск

### Предварительные требования

- Node.js (версия 16+)
- npm или yarn
- Аккаунт на [Render](https://render.com/)
- Бот в Telegram (создается через [@BotFather](https://t.me/BotFather))

### Локальная разработка

1. Клонируйте репозиторий
2. Создайте файл `.env` в корне проекта:
   ```
   TELEGRAM_BOT_TOKEN=ваш_токен_бота
   PORT=3000
   WEB_APP_URL=https://ваш-домен.onrender.com
   ```
3. Установите зависимости: `npm install`
4. Запустите приложение в режиме разработки: `npm run dev`
5. Запустите бота: `npm run bot`

### Развертывание на Render

1. Загрузите код в Git-репозиторий (GitHub, GitLab и т.д.)
2. Создайте аккаунт на [Render](https://render.com/)
3. Создайте новый Web Service
4. Укажите URL вашего Git-репозитория
5. Настройте следующие переменные окружения:
   - `TELEGRAM_BOT_TOKEN`: токен вашего бота
   - `WEB_APP_URL`: URL вашего приложения на Render (например, https://telegram-razgildiay.onrender.com)
6. Нажмите кнопку "Create Web Service"

## Настройка мини-приложения в Telegram

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/mybots` и выберите вашего бота
3. Нажмите "Bot Settings" -> "Menu Button" -> "Configure menu button"
4. Укажите URL вашего приложения на Render
5. Теперь пользователи увидят кнопку для открытия мини-приложения в чате с вашим ботом

## Технологии

- Node.js
- Express.js
- React
- Vite
- Telegram Web App SDK
- node-telegram-bot-api

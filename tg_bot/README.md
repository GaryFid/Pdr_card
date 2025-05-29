# Разгильдяй — Telegram Mini App + Магазин за криптовалюту

Полный стек: React (Vite) + Node.js/Express + PostgreSQL + интеграция TON, Solana, Trump.

## Особенности
- Современный интерфейс на React (Telegram WebApp)
- Магазин с 5 товарами, оплата TON, Solana, Trump
- Авторизация через Telegram
- Хранение пользователей и игр в PostgreSQL (Render)
- Backend на Express, ORM Prisma
- Готово к деплою на Render

## Быстрый старт

1. Клонируйте репозиторий:
   ```
   git clone https://github.com/GaryFid/Pdr_card.git
   cd Pdr_card
   ```
2. Установите зависимости:
   - Backend: `cd server && npm install`
   - Frontend: `cd client && npm install`
3. Настройте переменные окружения (см. `.env.example`)
4. Запустите backend и frontend:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm run dev`

## Магазин (пример товаров)
1. Бустер карт — 1 TON / 0.01 SOL / 1000 TRUMP
2. Уникальный скин — 2 TON / 0.02 SOL / 2000 TRUMP
3. Аватар — 0.5 TON / 0.005 SOL / 500 TRUMP
4. Пропуск на турнир — 3 TON / 0.03 SOL / 3000 TRUMP
5. Премиум-очки — 1.5 TON / 0.015 SOL / 1500 TRUMP

## Интеграция криптовалют
- TON: TonConnect
- Solana: Phantom Wallet
- Trump: Unisat/Trump Wallet

## Деплой на Render
- PostgreSQL: бесплатный тариф
- Backend и frontend деплоятся отдельно
- Все инструкции по переменным окружения — в `.env.example`

## Лицензия
MIT 
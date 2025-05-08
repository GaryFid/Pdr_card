import dotenv from 'dotenv';

dotenv.config();

export const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
export const PORT = process.env.PORT || 10000;
export const WEB_APP_URL = process.env.WEB_APP_URL || 'https://telegram-razgildiay.onrender.com'; 
import dotenv from 'dotenv';

dotenv.config();

export const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
export const PORT = process.env.PORT || 3000;
export const WEB_APP_URL = process.env.WEB_APP_URL || 'https://your-render-app.onrender.com'; 
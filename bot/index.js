import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, '../dist')));

// Маршруты API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Определенные маршруты для приложения
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/rules', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/rating', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Обработка остальных маршрутов
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});

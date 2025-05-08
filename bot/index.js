const express = require('express');
const path = require('path');
const config = require('./config');

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

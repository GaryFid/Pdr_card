const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const prisma = require('./prisma');

const app = express();
app.use(cors());
app.use(express.json());

// CSP: разрешаем загрузку статики, картинок, стилей и скриптов
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src * data:; script-src 'self'; style-src 'self' 'unsafe-inline'");
  next();
});

// Раздача статики фронта
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA fallback для React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Роуты
app.use('/api/users', require('./routes/user'));
app.use('/api/games', require('./routes/game'));
app.use('/api/shop', require('./routes/shop'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}); 
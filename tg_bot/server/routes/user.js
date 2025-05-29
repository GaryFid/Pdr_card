const express = require('express');
const prisma = require('../prisma');
const router = express.Router();

// Регистрация или вход по Telegram ID
router.post('/auth', async (req, res) => {
  const { telegramId, username } = req.body;
  if (!telegramId) return res.status(400).json({ error: 'telegramId required' });
  let user = await prisma.user.findUnique({ where: { telegramId } });
  if (!user) {
    user = await prisma.user.create({ data: { telegramId, username } });
  }
  res.json(user);
});

// Получить профиль пользователя
router.get('/:telegramId', async (req, res) => {
  const { telegramId } = req.params;
  const user = await prisma.user.findUnique({ where: { telegramId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router; 
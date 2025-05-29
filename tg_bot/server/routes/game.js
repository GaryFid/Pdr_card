const express = require('express');
const prisma = require('../prisma');
const router = express.Router();

// Создать новую игру
router.post('/', async (req, res) => {
  const { telegramId, state } = req.body;
  const user = await prisma.user.findUnique({ where: { telegramId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const game = await prisma.game.create({ data: { userId: user.id, state } });
  res.json(game);
});

// Получить все игры пользователя
router.get('/:telegramId', async (req, res) => {
  const { telegramId } = req.params;
  const user = await prisma.user.findUnique({ where: { telegramId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const games = await prisma.game.findMany({ where: { userId: user.id } });
  res.json(games);
});

module.exports = router; 
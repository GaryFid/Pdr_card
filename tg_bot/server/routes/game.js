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

// Начать новую игру (угадай число)
router.post('/start', async (req, res) => {
  const { telegramId } = req.body;
  const user = await prisma.user.findUnique({ where: { telegramId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const secret = Math.floor(Math.random() * 100) + 1;
  const game = await prisma.game.create({
    data: {
      userId: user.id,
      state: { secret, attempts: 0, finished: false }
    }
  });
  res.json({ gameId: game.id, message: 'Игра начата! Угадайте число от 1 до 100.' });
});

// Сделать попытку угадать число
router.post('/guess', async (req, res) => {
  const { telegramId, gameId, guess } = req.body;
  const user = await prisma.user.findUnique({ where: { telegramId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game || game.userId !== user.id) return res.status(404).json({ error: 'Game not found' });
  let state = game.state;
  if (state.finished) return res.json({ message: 'Игра уже завершена!' });
  state.attempts++;
  let result;
  if (guess < state.secret) result = 'Больше';
  else if (guess > state.secret) result = 'Меньше';
  else {
    result = `Угадал за ${state.attempts} попыток!`;
    state.finished = true;
  }
  await prisma.game.update({ where: { id: gameId }, data: { state } });
  res.json({ result, attempts: state.attempts, finished: state.finished });
});

module.exports = router; 
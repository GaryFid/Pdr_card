const express = require('express');
const prisma = require('../prisma');
const router = express.Router();

// Список товаров (статично)
const items = [
  { id: 1, name: 'Бустер карт', price: 1, currency: 'TON' },
  { id: 2, name: 'Уникальный скин', price: 2, currency: 'TON' },
  { id: 3, name: 'Аватар', price: 0.5, currency: 'TON' },
  { id: 4, name: 'Пропуск на турнир', price: 3, currency: 'TON' },
  { id: 5, name: 'Премиум-очки', price: 1.5, currency: 'TON' },
];

router.get('/items', (req, res) => {
  res.json(items);
});

// Создать покупку (после оплаты)
router.post('/purchase', async (req, res) => {
  const { telegramId, itemId, amount, currency, txHash, status } = req.body;
  const user = await prisma.user.findUnique({ where: { telegramId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const item = items.find(i => i.id === itemId);
  if (!item) return res.status(400).json({ error: 'Item not found' });
  const purchase = await prisma.purchase.create({
    data: {
      userId: user.id,
      item: item.name,
      amount,
      currency,
      txHash,
      status: status || 'pending',
    },
  });
  res.json(purchase);
});

// Проверить покупку по txHash
router.get('/purchase/:txHash', async (req, res) => {
  const { txHash } = req.params;
  const purchase = await prisma.purchase.findUnique({ where: { txHash } });
  if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
  res.json(purchase);
});

module.exports = router; 
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const prisma = require('./prisma');

const app = express();
app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/users', require('./routes/user'));
app.use('/api/games', require('./routes/game'));
app.use('/api/shop', require('./routes/shop'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}); 
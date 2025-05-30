import React, { useState } from 'react';

const API = '/api';

function App() {
  const [telegramId, setTelegramId] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // Регистрация
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, username })
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else setUser(data);
    } catch (err) {
      alert('Ошибка регистрации');
    }
    setLoading(false);
  };

  // Начать игру
  const handleStartGame = async () => {
    setLoading(true);
    setResult('');
    setAttempts(0);
    setFinished(false);
    try {
      const res = await fetch(`${API}/games/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: user.telegramId })
      });
      const data = await res.json();
      setGameId(data.gameId);
      setResult(data.message);
    } catch (err) {
      alert('Ошибка старта игры');
    }
    setLoading(false);
  };

  // Отправить попытку
  const handleGuess = async (e) => {
    e.preventDefault();
    if (!guess) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/games/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: user.telegramId, gameId, guess: Number(guess) })
      });
      const data = await res.json();
      setResult(data.result);
      setAttempts(data.attempts);
      setFinished(data.finished);
      setGuess('');
    } catch (err) {
      alert('Ошибка попытки');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 32, maxWidth: 400, margin: '0 auto' }}>
      <h1>Разгильдяй — Telegram Mini App</h1>
      {!user ? (
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            placeholder="Ваш Telegram ID"
            value={telegramId}
            onChange={e => setTelegramId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} style={{ fontSize: 18, padding: '10px 24px' }}>
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <b>Пользователь:</b> {user.username || user.telegramId}
          </div>
          {!gameId || finished ? (
            <button onClick={handleStartGame} disabled={loading} style={{ fontSize: 18, padding: '10px 24px' }}>
              {loading ? 'Загрузка...' : 'Начать игру'}
            </button>
          ) : (
            <form onSubmit={handleGuess} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>Угадайте число от 1 до 100</div>
              <input
                type="number"
                min={1}
                max={100}
                value={guess}
                onChange={e => setGuess(e.target.value)}
                required
                disabled={loading || finished}
              />
              <button type="submit" disabled={loading || finished} style={{ fontSize: 18, padding: '10px 24px' }}>
                {loading ? 'Проверка...' : 'Отправить'}
              </button>
            </form>
          )}
          <div style={{ marginTop: 24, minHeight: 32 }}>
            {result && <b>{result}</b>}
            {attempts > 0 && <div>Попыток: {attempts}</div>}
          </div>
        </>
      )}
    </div>
  );
}

export default App; 
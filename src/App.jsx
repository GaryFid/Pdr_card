import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import MainMenu from './components/MainMenu';
import GameSetup from './components/GameSetup';
import Rules from './components/Rules';
import Rating from './components/Rating';
import Razgildiay from './Razgildiay';
import './App.css';

function App() {
  // Состояния приложения
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('auth'); // auth, menu, gameSetup, aiGameSetup, rules, rating, game
  const [gameSettings, setGameSettings] = useState(null);

  // Проверяем, есть ли сохраненный пользователь в localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('razgildiay_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setScreen('menu');
      } catch (e) {
        console.error('Ошибка при чтении данных пользователя:', e);
      }
    }
  }, []);

  // Обработчик авторизации
  const handleLogin = (userData) => {
    setUser(userData);
    // Сохраняем пользователя в localStorage
    localStorage.setItem('razgildiay_user', JSON.stringify(userData));
    setScreen('menu');
  };

  // Обработчик выхода
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('razgildiay_user');
    setScreen('auth');
  };

  // Обработчик начала игры
  const handleStartGame = (settings) => {
    setGameSettings(settings);
    setScreen('game');
  };

  // Рендеринг текущего экрана
  const renderScreen = () => {
    switch (screen) {
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      
      case 'menu':
        return (
          <MainMenu 
            user={user}
            onLogout={handleLogout}
            onStartGame={() => setScreen('gameSetup')}
            onStartAIGame={() => setScreen('aiGameSetup')}
            onShowRating={() => setScreen('rating')}
            onShowRules={() => setScreen('rules')}
          />
        );
      
      case 'gameSetup':
        return (
          <GameSetup
            isAIGame={false}
            onStartGame={handleStartGame}
            onBack={() => setScreen('menu')}
          />
        );
      
      case 'aiGameSetup':
        return (
          <GameSetup
            isAIGame={true}
            onStartGame={handleStartGame}
            onBack={() => setScreen('menu')}
          />
        );
      
      case 'rules':
        return (
          <Rules 
            onBack={() => setScreen('menu')}
          />
        );
      
      case 'rating':
        return (
          <Rating 
            user={user}
            onBack={() => setScreen('menu')}
          />
        );
      
      case 'game':
        return (
          <Razgildiay
            playersCount={gameSettings?.playersCount || 4}
            difficulty={gameSettings?.difficulty || 'medium'}
            isAIGame={gameSettings?.isAIGame || false}
            onBackToMenu={() => setScreen('menu')}
          />
        );
      
      default:
        return <Auth onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/sdk';

// Стили для компонента авторизации
const authStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    minHeight: '50vh',
  },
  title: {
    marginBottom: '2rem',
    textAlign: 'center',
    color: 'var(--text-color)',
  },
  button: {
    background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--accent-hover) 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    padding: '0.8rem 1.5rem',
    margin: '0.5rem 0',
    width: '250px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    fontSize: '1.5rem',
  },
  message: {
    marginTop: '1rem',
    color: 'var(--text-color)',
    textAlign: 'center',
  }
};

const Auth = ({ onLogin }) => {
  const [message, setMessage] = useState('');
  const [hoverButton, setHoverButton] = useState(null);

  useEffect(() => {
    // Если пользователь уже авторизован в Telegram, получаем его данные
    if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
      handleTelegramLogin();
    }
  }, []);

  const handleTelegramLogin = () => {
    try {
      // Получаем данные пользователя из Telegram WebApp
      const userData = WebApp.initDataUnsafe.user;
      
      if (userData) {
        console.log('Данные из Telegram:', userData);
        // Формируем объект с информацией о пользователе
        const user = {
          id: userData.id,
          username: userData.username || `user_${userData.id}`,
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          authProvider: 'telegram',
          photoUrl: userData.photo_url || '',
        };
        
        // Вызываем колбэк авторизации
        onLogin(user);
      } else {
        setMessage('Не удалось получить данные пользователя из Telegram.');
      }
    } catch (error) {
      console.error('Ошибка при авторизации через Telegram:', error);
      setMessage('Произошла ошибка при авторизации через Telegram.');
    }
  };

  const handleGoogleLogin = () => {
    try {
      // В реальном приложении здесь был бы код для OAuth авторизации через Google
      // Для демонстрации создаем тестового пользователя
      setMessage('Функция авторизации через Google в разработке.');
      
      // Имитация процесса авторизации - в реальном приложении здесь был бы запрос к API
      setTimeout(() => {
        const user = {
          id: `google_${Date.now()}`,
          username: 'google_user',
          firstName: 'Гость',
          lastName: '',
          authProvider: 'google',
          photoUrl: '',
        };
        onLogin(user);
      }, 1000);
    } catch (error) {
      console.error('Ошибка при авторизации через Google:', error);
      setMessage('Произошла ошибка при авторизации через Google.');
    }
  };

  const handleAnonymousLogin = () => {
    try {
      // Генерируем уникальный ID для анонимного пользователя
      const anonymousId = `anon_${Date.now()}`;
      const user = {
        id: anonymousId,
        username: `Гость_${anonymousId.slice(-4)}`,
        firstName: 'Гость',
        lastName: '',
        authProvider: 'anonymous',
        photoUrl: '',
      };
      onLogin(user);
    } catch (error) {
      console.error('Ошибка при анонимной авторизации:', error);
      setMessage('Произошла ошибка при анонимной авторизации.');
    }
  };

  return (
    <div style={authStyles.container}>
      <h1 style={authStyles.title}>Добро пожаловать в игру "Разгильдяй"</h1>
      
      <button 
        style={{
          ...authStyles.button,
          ...(hoverButton === 'telegram' ? authStyles.buttonHover : {})
        }} 
        onClick={handleTelegramLogin}
        onMouseEnter={() => setHoverButton('telegram')}
        onMouseLeave={() => setHoverButton(null)}
      >
        <span style={authStyles.icon}>📱</span>
        Войти через Telegram
      </button>
      
      <button 
        style={{
          ...authStyles.button,
          ...(hoverButton === 'google' ? authStyles.buttonHover : {})
        }} 
        onClick={handleGoogleLogin}
        onMouseEnter={() => setHoverButton('google')}
        onMouseLeave={() => setHoverButton(null)}
      >
        <span style={authStyles.icon}>🔍</span>
        Войти через Google
      </button>
      
      <button 
        style={{
          ...authStyles.button,
          ...(hoverButton === 'anonymous' ? authStyles.buttonHover : {})
        }} 
        onClick={handleAnonymousLogin}
        onMouseEnter={() => setHoverButton('anonymous')}
        onMouseLeave={() => setHoverButton(null)}
      >
        <span style={authStyles.icon}>👤</span>
        Играть как гость
      </button>
      
      {message && <p style={authStyles.message}>{message}</p>}
    </div>
  );
};

export default Auth; 
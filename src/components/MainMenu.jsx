import React, { useState } from 'react';

// Стили для компонента главного меню
const menuStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    minHeight: '60vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '500px',
    marginBottom: '2rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--accent-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  userName: {
    color: 'var(--text-color)',
    fontWeight: '500',
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
    padding: '1rem 1.5rem',
    margin: '0.8rem 0',
    width: '280px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '15px',
    fontSize: '1.1rem',
  },
  buttonHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    fontSize: '1.5rem',
    width: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  logoutButton: {
    background: 'transparent',
    border: '1px solid var(--button-border)',
    color: 'var(--text-color)',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  footer: {
    marginTop: '2rem',
    color: 'var(--text-color)',
    opacity: 0.7,
    fontSize: '0.9rem',
    textAlign: 'center',
  }
};

const MainMenu = ({ user, onLogout, onStartGame, onStartAIGame, onShowRating, onShowRules }) => {
  const [hoverButton, setHoverButton] = useState(null);
  
  // Получаем инициалы пользователя для аватара
  const getInitials = () => {
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    } else if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <div style={menuStyles.container}>
      <div style={menuStyles.header}>
        <div style={menuStyles.userInfo}>
          {user.photoUrl ? (
            <img 
              src={user.photoUrl} 
              alt={user.username} 
              style={menuStyles.avatar} 
            />
          ) : (
            <div style={menuStyles.avatar}>{getInitials()}</div>
          )}
          <span style={menuStyles.userName}>{user.firstName || user.username}</span>
        </div>
        <button 
          style={menuStyles.logoutButton}
          onClick={onLogout}
        >
          Выйти
        </button>
      </div>
      
      <h1 style={menuStyles.title}>Разгильдяй</h1>
      
      <button 
        style={{
          ...menuStyles.button,
          ...(hoverButton === 'play' ? menuStyles.buttonHover : {})
        }} 
        onClick={onStartGame}
        onMouseEnter={() => setHoverButton('play')}
        onMouseLeave={() => setHoverButton(null)}
      >
        <span style={menuStyles.icon}>🎮</span>
        Начать игру
      </button>
      
      <button 
        style={{
          ...menuStyles.button,
          ...(hoverButton === 'ai' ? menuStyles.buttonHover : {})
        }} 
        onClick={onStartAIGame}
        onMouseEnter={() => setHoverButton('ai')}
        onMouseLeave={() => setHoverButton(null)}
      >
        <span style={menuStyles.icon}>🤖</span>
        Игра против ИИ
      </button>
      
      <button 
        style={{
          ...menuStyles.button,
          ...(hoverButton === 'rating' ? menuStyles.buttonHover : {})
        }} 
        onClick={onShowRating}
        onMouseEnter={() => setHoverButton('rating')}
        onMouseLeave={() => setHoverButton(null)}
      >
        <span style={menuStyles.icon}>🏆</span>
        Рейтинг
      </button>
      
      <button 
        style={{
          ...menuStyles.button,
          ...(hoverButton === 'rules' ? menuStyles.buttonHover : {})
        }} 
        onClick={onShowRules}
        onMouseEnter={() => setHoverButton('rules')}
        onMouseLeave={() => setHoverButton(null)}
      >
        <span style={menuStyles.icon}>📜</span>
        Правила
      </button>
      
      <div style={menuStyles.footer}>
        Версия 1.0.0 | © 2023 Разгильдяй
      </div>
    </div>
  );
};

export default MainMenu; 
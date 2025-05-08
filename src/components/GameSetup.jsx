import React, { useState } from 'react';

// Стили для компонента настройки игры
const setupStyles = {
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    color: 'var(--text-color)',
    fontWeight: '500',
  },
  select: {
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--card-border)',
    background: 'var(--card-bg)',
    color: 'var(--text-color)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s',
  },
  selectFocus: {
    borderColor: 'var(--accent-color)',
    boxShadow: '0 0 0 2px rgba(var(--accent-color-rgb), 0.2)',
  },
  rangeContainer: {
    width: '100%',
    position: 'relative',
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '0.5rem',
  },
  rangeLabel: {
    color: 'var(--text-color)',
    fontSize: '0.85rem',
  },
  range: {
    width: '100%',
    appearance: 'none',
    height: '6px',
    borderRadius: '3px',
    background: 'var(--card-border)',
    outline: 'none',
    padding: '0',
    margin: '0',
  },
  button: {
    background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--accent-hover) 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    padding: '1rem',
    marginTop: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '1.1rem',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    background: 'transparent',
    border: '1px solid var(--button-border)',
    color: 'var(--text-color)',
    padding: '0.8rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '1rem',
  }
};

// Настраиваем стили для input range
const getRangeStyles = () => {
  return `
    input[type=range]::-webkit-slider-thumb {
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--accent-color);
      cursor: pointer;
      transition: all 0.3s;
    }
    
    input[type=range]::-webkit-slider-thumb:hover {
      background: var(--accent-hover);
      transform: scale(1.1);
    }
  `;
};

const GameSetup = ({ isAIGame, onStartGame, onBack }) => {
  const [playersCount, setPlayersCount] = useState(4);
  const [difficulty, setDifficulty] = useState('medium');
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverBack, setHoverBack] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Собираем настройки игры
    const gameSettings = {
      playersCount,
      difficulty: isAIGame ? difficulty : 'normal',
      isAIGame
    };
    
    // Передаем настройки в родительский компонент
    onStartGame(gameSettings);
  };

  return (
    <div style={setupStyles.container}>
      <style>{getRangeStyles()}</style>
      
      <h1 style={setupStyles.title}>
        {isAIGame ? 'Игра против ИИ' : 'Настройки игры'}
      </h1>
      
      <form style={setupStyles.form} onSubmit={handleSubmit}>
        <div style={setupStyles.formGroup}>
          <label style={setupStyles.label}>Количество игроков</label>
          <div style={setupStyles.rangeContainer}>
            <input 
              type="range" 
              min="4" max="9" 
              value={playersCount} 
              onChange={(e) => setPlayersCount(parseInt(e.target.value))}
              style={setupStyles.range}
            />
            <div style={setupStyles.rangeLabels}>
              <span style={setupStyles.rangeLabel}>4</span>
              <span style={setupStyles.rangeLabel}>5</span>
              <span style={setupStyles.rangeLabel}>6</span>
              <span style={setupStyles.rangeLabel}>7</span>
              <span style={setupStyles.rangeLabel}>8</span>
              <span style={setupStyles.rangeLabel}>9</span>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-color)'}}>
            Выбрано: {playersCount}
          </div>
        </div>
        
        {isAIGame && (
          <div style={setupStyles.formGroup}>
            <label style={setupStyles.label}>Сложность ИИ</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              style={setupStyles.select}
            >
              <option value="easy">Легкая</option>
              <option value="medium">Средняя</option>
              <option value="hard">Сложная</option>
            </select>
          </div>
        )}
        
        <button 
          type="submit"
          style={{
            ...setupStyles.button,
            ...(hoverSubmit ? setupStyles.buttonHover : {})
          }}
          onMouseEnter={() => setHoverSubmit(true)}
          onMouseLeave={() => setHoverSubmit(false)}
        >
          Начать игру
        </button>
        
        <button 
          type="button"
          style={{
            ...setupStyles.backButton,
            ...(hoverBack ? {transform: 'translateY(-2px)'} : {})
          }}
          onClick={onBack}
          onMouseEnter={() => setHoverBack(true)}
          onMouseLeave={() => setHoverBack(false)}
        >
          Назад
        </button>
      </form>
    </div>
  );
};

export default GameSetup; 
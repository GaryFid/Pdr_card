import React, { useState, useEffect } from 'react';

// Стили для компонента рейтинга
const ratingStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    marginBottom: '2rem',
    textAlign: 'center',
    color: 'var(--text-color)',
  },
  tabs: {
    display: 'flex',
    width: '100%',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--card-border)',
  },
  tab: {
    padding: '0.8rem 1.5rem',
    color: 'var(--text-color)',
    cursor: 'pointer',
    transition: 'all 0.3s',
    borderBottom: '3px solid transparent',
    fontWeight: '500',
  },
  activeTab: {
    borderColor: 'var(--accent-color)',
    color: 'var(--accent-color)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '2rem',
  },
  tableHeader: {
    textAlign: 'left',
    padding: '1rem',
    color: 'var(--text-color)',
    backgroundColor: 'var(--card-bg)',
    borderBottom: '2px solid var(--card-border)',
  },
  tableCell: {
    padding: '1rem',
    color: 'var(--text-color)',
    borderBottom: '1px solid var(--card-border)',
  },
  userRow: {
    backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    marginRight: '0.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  medal: {
    fontSize: '1.2rem',
    marginRight: '0.5rem',
  },
  button: {
    background: 'transparent',
    border: '1px solid var(--button-border)',
    color: 'var(--text-color)',
    padding: '0.8rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '1rem',
  },
  emptyMessage: {
    textAlign: 'center',
    color: 'var(--text-color)',
    padding: '2rem',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '8px',
    width: '100%',
  }
};

// Демо-данные для рейтинга
const mockRatingData = {
  allTime: [
    { id: 1, username: 'ИгрокProТоп', wins: 120, games: 180, winRate: 66.7 },
    { id: 2, username: 'КарточныйМастер', wins: 95, games: 150, winRate: 63.3 },
    { id: 3, username: 'ЛюбительКозырей', wins: 82, games: 135, winRate: 60.7 },
    { id: 4, username: 'КарточныйВалет', wins: 78, games: 130, winRate: 60.0 },
    { id: 5, username: 'КарточныйКороль', wins: 65, games: 110, winRate: 59.1 },
    { id: 6, username: 'МастерПик', wins: 60, games: 105, winRate: 57.1 },
    { id: 7, username: 'КозырныйАс', wins: 52, games: 95, winRate: 54.7 },
    { id: 8, username: 'КарточныйГуру', wins: 48, games: 90, winRate: 53.3 },
    { id: 9, username: 'ЛюбительКарт', wins: 45, games: 85, winRate: 52.9 },
    { id: 10, username: 'КарточныйТуз', wins: 40, games: 80, winRate: 50.0 },
  ],
  month: [
    { id: 3, username: 'ЛюбительКозырей', wins: 28, games: 40, winRate: 70.0 },
    { id: 5, username: 'КарточныйКороль', wins: 25, games: 38, winRate: 65.8 },
    { id: 2, username: 'КарточныйМастер', wins: 22, games: 35, winRate: 62.9 },
    { id: 1, username: 'ИгрокProТоп', wins: 20, games: 32, winRate: 62.5 },
    { id: 8, username: 'КарточныйГуру', wins: 18, games: 30, winRate: 60.0 },
    { id: 7, username: 'КозырныйАс', wins: 15, games: 25, winRate: 60.0 },
    { id: 4, username: 'КарточныйВалет', wins: 12, games: 22, winRate: 54.5 },
    { id: 9, username: 'ЛюбительКарт', wins: 10, games: 20, winRate: 50.0 },
    { id: 6, username: 'МастерПик', wins: 8, games: 18, winRate: 44.4 },
    { id: 10, username: 'КарточныйТуз', wins: 5, games: 15, winRate: 33.3 },
  ],
  week: [
    { id: 8, username: 'КарточныйГуру', wins: 12, games: 15, winRate: 80.0 },
    { id: 5, username: 'КарточныйКороль', wins: 10, games: 13, winRate: 76.9 },
    { id: 3, username: 'ЛюбительКозырей', wins: 8, games: 12, winRate: 66.7 },
    { id: 7, username: 'КозырныйАс', wins: 7, games: 11, winRate: 63.6 },
    { id: 1, username: 'ИгрокProТоп', wins: 6, games: 10, winRate: 60.0 },
    { id: 2, username: 'КарточныйМастер', wins: 5, games: 9, winRate: 55.6 },
    { id: 9, username: 'ЛюбительКарт', wins: 4, games: 8, winRate: 50.0 },
    { id: 4, username: 'КарточныйВалет', wins: 3, games: 7, winRate: 42.9 },
    { id: 6, username: 'МастерПик', wins: 2, games: 6, winRate: 33.3 },
    { id: 10, username: 'КарточныйТуз', wins: 1, games: 5, winRate: 20.0 },
  ]
};

const Rating = ({ user, onBack }) => {
  const [period, setPeriod] = useState('allTime');
  const [ratingData, setRatingData] = useState([]);
  const [hoverBack, setHoverBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Имитация загрузки данных с сервера
  useEffect(() => {
    setIsLoading(true);
    
    // Имитация задержки сетевого запроса
    const timer = setTimeout(() => {
      setRatingData(mockRatingData[period]);
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [period]);

  // Получаем медаль для первых 3-х мест
  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  // Получаем инициалы для аватара
  const getInitials = (username) => {
    return username.charAt(0).toUpperCase();
  };

  // Проверяем, является ли строка строкой текущего пользователя
  const isCurrentUser = (playerId) => {
    return user && user.id === playerId;
  };

  return (
    <div style={ratingStyles.container}>
      <h1 style={ratingStyles.title}>Рейтинг игроков</h1>
      
      <div style={ratingStyles.tabs}>
        <div 
          style={{
            ...ratingStyles.tab,
            ...(period === 'allTime' ? ratingStyles.activeTab : {})
          }}
          onClick={() => setPeriod('allTime')}
        >
          За все время
        </div>
        <div 
          style={{
            ...ratingStyles.tab,
            ...(period === 'month' ? ratingStyles.activeTab : {})
          }}
          onClick={() => setPeriod('month')}
        >
          За месяц
        </div>
        <div 
          style={{
            ...ratingStyles.tab,
            ...(period === 'week' ? ratingStyles.activeTab : {})
          }}
          onClick={() => setPeriod('week')}
        >
          За неделю
        </div>
      </div>
      
      {isLoading ? (
        <div style={ratingStyles.emptyMessage}>Загрузка рейтинга...</div>
      ) : ratingData.length === 0 ? (
        <div style={ratingStyles.emptyMessage}>Нет данных для отображения</div>
      ) : (
        <table style={ratingStyles.table}>
          <thead>
            <tr>
              <th style={ratingStyles.tableHeader}>Место</th>
              <th style={ratingStyles.tableHeader}>Игрок</th>
              <th style={ratingStyles.tableHeader}>Побед</th>
              <th style={ratingStyles.tableHeader}>Игр</th>
              <th style={ratingStyles.tableHeader}>% побед</th>
            </tr>
          </thead>
          <tbody>
            {ratingData.map((player, index) => (
              <tr 
                key={player.id}
                style={isCurrentUser(player.id) ? {...ratingStyles.userRow} : {}}
              >
                <td style={ratingStyles.tableCell}>
                  <span style={ratingStyles.medal}>{getMedal(index)}</span>
                </td>
                <td style={ratingStyles.tableCell}>
                  <div style={ratingStyles.userInfo}>
                    <div style={ratingStyles.avatar}>
                      {getInitials(player.username)}
                    </div>
                    {player.username} {isCurrentUser(player.id) && '(Вы)'}
                  </div>
                </td>
                <td style={ratingStyles.tableCell}>{player.wins}</td>
                <td style={ratingStyles.tableCell}>{player.games}</td>
                <td style={ratingStyles.tableCell}>{player.winRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <button 
        style={{
          ...ratingStyles.button,
          ...(hoverBack ? {transform: 'translateY(-2px)'} : {})
        }}
        onClick={onBack}
        onMouseEnter={() => setHoverBack(true)}
        onMouseLeave={() => setHoverBack(false)}
      >
        Назад
      </button>
    </div>
  );
};

export default Rating; 
import React, { useState } from 'react';

// Стили для компонента правил
const rulesStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    marginBottom: '2rem',
    textAlign: 'center',
    color: 'var(--text-color)',
  },
  section: {
    marginBottom: '2rem',
    width: '100%',
  },
  subtitle: {
    color: 'var(--text-color)',
    marginBottom: '1rem',
    borderBottom: '1px solid var(--card-border)',
    paddingBottom: '0.5rem',
  },
  text: {
    color: 'var(--text-color)',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  list: {
    color: 'var(--text-color)',
    lineHeight: '1.6',
    marginBottom: '1rem',
    paddingLeft: '1.5rem',
  },
  listItem: {
    marginBottom: '0.5rem',
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
  }
};

const Rules = ({ onBack }) => {
  const [hoverBack, setHoverBack] = useState(false);

  return (
    <div style={rulesStyles.container}>
      <h1 style={rulesStyles.title}>Правила игры "Разгильдяй"</h1>
      
      <div style={rulesStyles.section}>
        <h2 style={rulesStyles.subtitle}>Общее описание</h2>
        <p style={rulesStyles.text}>
          "Разгильдяй" - это карточная игра, в которой участвуют от 4 до 9 игроков.
          Цель игры - избавиться от всех своих карт быстрее других игроков. Последний 
          оставшийся с картами проигрывает и получает прозвище "Разгильдяй".
        </p>
      </div>
      
      <div style={rulesStyles.section}>
        <h2 style={rulesStyles.subtitle}>Подготовка к игре</h2>
        <p style={rulesStyles.text}>
          Для игры используется стандартная колода из 52 карт. Карты раздаются поровну всем игрокам.
          Каждый игрок получает две карты "в пеньки" (карты, которые кладутся отдельно и используются
          в конце игры) и одну карту в руку.
        </p>
      </div>
      
      <div style={rulesStyles.section}>
        <h2 style={rulesStyles.subtitle}>Процесс игры</h2>
        <p style={rulesStyles.text}>
          Игра состоит из двух стадий:
        </p>
        <ul style={rulesStyles.list}>
          <li style={rulesStyles.listItem}>
            <strong>Стадия пасьянса</strong> - игроки по очереди выкладывают карты на стол. Карту можно положить,
            если она на единицу меньше уже выложенной карты. Если игрок не может положить карту, он берёт карту из колоды.
          </li>
          <li style={rulesStyles.listItem}>
            <strong>Классическая игра</strong> - начинается, когда колода заканчивается и все игроки разобрали 
            карты. Карты со стола раздаются игрокам. Игрок ходит картой, а следующий за ним игрок должен побить 
            её картой той же масти, но более высокого достоинства.
          </li>
        </ul>
      </div>
      
      <div style={rulesStyles.section}>
        <h2 style={rulesStyles.subtitle}>Особые правила</h2>
        <ul style={rulesStyles.list}>
          <li style={rulesStyles.listItem}>
            <strong>Козырь</strong> - последняя карта колоды становится козырной (кроме карт пиковой масти).
            Козырная карта бьёт любую некозырную карту.
          </li>
          <li style={rulesStyles.listItem}>
            <strong>Пики</strong> - карты пиковой масти бьются только пиками.
          </li>
          <li style={rulesStyles.listItem}>
            <strong>Пеньки</strong> - когда у игрока заканчиваются карты в руке, он использует свои "пеньки".
            В первой стадии пенёк переходит в руку, во второй - сразу используется для хода.
          </li>
        </ul>
      </div>
      
      <div style={rulesStyles.section}>
        <h2 style={rulesStyles.subtitle}>Конец игры</h2>
        <p style={rulesStyles.text}>
          Игра заканчивается, когда у всех игроков, кроме одного, заканчиваются карты в руке и пеньки.
          Последний игрок с картами становится "Разгильдяем".
        </p>
      </div>
      
      <button 
        style={{
          ...rulesStyles.button,
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

export default Rules; 
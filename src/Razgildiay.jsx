import React, { useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';
import './game2.css';

// Константы для карт
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['♠', '♥', '♦', '♣'];
const RANK_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 9;

const Razgildiay = () => {
  // Состояния игры
  const [gameStage, setGameStage] = useState(1); // 1 - пасьянс, 2 - классическая игра
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [tableCards, setTableCards] = useState([]);
  const [trumpCard, setTrumpCard] = useState(null);
  const [gameMessage, setGameMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [isDefending, setIsDefending] = useState(false);
  const [playersCount, setPlayersCount] = useState(4);
  
  // Инициализация игры
  const initializeGame = () => {
    // Создаем колоду
    const newDeck = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        newDeck.push({ rank, suit, value: RANK_VALUES[rank] });
      }
    }
    
    // Перемешиваем колоду
    const shuffledDeck = shuffleArray([...newDeck]);
    setDeck(shuffledDeck);
    
    // Создаем игроков (первый — пользователь, остальные — боты)
    const newPlayers = [];
    for (let i = 0; i < playersCount; i++) {
      newPlayers.push({
        id: i,
        name: i === 0 ? 'Вы' : `Бот ${i}`,
        hand: [],
        stumps: [],
        isBot: i !== 0,
      });
    }
    
    // Раздаем карты
    for (let i = 0; i < newPlayers.length; i++) {
      newPlayers[i].stumps.push(shuffledDeck.pop());
      newPlayers[i].stumps.push(shuffledDeck.pop());
      newPlayers[i].hand.push(shuffledDeck.pop());
    }
    
    setPlayers(newPlayers);
    setTableCards([]);
    
    // Определяем, кто ходит первым (игрок с самой старшей открытой картой)
    let highestCardIndex = 0;
    let highestValue = newPlayers[0].hand[0].value;
    
    for (let i = 1; i < newPlayers.length; i++) {
      if (newPlayers[i].hand[0].value > highestValue) {
        highestValue = newPlayers[i].hand[0].value;
        highestCardIndex = i;
      }
    }
    
    setCurrentPlayerIndex(highestCardIndex);
    setGameMessage(`Игра началась! Ходит ${newPlayers[highestCardIndex].name}`);
    setGameStarted(true);
    setIsDefending(false);
    
    // Отправляем данные в Telegram
    WebApp.MainButton.hide();
    WebApp.MainButton.setText('');
  };
  
  // Перемешивание массива (алгоритм Фишера-Йейтса)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  // Обработка хода в первой стадии (пасьянс)
  const handleStage1Move = (cardIndex) => {
    const currentPlayer = players[currentPlayerIndex];
    const card = currentPlayer.hand[cardIndex];
    
    // Проверяем, можно ли положить карту
    let canPlaceCard = false;
    
    if (tableCards.length === 0) {
      // Первая карта на столе
      canPlaceCard = true;
    } else {
      // Проверяем, есть ли карта на 1 ранг выше
      for (const tableCard of tableCards) {
        if (card.value === tableCard.value + 1) {
          canPlaceCard = true;
          break;
        }
      }
    }
    
    if (canPlaceCard) {
      // Кладем карту на стол
      const updatedPlayers = [...players];
      const updatedTableCards = [...tableCards];
      
      // Удаляем карту из руки игрока
      const cardToPlace = updatedPlayers[currentPlayerIndex].hand.splice(cardIndex, 1)[0];
      
      // Добавляем карту на стол
      updatedTableCards.push(cardToPlace);
      
      setPlayers(updatedPlayers);
      setTableCards(updatedTableCards);
      setGameMessage(`${currentPlayer.name} положил ${cardToPlace.rank}${cardToPlace.suit}`);
      
      // Проверяем, нужно ли перейти ко второй стадии
      if (deck.length === 0 && allPlayersHandsEmpty()) {
        startStage2();
      } else {
        // Переход хода к следующему игроку
        nextPlayer();
      }
    } else {
      setGameMessage('Эту карту нельзя положить. Она должна быть на 1 ранг ниже карты на столе.');
    }
  };
  
  // Проверка, пусты ли руки всех игроков
  const allPlayersHandsEmpty = () => {
    return players.every(player => player.hand.length === 0);
  };
  
  // Взятие карты из колоды
  const drawCard = () => {
    if (deck.length === 0) {
      setGameMessage('Колода пуста!');
      
      // Если колода закончилась и у всех пустые руки, переходим ко второй стадии
      if (allPlayersHandsEmpty()) {
        startStage2();
      } else {
        nextPlayer();
      }
      return;
    }
    
    const updatedPlayers = [...players];
    const updatedDeck = [...deck];
    
    // Берем карту из колоды
    const drawnCard = updatedDeck.pop();
    
    // Если это последняя карта, определяем козырь
    if (updatedDeck.length === 0) {
      // Последняя карта по масти кроме пик становится козырем
      if (drawnCard.suit !== '♠') {
        setTrumpCard(drawnCard);
      }
    }
    
    // Проверяем, можно ли положить взятую карту
    let canPlaceCard = false;
    
    if (tableCards.length === 0) {
      canPlaceCard = true;
    } else {
      for (const tableCard of tableCards) {
        if (drawnCard.value === tableCard.value - 1) {
          canPlaceCard = true;
          break;
        }
      }
    }
    
    if (canPlaceCard) {
      // Кладем карту на стол
      const updatedTableCards = [...tableCards, drawnCard];
      setTableCards(updatedTableCards);
      setGameMessage(`${players[currentPlayerIndex].name} взял ${drawnCard.rank}${drawnCard.suit} и положил на стол`);
    } else {
      // Добавляем карту в руку игрока
      updatedPlayers[currentPlayerIndex].hand.push(drawnCard);
      setGameMessage(`${players[currentPlayerIndex].name} взял ${drawnCard.rank}${drawnCard.suit} в руку`);
    }
    
    setPlayers(updatedPlayers);
    setDeck(updatedDeck);
    
    // Если колода закончилась и у всех пустые руки, переходим ко второй стадии
    if (updatedDeck.length === 0 && allPlayersHandsEmpty()) {
      startStage2();
    } else {
      // Переход хода к следующему игроку
      nextPlayer();
    }
  };
  
  // Переход ко второй стадии
  const startStage2 = () => {
    setGameStage(2);
    
    // Все открытые карты переходят в руки игроков
    const updatedPlayers = [...players];
    
    // Распределяем карты со стола между игроками
    const cardsPerPlayer = Math.floor(tableCards.length / players.length);
    let remainingCards = tableCards.length % players.length;
    
    let cardIndex = 0;
    for (let i = 0; i < updatedPlayers.length; i++) {
      for (let j = 0; j < cardsPerPlayer; j++) {
        updatedPlayers[i].hand.push(tableCards[cardIndex]);
        cardIndex++;
      }
      
      if (remainingCards > 0) {
        updatedPlayers[i].hand.push(tableCards[cardIndex]);
        cardIndex++;
        remainingCards--;
      }
    }
    
    setPlayers(updatedPlayers);
    setTableCards([]);
    setGameMessage('Начинается вторая стадия: классическая игра!');
    
    // Первым ходит игрок с наименьшим количеством карт
    let minCardsIndex = 0;
    let minCards = updatedPlayers[0].hand.length;
    
    for (let i = 1; i < updatedPlayers.length; i++) {
      if (updatedPlayers[i].hand.length < minCards) {
        minCards = updatedPlayers[i].hand.length;
        minCardsIndex = i;
      }
    }
    
    setCurrentPlayerIndex(minCardsIndex);
  };
  
  // Обработка хода во второй стадии
  const handleStage2Move = (cardIndex) => {
    if (isDefending) {
      handlePlayerDefense(cardIndex);
      return;
    }
    
    const currentPlayer = players[currentPlayerIndex];
    const card = currentPlayer.hand[cardIndex];
    
    // Определяем защищающегося игрока (справа от текущего)
    const defendingPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const defendingPlayer = players[defendingPlayerIndex];
    
    // Кладем карту на стол
    const updatedPlayers = [...players];
    const updatedTableCards = [...tableCards];
    
    // Удаляем карту из руки атакующего
    const attackingCard = updatedPlayers[currentPlayerIndex].hand.splice(cardIndex, 1)[0];
    
    // Добавляем карту на стол
    updatedTableCards.push(attackingCard);
    
    setPlayers(updatedPlayers);
    setTableCards(updatedTableCards);
    setGameMessage(`${currentPlayer.name} атакует картой ${attackingCard.rank}${attackingCard.suit}`);
    
    // Если это бот, то сразу обрабатываем защиту
    if (defendingPlayer.isBot) {
      handleBotDefense(defendingPlayerIndex, attackingCard);
    } else {
      // Если защищается игрок, ждем его действия
      setIsDefending(true);
      setGameMessage(`${defendingPlayer.name}, выберите карту для защиты или нажмите "Взять"`);
      
      // Настраиваем кнопку Telegram
      WebApp.MainButton.setText('Взять карты');
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(() => handleTakeCards());
    }
  };
  
  // Обработка защиты бота
  const handleBotDefense = (botIndex, attackingCard) => {
    const bot = players[botIndex];
    const updatedPlayers = [...players];
    const updatedTableCards = [...tableCards];
    
    // Ищем карту для защиты
    let defenseCardIndex = -1;
    
    for (let i = 0; i < bot.hand.length; i++) {
      const card = bot.hand[i];
      
      // Проверяем правила защиты
      if (canDefendWith(attackingCard, card)) {
        defenseCardIndex = i;
        break;
      }
    }
    
    if (defenseCardIndex !== -1) {
      // Бот может отбиться
      const defenseCard = updatedPlayers[botIndex].hand.splice(defenseCardIndex, 1)[0];
      updatedTableCards.push(defenseCard);
      
      setPlayers(updatedPlayers);
      setTableCards(updatedTableCards);
      setGameMessage(`${bot.name} отбивается картой ${defenseCard.rank}${defenseCard.suit}`);
      
      // Переход хода к следующему игроку
      nextPlayer();
    } else {
      // Бот не может отбиться, забирает карты
      updatedPlayers[botIndex].hand.push(...updatedTableCards);
      
      setPlayers(updatedPlayers);
      setTableCards([]);
      setGameMessage(`${bot.name} не может отбиться и забирает карты`);
      
      // Проверяем, закончилась ли игра
      checkGameEnd();
      
      // Ход переходит к следующему игроку после защищающегося
      setCurrentPlayerIndex((botIndex + 1) % players.length);
    }
  };
  
  // Проверка, может ли карта защиты побить атакующую карту
  const canDefendWith = (attackingCard, defenseCard) => {
    // Особое правило: пики бьются только пиками
    if (attackingCard.suit === '♠' && defenseCard.suit !== '♠') {
      return false;
    }
    
    // Обычные правила
    if (defenseCard.suit === attackingCard.suit) {
      return defenseCard.value > attackingCard.value;
    }
    
    // Козырь бьет некозырную карту
    if (trumpCard && defenseCard.suit === trumpCard.suit && attackingCard.suit !== trumpCard.suit) {
      return true;
    }
    
    return false;
  };
  
  // Обработка защиты игрока
  const handlePlayerDefense = (cardIndex) => {
    const defendingPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const defendingPlayer = players[defendingPlayerIndex];
    
    // Проверяем, может ли выбранная карта побить атакующую
    const defenseCard = defendingPlayer.hand[cardIndex];
    const attackingCard = tableCards[tableCards.length - 1];
    
    if (canDefendWith(attackingCard, defenseCard)) {
      // Игрок может отбиться
      const updatedPlayers = [...players];
      const updatedTableCards = [...tableCards];
      
      const cardToDefend = updatedPlayers[defendingPlayerIndex].hand.splice(cardIndex, 1)[0];
      updatedTableCards.push(cardToDefend);
      
      setPlayers(updatedPlayers);
      setTableCards(updatedTableCards);
      setGameMessage(`${defendingPlayer.name} отбивается картой ${cardToDefend.rank}${cardToDefend.suit}`);
      
      // Сбрасываем флаг защиты
      setIsDefending(false);
      
      // Скрываем кнопку Telegram
      WebApp.MainButton.hide();
      
      // Переход хода к следующему игроку
      nextPlayer();
    } else {
      setGameMessage('Эта карта не может побить атакующую карту!');
    }
  };
  
  // Игрок берет карты
  const handleTakeCards = () => {
    const defendingPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const defendingPlayer = players[defendingPlayerIndex];
    
    const updatedPlayers = [...players];
    updatedPlayers[defendingPlayerIndex].hand.push(...tableCards);
    
    setPlayers(updatedPlayers);
    setTableCards([]);
    setGameMessage(`${defendingPlayer.name} забирает карты`);
    
    // Сбрасываем флаг защиты
    setIsDefending(false);
    
    // Скрываем кнопку Telegram
    WebApp.MainButton.hide();
    
    // Проверяем, закончилась ли игра
    checkGameEnd();
    
    // Ход переходит к следующему игроку после защищающегося
    setCurrentPlayerIndex((defendingPlayerIndex + 1) % players.length);
  };
  
  // Переход хода к следующему игроку
  const nextPlayer = () => {
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };
  
  // Проверка окончания игры
  const checkGameEnd = () => {
    const activePlayers = players.filter(player => 
      player.hand.length > 0 || player.stumps.length > 0
    );
    
    if (activePlayers.length === 1) {
      // Игра закончена, остался один игрок
      setGameMessage(`Игра окончена! ${activePlayers[0].name} проиграл!`);
      setGameStarted(false);
      
      // Настраиваем кнопку Telegram для новой игры
      WebApp.MainButton.setText('Новая игра');
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(() => initializeGame());
    }
  };
  
  // Использование пенька
  const useStump = (stumpIndex) => {
    const currentPlayer = players[currentPlayerIndex];
    
    if (currentPlayer.hand.length === 0 && currentPlayer.stumps.length > 0) {
      const updatedPlayers = [...players];
      const stump = updatedPlayers[currentPlayerIndex].stumps.splice(stumpIndex, 1)[0];
      
      // В зависимости от стадии игры
      if (gameStage === 1) {
        // В первой стадии пенек идет в руку
        updatedPlayers[currentPlayerIndex].hand.push(stump);
        setGameMessage(`${currentPlayer.name} берет пенек в руку`);
      } else {
        // Во второй стадии пенек сразу используется для атаки
        const updatedTableCards = [...tableCards, stump];
        setTableCards(updatedTableCards);
        setGameMessage(`${currentPlayer.name} атакует пеньком ${stump.rank}${stump.suit}`);
        
        // Определяем защищающегося игрока
        const defendingPlayerIndex = (currentPlayerIndex + 1) % players.length;
        const defendingPlayer = players[defendingPlayerIndex];
        
        if (defendingPlayer.isBot) {
          handleBotDefense(defendingPlayerIndex, stump);
        } else {
          setIsDefending(true);
          setGameMessage(`${defendingPlayer.name}, выберите карту для защиты или нажмите "Взять"`);
          
          // Настраиваем кнопку Telegram
          WebApp.MainButton.setText('Взять карты');
          WebApp.MainButton.show();
          WebApp.MainButton.onClick(() => handleTakeCards());
        }
      }
      
      setPlayers(updatedPlayers);
    }
  };
  
  // Обработка ходов ботов
  useEffect(() => {
    if (gameStarted && players[currentPlayerIndex]?.isBot) {
      // Небольшая задержка для имитации "размышления" бота
      const botTimer = setTimeout(() => {
        const bot = players[currentPlayerIndex];
        
        if (gameStage === 1) {
          // Первая стадия - пасьянс
          // Ищем карту, которую можно положить
          let cardToPlayIndex = -1;
          
          for (let i = 0; i < bot.hand.length; i++) {
            const card = bot.hand[i];
            
            if (tableCards.length === 0) {
              cardToPlayIndex = i;
              break;
            } else {
              for (const tableCard of tableCards) {
                if (card.value === tableCard.value - 1) {
                  cardToPlayIndex = i;
                  break;
                }
              }
            }
            
            if (cardToPlayIndex !== -1) break;
          }
          
          if (cardToPlayIndex !== -1) {
            // Бот может положить карту
            handleStage1Move(cardToPlayIndex);
          } else {
            // Бот берет карту из колоды
            drawCard();
          }
        } else {
          // Вторая стадия - классическая игра
          if (bot.hand.length > 0) {
            // Бот атакует самой низкой картой
            let lowestCardIndex = 0;
            let lowestValue = bot.hand[0].value;
            
            for (let i = 1; i < bot.hand.length; i++) {
              if (bot.hand[i].value < lowestValue) {
                lowestValue = bot.hand[i].value;
                lowestCardIndex = i;
              }
            }
            
            handleStage2Move(lowestCardIndex);
          } else if (bot.stumps.length > 0) {
            // Бот использует пенек
            useStump(0);
          }
        }
      }, 1000);
      
      return () => clearTimeout(botTimer);
    }
  }, [currentPlayerIndex, gameStarted, gameStage]);
  
  // Инициализация TWA для мини-приложения
  useEffect(() => {
    if (!gameStarted) {
      WebApp.MainButton.setText('Начать игру');
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(() => initializeGame());
    }
  }, [gameStarted]);
  
  // Функция для выбора иконок игроков
  const getPlayerIcon = (playerId, isBot) => {
    if (!isBot) return '👤'; // Иконка для игрока
    
    // Разные иконки для ботов
    const botIcons = ['🤖', '💻', '🎮'];
    return botIcons[playerId % botIcons.length];
  };
  
  // Для круга: вычислим координаты для каждого игрока
  const getPlayerPosition = (index, total) => {
    const angle = (2 * Math.PI * index) / total - Math.PI / 2;
    const radius = 180;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` };
  };
  
  return (
    <div className="razgildiay-container">
      <div className="game-header">
        <h1>Разгильдяй</h1>
        <div className="game-info">
          <p>Стадия: {gameStage === 1 ? 'Пасьянс' : 'Классическая игра'}</p>
          {trumpCard && <p>Козырь: {trumpCard.rank}{trumpCard.suit}</p>}
        </div>
      </div>
      
      <div className="game-message">{gameMessage}</div>
      
      {!gameStarted ? (
        <div className="game-controls">
          <div className="players-select">
            <label>Количество игроков:</label>
            <select
              value={playersCount}
              onChange={e => setPlayersCount(Number(e.target.value))}
            >
              {Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, i) => MIN_PLAYERS + i).map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="game-board">
          {/* Круглый стол */}
          <div className="circle-table">
            <div className="table-center">
              {/* Колода */}
              {gameStage === 1 && (
                <div className="table-deck">
                  {deck.length > 0 && (
                    <>
                      <div
                        className="card deck-card"
                        onClick={() => {
                          if (currentPlayerIndex === 0 && !players[0].isBot) {
                            drawCard();
                          }
                        }}
                      >
                        ?
                      </div>
                      <div className="table-deck-count">{deck.length}</div>
                    </>
                  )}
                </div>
              )}
              {/* Карты на столе */}
              <div className="table-cards">
                {tableCards.map((card, index) => (
                  <div key={index} className="card table-card">
                    {card.rank}{card.suit}
                  </div>
                ))}
              </div>
            </div>
            {/* Игроки по кругу */}
            {players.map((player, index) => {
              const pos = getPlayerPosition(index, players.length);
              return (
                <div
                  key={index}
                  className={`player-circle ${currentPlayerIndex === index ? 'active' : ''} ${isDefending && (currentPlayerIndex + 1) % players.length === index ? 'defending' : ''}`}
                  style={{ ...pos }}
                >
                  <div className="player-avatar">
                    <span className="player-icon">{getPlayerIcon(player.id, player.isBot)}</span>
                  </div>
                  <div className="player-name">{player.name}{currentPlayerIndex === index ? ' (Ходит)' : ''}</div>
                  <div className="hand">
                    {player.hand.map((card, cardIndex) => (
                      <div
                        key={cardIndex}
                        className="card"
                        onClick={() => {
                          if (!player.isBot && ((currentPlayerIndex === index && !isDefending) ||
                            (isDefending && (currentPlayerIndex + 1) % players.length === index))) {
                            if (gameStage === 1) {
                              handleStage1Move(cardIndex);
                            } else {
                              handleStage2Move(cardIndex);
                            }
                          }
                        }}
                      >
                        {player.isBot && gameStage === 1 ? '?' : `${card.rank}${card.suit}`}
                      </div>
                    ))}
                  </div>
                  <div className="stumps">
                    {player.stumps.map((stump, stumpIndex) => (
                      <div
                        key={stumpIndex}
                        className="card stump"
                        onClick={() => {
                          if (!player.isBot && currentPlayerIndex === index && player.hand.length === 0) {
                            useStump(stumpIndex);
                          }
                        }}
                      >
                        {player.hand.length === 0 && currentPlayerIndex === index && !player.isBot ? `${stump.rank}${stump.suit}` : '?'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Razgildiay; 
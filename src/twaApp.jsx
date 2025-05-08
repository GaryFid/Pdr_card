import React, { useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';
import Razgildiay from './Razgildiay';
import './styles/game2.css';

const TwaApp = () => {
  useEffect(() => {
    // Инициализация TWA SDK
    WebApp.ready();
    WebApp.expand();
    
    // Определяем тему Telegram и применяем её к приложению
    const applyTelegramTheme = () => {
      // Получаем цвета из Telegram WebApp
      const colorScheme = WebApp.colorScheme;
      
      // Устанавливаем data-атрибут для темы
      document.documentElement.setAttribute('data-theme', colorScheme);
      
      // Устанавливаем цвета в зависимости от темы
      if (colorScheme === 'dark') {
        WebApp.setHeaderColor('#1a2234');
        WebApp.setBackgroundColor('#1a2234');
      } else {
        WebApp.setHeaderColor('#e0eaff');
        WebApp.setBackgroundColor('#e0eaff');
      }
    };
    
    // Применяем тему при запуске
    applyTelegramTheme();
    
    // Слушаем изменения темы
    WebApp.onEvent('themeChanged', applyTelegramTheme);
    
    // Настраиваем кнопку возврата в бота
    WebApp.BackButton.onClick(() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        WebApp.close();
      }
    });
    
    // Очистка при размонтировании
    return () => {
      WebApp.offEvent('themeChanged', applyTelegramTheme);
    };
  }, []);

  return (
    <div className="twa-container">
      <Razgildiay />
    </div>
  );
};

export default TwaApp; 
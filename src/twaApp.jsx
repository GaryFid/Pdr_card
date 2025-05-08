import React, { useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';
import Razgildiay from './Razgildiay';
import './styles/game2.css';

const TwaApp = () => {
  useEffect(() => {
    // Инициализация TWA SDK
    WebApp.ready();
    WebApp.expand();
    
    // Устанавливаем заголовок в шапке Telegram
    WebApp.setHeaderColor('#e0eaff');
    WebApp.setBackgroundColor('#e0eaff');
    
    // Настраиваем кнопку возврата в бота
    WebApp.BackButton.onClick(() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        WebApp.close();
      }
    });
  }, []);

  return (
    <div className="twa-container">
      <Razgildiay />
    </div>
  );
};

export default TwaApp; 
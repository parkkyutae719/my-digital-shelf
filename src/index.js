
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/Global.css'; // 전역 스타일 연결

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
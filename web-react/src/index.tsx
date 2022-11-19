/**
 * Módulo inicial do aplicativo
 * @module Index
 * @category Raiz
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

// import 'dotenv/config';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

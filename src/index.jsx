import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LocaleProvider } from './context/LocaleContext';

import './styles/style.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <LocaleProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </LocaleProvider>
);
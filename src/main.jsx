import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { loadChat } from './lib/chat.js';
import './styles.css';

const chat = await loadChat();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App chat={chat} />
  </StrictMode>,
);

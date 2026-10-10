import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { installPalette } from './design/palette';
import './styles.css';
import './design/workspace.css';
import './design/actions.css';

installPalette();

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

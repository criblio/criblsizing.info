import React from 'react';
import { createRoot } from 'react-dom/client';
import './Cribl.scss';
import App from './App';
import Header from './Navbar'

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Header />
    <App />
  </React.StrictMode>
);
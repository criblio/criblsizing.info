import React from 'react';
import ReactDOM from 'react-dom';
import './Cribl.scss';
import App from './App';
import Header from './Navbar'


ReactDOM.render(
  <React.StrictMode>
    <Header />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
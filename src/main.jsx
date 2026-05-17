import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BookingProvider } from './state/BookingContext.jsx';
import LenisProvider from './motion/LenisProvider.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BookingProvider>
      <LenisProvider>
        <App />
      </LenisProvider>
    </BookingProvider>
  </React.StrictMode>
);

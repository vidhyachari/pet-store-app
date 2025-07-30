import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './CartContext'; 

const root = document.getElementById('root');

if (!root) {
  console.error("❌ No root element found in index.html!");
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <CartProvider>
        <App />
      </CartProvider>
    </React.StrictMode>
  );
}

// App initialized successfully
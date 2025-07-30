import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import Card from './components/Card';
import Chatbot from './components/Chatbot'; //Import Chatbot component
import logo from './assets/images/furpawtique.png';
import { useCart } from './CartContext';

function App() {
  const [activeTab, setActiveTab] = useState('Toys');
  const [items, setItems] = useState([]);
  const { cartItems } = useCart(); 
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const category = activeTab.toLowerCase();
    fetch(`http://localhost:3000/api/${category}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(error => console.error("Error fetching data:", error));
  }, [activeTab]);

  return (
    <div className="app-container">
      <header className="site-header">
        <div className="logo-container">
          <img src={logo} alt="Furpawtique Logo" className="logo-img" />
          <span className="logo-text">Fur-paw-Boutique</span>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Woof" />
          </div>
          {/* This is the single, correct cart icon structure */}
          <div className="cart-icon-wrapper">
            <FiShoppingCart className="cart-icon" />
            {totalItemsInCart > 0 && (
              <span className="cart-badge">{totalItemsInCart}</span>
            )}
          </div>
        </div>
      </header>

      <h1 className="welcome-header">Welcome Paw-Friends</h1>

      <nav className="tabs">
        <button onClick={() => setActiveTab('Toys')} className={activeTab === 'Toys' ? 'active' : ''}>Toys</button>
        <button onClick={() => setActiveTab('Food')} className={activeTab === 'Food' ? 'active' : ''}>Food</button>
        <button onClick={() => setActiveTab('Grooming')} className={activeTab === 'Grooming' ? 'active' : ''}>Grooming</button>
      </nav>

      <main className="product-grid">
        {items.map(item => <Card key={item.id} item={item} />)}
      </main>
      <Chatbot />
    </div>
  );
}

export default App;
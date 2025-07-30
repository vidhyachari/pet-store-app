import React, { createContext, useContext, useState } from 'react';

// Create the context
const CartContext = createContext();

// Create a custom hook for easy access to the context
export const useCart = () => {
  return useContext(CartContext);
};

// Create the Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      // Check if the item is already in the cart
      const existingItem = prevItems.find(i => i.name === item.name);

      if (existingItem) {
        // If it exists, update its quantity
        return prevItems.map(i =>
          i.name === item.name ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      } else {
        // If it's a new item, add it to the cart with default quantity of 1 if not specified
        const newItem = {
          ...item,
          quantity: item.quantity || 1
        };
        return [...prevItems, newItem];
      }
    });
  };

  const value = {
    cartItems,
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
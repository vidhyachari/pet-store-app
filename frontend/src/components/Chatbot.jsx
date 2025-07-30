import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { useCart } from '../CartContext';
import './Chatbot.css';

function Chatbot() {
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am PawPrompt. Ask me about our stock or add items to your cart!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const newUserMessage = { role: 'user', content: inputValue };
    const allMessages = [...messages, newUserMessage];

    setMessages(allMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
      });

      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, botMessage]);

      // --- THIS IS THE UPDATED LOGIC ---
      // Check for the reliable action_details from the backend
      if (data.action_details && data.action_details.action === 'add_to_cart') {
        const itemToAdd = data.action_details.item;
        // The backend now provides the actual price from the database
        addToCart(itemToAdd);
      }

    } catch (error) {
      console.error("Chatbot API error:", error);
      const errorMessage = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h3>PawPrompt</h3>
          <button onClick={toggleChat} className="chat-close-btn"><FiX /></button>
        </div>
        <div className="messages-list">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
              {msg.content}
            </div>
          ))}
          
          {/* --- THIS IS THE CORRECTED CODE --- */}
          {isLoading && (
            <div className="message bot-message">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          {/* --- END OF FIX --- */}

          <div ref={messagesEndRef} />
        </div>
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            autoComplete="off"
          />
          <button type="submit"><FiSend /></button>
        </form>
      </div>
      <button className="chat-bubble-button" onClick={toggleChat}>
        <FiMessageSquare />
      </button>
    </>
  );
}

export default Chatbot;
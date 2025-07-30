import React from 'react';
import { getImage } from '../image-loader';
import './Card.css'; // This import is crucial

function Card({ item }) {
  const imageUrl = getImage(item.image_url);

  // For the visual effect, we'll create a fake original price.
  const originalPrice = item.price * 1.4;

  return (
    <div className="product-card">
      <img src={imageUrl} alt={item.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{item.name}</h3>
        <p className="product-desc">{item.description}</p>
        <div className="product-pricing">
          {originalPrice > item.price && (
            <span className="original-price">${originalPrice.toFixed(2)}</span>
          )}
          <span className="sale-price">${item.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
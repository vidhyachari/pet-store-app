import { useEffect, useState } from 'react';

export default function Food() {
  const [food, setFood] = useState([]);

  useEffect(() => {
    fetch('/api/food')
      .then(res => res.json())
      .then(setFood);
  }, []);

  return (
    <div className="catalog">
      <h1>🍽️ Food Catalog</h1>
      <div className="grid">
        {food.map(item => (
          <div key={item.id} className="card">
            <img src={item.image_url} alt={item.name} />
            <h2>{item.name}</h2>
            <p>${item.price.toFixed(2)}</p>
            <p>In stock: {item.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

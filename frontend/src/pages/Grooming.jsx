import { useEffect, useState } from 'react';

export default function Grooming() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/api/grooming')
      .then(res => res.json())
      .then(setServices);
  }, []);

  return (
    <div className="catalog">
      <h1>🛁 Grooming Menu</h1>
      <div className="grid">
        {services.map(service => (
          <div key={service.id} className="card">
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <p>${service.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

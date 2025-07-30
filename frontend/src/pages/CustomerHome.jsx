import React, { useEffect, useState } from 'react';

export default function CustomerHome() {
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch('/api/toys').then(res => res.json()).then(setToys);
  }, []);

  return (
    <div>
      <h1>Pet Store - Toys</h1>
      <ul>
        {toys.map(t => <li key={t.id}>{t.name}</li>)}
      </ul>
    </div>
  );
}

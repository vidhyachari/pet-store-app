import React from 'react';
import { useEffect, useState } from 'react';

export default function Toys() {
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch('/api/toys')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Fetched toys data
        setToys(data);
      })
      .catch(err => {
        console.error('Fetch error:', err);
      });
  }, []);

  return (
    <div>
      <h1>Hello from Toys</h1>
      <pre>{JSON.stringify(toys, null, 2)}</pre>
  </div>
    // <div className="catalog" style={{ padding: '2rem' }}>
    //   <h1>🧸 Toy Catalog</h1>
    //   <div
    //     className="grid"
    //     style={{
    //       display: 'grid',
    //       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    //       gap: '1.5rem',
    //     }}
    //   >
    //     {toys.map((toy) => (
    //       <div
    //         key={toy.id}
    //         className="card"
    //         style={{
    //           border: '1px solid #ddd',
    //           borderRadius: '8px',
    //           padding: '1rem',
    //           textAlign: 'center',
    //           backgroundColor: '#fff',
    //           boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    //         }}
    //       >
    //         <img
    //           src={toy.image_url || '/images/placeholder.png'}
    //           alt={toy.name}
    //           style={{
    //             width: '100%',
    //             height: '200px',
    //             objectFit: 'cover',
    //             borderRadius: '6px',
    //             marginBottom: '0.5rem',
    //           }}
    //         />
    //         <h2>{toy.name}</h2>
    //         <p><strong>${toy.price.toFixed(2)}</strong></p>
    //         <p>In stock: {toy.stock}</p>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}

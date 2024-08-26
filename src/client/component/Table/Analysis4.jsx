import React, { useEffect, useState } from 'react';

function ANA4() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/max-ticket-price')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Maximum Ticket Prices</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Movie Title</th>
            <th className="py-2">Theater Name</th>
            <th className="py-2">Max Ticket Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{item.title}</td>
              <td className="py-2">{item.theaterName}</td>
              <td className="py-2">${item.max_price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ANA4;

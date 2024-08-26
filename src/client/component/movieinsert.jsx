import React, { useState } from 'react';
import axios from 'axios';

function AddMovieForm() {
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/movies', { title, director, description }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(response.data.message);
      // Clear the form
      setTitle('');
      setDirector('');
      setDescription('');
    } catch (error) {
      console.error('Error adding movie:', error);
      setMessage('Error adding movie');
    }
  };

  return (
    <div>
      <h2>Add New Movie</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Director:</label>
          <input
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Movie</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddMovieForm;

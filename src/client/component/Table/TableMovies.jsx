import React, { useState, useEffect } from "react";
import axios from "axios";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [editMovieId, setEditMovieId] = useState(null);
  const [editMovieData, setEditMovieData] = useState({});
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [picture_url, setPicture_url] = useState("");
  const [genre, setGenre] = useState("");
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    if (role === "user") {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      alert(`You are not Staff or Admin`);
      window.location.href = "http://localhost:3000/";
    }
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/movies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleEditMovie = (movie) => {
    setEditMovieId(movie.movie_id);
    setEditMovieData({
      title: movie.title,
      director: movie.director,
      description: movie.description,
      duration: movie.duration,
      picture_url: movie.picture_url,
      genre: movie.genre,
    });
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        console.error("Unauthorized access: Not an admin");
        return;
      }
      await axios.delete(`/movies/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(movies.filter((movie) => movie.movie_id !== movieId));
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Cannot delete movie.");
    }
  };

  const handleSaveEditMovie = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        console.error("Unauthorized access: Not an admin");
        return;
      }
      await axios.put(`/movies/${editMovieId}`, editMovieData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(
        movies.map((movie) =>
          movie.movie_id === editMovieId ? editMovieData : movie
        )
      );
      setEditMovieId(null);
      setMessage("Movie information updated.");
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        console.error("Unauthorized access: Not an admin");
        setMessage("Unauthorized access: Not an admin");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/movies", // Ensure this is the correct URL to your server
        { title, director, description, duration, picture_url, genre },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      // Clear the form
      setTitle("");
      setDirector("");
      setDescription("");
      setDuration("");
      setPicture_url("");
      setGenre("");
      // Refetch movies to include the new one
      fetchMovies();
    } catch (error) {
      console.error("Error adding movie:", error);
      setMessage("Error adding movie");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-4 overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-bold mb-4">Movie List</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Movie ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Director</th>
            <th className="py-2 px-4 border-b">Duration</th>
            <th className="py-2 px-4 border-b">Genre</th>
            {userRole === "admin" && (
              <th className="py-2 px-4 border-b">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.movie_id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{movie.movie_id}</td>
              <td className="py-2 px-4 border-b">{movie.title}</td>
              <td className="py-2 px-4 border-b">{movie.director}</td>
              <td className="py-2 px-4 border-b">{movie.duration}</td>
              <td className="py-2 px-4 border-b">{movie.genre}</td>
              {userRole === "admin" && (
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => handleEditMovie(movie)}
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(movie.movie_id)}
                    className="bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {editMovieId !== null && (
        <div>
          <h3>Edit Movie</h3>
          <input
            type="text"
            name="title"
            value={editMovieData.title}
            onChange={handleChange}
            className="border rounded-md px-2 py-1"
          />
          {/* Repeat this pattern for other input fields */}
          <button
            className="bg-red-500 text-white py-1 px-3 rounded"
            onClick={handleSaveEditMovie}
          >
            Save
          </button>
        </div>
      )}
      <div>
      <h2 className="text-xl font-bold mb-4">Add New Movie</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-1">
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-md px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="director" className="mb-1">
              Director:
            </label>
            <input
              type="text"
              id="director"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              className="border rounded-md px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="mb-1">
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-md px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="duration" className="mb-1">
              Duration:
            </label>
            <textarea
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border rounded-md px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="picture_url" className="mb-1">
              Picture URL:
            </label>
            <textarea
              id="picture_url"
              value={picture_url}
              onChange={(e) => setPicture_url(e.target.value)}
              className="border rounded-md px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="genre" className="mb-1">
              Genre:
            </label>
            <textarea
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="border rounded-md px-2 py-1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Movie
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default MovieList;


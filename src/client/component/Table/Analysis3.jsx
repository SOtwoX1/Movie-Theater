import React, { useState, useEffect } from "react";
import axios from "axios";
import Rating from './../Rating';

const MovieStats = () => {
  const [movieStats, setMovieStats] = useState([]);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "user") {
      alert("You are not Staff or Admin");
      localStorage.clear();
      window.location.href = "/";
    } else {
      fetchMovieStats();
    }
  }, []);

  const fetchMovieStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/moviestats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovieStats(response.data);
    } catch (error) {
      console.error("Error fetching movie stats:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-bold mb-4">Movie MAX/MIN Rating </h2>
      {movieStats.length === 0 ? (
        <p>No movie statistics available.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Movie Title</th>
              <th className="py-2 px-4 border-b">Highest Rating</th>
              <th className="py-2 px-4 border-b">Lowest Rating</th>
              <th className="py-2 px-4 border-b">Unique Reviewers</th>
            </tr>
          </thead>
          <tbody>
            {movieStats.map((movie) => (
              <tr key={movie.movie_title} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{movie.movie_title}</td>
                <td className="py-2 px-4 border-b">{movie.highest_rating}</td>
                <td className="py-2 px-4 border-b">{movie.lowest_rating}</td>
                <td className="py-2 px-4 border-b">{movie.unique_reviewers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MovieStats;

import React, { useState, useEffect } from "react";
import axios from "axios";

const MovieSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/movies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMovies(response.data); // Limiting to 4 movies
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = searchText
    ? movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchText.toLowerCase())
      )
    : movies;

  return (
    <div className="mt-10 rounded-lg border bg-card text-card-foreground shadow-sm mx-auto max-w-2xl" data-v0-t="card">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
          Search Movies
        </h3>
        <p className="text-sm text-muted-foreground">
          Type the movie title and press search.
        </p>
      </div>
      <div className="p-6">
        <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center space-x-2">
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="search"
              placeholder="Enter movie title"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-4">
            {loading ? (
              <p>Loading movies...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              filteredMovies.map((movie) => (
                <div key={movie.movie_id} className="rounded-lg border text-card-foreground shadow-sm bg-gray-100 p-4 mb-4">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Directed by {movie.director}, Released on {movie.releasedate}
                    </p>
                  </div>
                  <div className="px-6 py-4 text-sm">{movie.description}</div>
                </div>
              ))
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieSearch;

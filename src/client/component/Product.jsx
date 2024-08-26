"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import Spinner from "./Spinner";
import ProductFilter from "./ProductFilter";

const Products = ({ props} ) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filter, setFilter] = useState("");

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:3000/moviescard");
        const formattedMovies = response.data.map((movie, index) => ({
          id: movie.id,
          name: movie.name,
          price: 200, // Remove the default price assignment
          image: movie.image,
          rating: movie.rating,
          trailer: movie.trailer,
          description: movie.description,
          bestseller: Math.random() < 0.5,
          newArrivals: Math.random() < 0.5,
          discount: 0,
          rank: index + 1, // Adding rank based on the order in response data
        }));
        setMovies(formattedMovies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };
  
    if (props && props.length > 0) {
      setMovies(props);
      setLoading(false);
    } else {
      fetchMovies();
    }
  }, [props]);
  

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-r from-neutral-300 to-stone-400">
      <ProductFilter filter={filter} setFilter={setFilter} />
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center md:grid-cols-4 gap-6">
          {filteredMovies.slice((page - 1) * pageSize, page * pageSize).map((movie, index) => (
            <ProductCard key={index} product={movie} />
          ))}
        </div>
      )}
      <div className="mt-10">
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={filteredMovies.length}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Products;

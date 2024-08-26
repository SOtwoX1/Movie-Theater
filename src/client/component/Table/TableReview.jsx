import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    fetchReviews();
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
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-bold mb-4">Review List</h2>
      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          {/* Table Header */}
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Review ID</th>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Rating</th>
              <th className="py-2 px-4 border-b">Movie ID</th>
              <th className="py-2 px-4 border-b">Comments</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {reviews.map((review) => (
              <tr key={review.review_id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{review.review_id}</td>
                <td className="py-2 px-4 border-b">{review.user_id}</td>
                <td className="py-2 px-4 border-b">{review.rating}</td>
                <td className="py-2 px-4 border-b">{review.movie_id}</td>
                <td className="py-2 px-4 border-b">{review.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReviewList;

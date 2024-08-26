import React, { useState, useEffect } from "react";
import axios from "axios";

const TheaterList = () => {
  const [theaters, setTheaters] = useState([]);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    fetchTheaters();
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

  const fetchTheaters = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/theaters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTheaters(response.data);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    }
  };

  return (
    <div className="max-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Theater List</h2>
      <table className="min-w-full bg-white border border-gray-300">
        {/* Table Header */}
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Theater ID</th>
            <th className="py-2 px-4 border-b">Theater Name</th>
            <th className="py-2 px-4 border-b">Location</th>
            <th className="py-2 px-4 border-b">Capacity</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {theaters.map((theater) => (
            <tr key={theater.theater_id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{theater.theater_id}</td>
              <td className="py-2 px-4 border-b">{theater.theaterName}</td>
              <td className="py-2 px-4 border-b">{theater.location}</td>
              <td className="py-2 px-4 border-b">{theater.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TheaterList;

import React, { useState, useEffect } from "react";
import axios from "axios";

function SeatTable() {
  const [seats, setSeats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSeats();
  }, [currentPage]); // Fetch seats whenever currentPage changes

  const fetchSeats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/seats?page=${currentPage}&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSeats(response.data);
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error("Error fetching seats:", error);
      setError(error); // Set error state if fetch fails
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditSeat = async (seat) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/seats/${seat.id}`, seat, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Seat updated successfully:", response.data);
      // You may update state or handle success feedback here
    } catch (error) {
      console.error("Error updating seat:", error);
      // Handle error feedback here
    }
  };



  const renderTableRows = () => {
    return seats.map((seat) => (
      <tr key={seat.id}>
        <td className="border px-4 py-2">{seat.seatnumber}</td>
        <td className="border px-4 py-2">{seat.price}</td>
        {/* Render other seat properties */}
        <td className="border px-4 py-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => handleEditSeat(seat)}
          >
            Edit
          </button>
        </td>
      </tr>
    ));
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(seats.length / 20);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return (
      <ul className="flex justify-center space-x-2 mt-4">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {error && <div>Error fetching seats: {error.message}</div>}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Seat Number</th>
            <th className="px-4 py-2">Price</th>
            {/* Add table headers for other seat properties */}
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      {renderPagination()}
    </div>
  );
}

export default SeatTable;

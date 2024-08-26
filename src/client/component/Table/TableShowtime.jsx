import React, { useState, useEffect } from "react";
import axios from "axios";

function ShowtimeList() {
  const [showtimes, setShowtimes] = useState([]);
  const [editShowtimeId, setEditShowtimeId] = useState(null);
  const [editShowtimeData, setEditShowtimeData] = useState({
    startTime: "",
    movieId: "",
    title: "", // Added missing state variable
    theaterId: "",
    theaterName: "",
  });
  const [startTime, setStartTime] = useState("");
  const [movieId, setMovieId] = useState("");
  const [title, setTitle] = useState(""); // Added missing state variable
  const [theaterId, setTheaterId] = useState("");
  const [theaterName, setTheaterName] = useState("");
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    fetchShowtimes();
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

  const fetchShowtimes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/showtimes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowtimes(response.data);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    }
  };

  const handleEditShowtime = (showtime) => {
    setEditShowtimeId(showtime.show_id);
    setEditShowtimeData({
      startTime: showtime.startTime,
      movieId: showtime.movie_id,
      title: showtime.title,
      theaterId: showtime.theater_id,
      theaterName: showtime.theaterName,
    });
  };

  const handleDeleteShowtime = async (showtimeId) => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        console.error("Unauthorized access: Not an admin");
        return;
      }
      await axios.delete(`/showtimes/${showtimeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowtimes(showtimes.filter((showtime) => showtime.show_id !== showtimeId));
    } catch (error) {
      console.error("Error deleting showtime:", error);
      alert("Cannot delete showtime.");
    }
  };

  const handleSaveEditShowtime = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        console.error("Unauthorized access: Not an admin");
        return;
      }
      await axios.put(`/showtimes/${editShowtimeId}`, editShowtimeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchShowtimes();
      setEditShowtimeId(null);
      alert("Showtime information updated.");
    } catch (error) {
      console.error("Error updating showtime:", error);
    }
  };

  const handleSubmitshow = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        console.error("Unauthorized access: Not an admin");
        setMessage("Unauthorized access: Not an admin");
        return;
      }
      await axios.post("/showtimes", {
        startTime,
        movie_id: movieId,
        title,
        theater_id: theaterId,
        theaterName,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Showtime added successfully.");
      fetchShowtimes();
      setStartTime("");
      setMovieId("");
      setTitle(""); // Clear title input field after submission
      setTheaterId("");
      setTheaterName("");
    } catch (error) {
      console.error("Error adding showtime:", error);
      setMessage("Error adding showtime.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("");
    }, 5000); // Clear message after 5 seconds
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Showtime List</h2>
      <table className="min-w-full bg-white border border-gray-300">
        {/* Table Headers */}
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Showtime ID</th>
            <th className="py-2 px-4 border-b">Start Time</th>
            <th className="py-2 px-4 border-b">Movie ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Theater ID</th>
            <th className="py-2 px-4 border-b">Theater Name</th>
            {userRole === "admin" && (
              <th className="py-2 px-4 border-b">Action</th>
            )}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {showtimes.map((showtime) => (
            <tr key={showtime.show_id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{showtime.show_id}</td>
              <td className="py-2 px-4 border-b">{showtime.startTime}</td>
              <td className="py-2 px-4 border-b">{showtime.movie_id}</td>
              <td className="py-2 px-4 border-b">{showtime.title}</td>
              <td className="py-2 px-4 border-b">{showtime.theater_id}</td>
              <td className="py-2 px-4 border-b">{showtime.theaterName}</td>
              {userRole === "admin" && (
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => handleEditShowtime(showtime)}
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteShowtime(showtime.show_id)}
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
      {/* Edit Showtime Form */}
      {editShowtimeId !== null && (
        <div>
          <h3>Edit Showtime</h3>
          <input
            type="datetime-local"
            name="startTime"
            value={editShowtimeData.startTime}
            onChange={(e) =>
              setEditShowtimeData({
                ...editShowtimeData,
                startTime: e.target.value,
              })
            }
            placeholder="Start Time"
          />
          <input
            type="text"
            name="movieId"
            value={editShowtimeData.movieId}
            onChange={(e) =>
              setEditShowtimeData({
                ...editShowtimeData,
                movieId: e.target.value,
              })
            }
            placeholder="Movie ID"
          />
          <input
            type="text"
            name="title"
            value={editShowtimeData.title}
            onChange={(e) =>
              setEditShowtimeData({
                ...editShowtimeData,
                title: e.target.value,
              })
            }
            placeholder="Title"
          />
          <input
            type="text"
            name="theaterId"
            value={editShowtimeData.theaterId}
            onChange={(e) =>
              setEditShowtimeData({
                ...editShowtimeData,
                theaterId: e.target.value,
              })
            }
            placeholder="Theater ID"
          />
          <input
            type="text"
            name="theaterName"
            value={editShowtimeData.theaterName}
            onChange={(e) =>
              setEditShowtimeData({
                ...editShowtimeData,
                theaterName: e.target.value,
              })
            }
            placeholder="Theater Name"
          />
          <button
            className="bg-red-500 text-white py-1 px-3 rounded"
            onClick={handleSaveEditShowtime}
          >
            Save
          </button>
        </div>
      )}
      {/* Add New Showtime Form */}
      <div>
        <h2 className="text-xl font-bold mb-4">Add New Showtime</h2>
        <form onSubmit={handleSubmitshow} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="startTime" className="mb-1">
              Start Time:
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded-md px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="movieId" className="mb-1">
              Movie ID:
            </label>
            <input
              type="text"
              id="movieId"
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              className="border rounded-md px-2 py-1"
              required
            />
          </div>
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
            <label htmlFor="theaterId" className="mb-1">
              Theater ID:
            </label>
            <input
              type="text"
              id="theaterId"
              value={theaterId}
              onChange={(e) => setTheaterId(e.target.value)}
              className="border rounded-md px-2 py-1"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="theaterName" className="mb-1">
              Theater Name:
            </label>
            <input
              type="text"
              id="theaterName"
              value={theaterName}
              onChange={(e) => setTheaterName(e.target.value)}
              className="border rounded-md px-2 py-1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Showtime
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
}

export default ShowtimeList;

import React, { useEffect, useState } from "react";
import "../index.css"; // Import the custom CSS file
import Ticket from "./ticket"; // Assuming Ticket is a separate component file

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve user_id from localStorage
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      setError("User ID is not available in localStorage");
      return;
    }

    fetch(`http://localhost:3000/api/tickets?user_id=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setTickets(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.toString());
      });
  }, []); // Dependency array is empty since we only want to fetch data once on component mount

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap justify-center min-h-screen bg-gray-100 p-4">
      {tickets.map((ticket) => (
        <div key={ticket.ticket_id} className="w-full md:w-1/2 lg:w-1/2 p-4">
          <Ticket
            movieName={ticket.movie_title}
            theatreName={ticket.theater_name}
            duration={ticket.duration}
            showtime={new Date(ticket.startTime).toLocaleTimeString()}
            date={new Date(ticket.startTime).toLocaleDateString()}
            seatName={ticket.seatnumber}
            imageUrl={ticket.picture_url}
          />
        </div>
      ))}
    </div>
  );
};

export default TicketList;

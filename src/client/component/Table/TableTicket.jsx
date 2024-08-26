import React, { useState, useEffect } from "react";
import axios from "axios";

const TicketTable = () => {
  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState({ totalTickets: 0 });
  const [editTicketId, setEditTicketId] = useState(null);
  const [editTicketData, setEditTicketData] = useState({});
  const [newTicketData, setNewTicketData] = useState({
    seat_id: "",
    show_id: "",
    user_id: "",
    // Add other fields as needed
  });

  const userRole = localStorage.getItem("role"); // Retrieve the role from local storage

  const fetchTickets = async () => {
    try {
      const response = await axios.get("/tickets");
      setTickets(response.data.slice(0, 11));
      setSummary({ totalTickets: response.data.length });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      alert("Cannot fetch tickets.");
    }
  };

  const handleEditTicket = (ticket) => {
    setEditTicketId(ticket.ticket_id);
    setEditTicketData(ticket);
  };

  const handleChange = (e) => {
    setEditTicketData({ ...editTicketData, [e.target.name]: e.target.value });
  };

  const handleSaveEditTicket = async () => {
    try {
      const url = `/tickets/${editTicketId}`;
      await axios.put(url, editTicketData);
      setTickets(
        tickets.map((t) => (t.ticket_id === editTicketId ? editTicketData : t))
      );
      setEditTicketId(null);
      alert("Ticket information updated successfully.");
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Error updating ticket. Please try again later.");
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      const url = `/tickets/${ticketId}`;
      await axios.delete(url);
      setTickets(tickets.filter((t) => t.ticket_id !== ticketId));
      alert("Ticket deleted successfully.");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("Cannot delete this ticket.");
    }
  };

  const handleAddTicket = async () => {
    try {
      const response = await axios.post("/tickets", newTicketData);
      setTickets([...tickets, response.data]);
      alert("Ticket added successfully.");
    } catch (error) {
      console.error("Error adding ticket:", error);
      alert("Cannot add ticket.");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="container mx-auto p-4 overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-bold mb-4">Ticket List</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p>Total Tickets: {summary.totalTickets}</p>
      </div>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Ticket ID</th>
            <th className="border border-gray-400 px-4 py-2">Seat ID</th>
            <th className="border border-gray-400 px-4 py-2">Show ID</th>
            <th className="border border-gray-400 px-4 py-2">User ID</th>
            {/* Add other table headers as needed */}
            <th className="border border-gray-400 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticket_id}>
              <td className="border border-gray-400 px-4 py-2">{ticket.ticket_id}</td>
              <td className="border border-gray-400 px-4 py-2">{ticket.seat_id}</td>
              <td className="border border-gray-400 px-4 py-2">{ticket.show_id}</td>
              <td className="border border-gray-400 px-4 py-2">{ticket.user_id}</td>
              {/* Add other table data cells as needed */}
              <td className="border border-gray-400 px-4 py-2">
                {userRole === "admin" && (
                  <>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleEditTicket(ticket)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDeleteTicket(ticket.ticket_id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;

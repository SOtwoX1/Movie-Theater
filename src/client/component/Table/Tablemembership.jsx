import React, { useState, useEffect } from "react";
import axios from "axios";

const MembershipTable = () => {
  const [memberships, setMemberships] = useState([]);
  const [summary, setSummary] = useState({ totalMemberships: 0 });
  const [editMembershipId, setEditMembershipId] = useState(null);
  const [editMembershipData, setEditMembershipData] = useState({});
  const [newMembershipData, setNewMembershipData] = useState({
    name: "",
    discount: "",
    // Add other fields as needed
  });

  const userRole = localStorage.getItem("role"); // Retrieve the role from local storage

  const fetchMemberships = async () => {
    try {
      const response = await axios.get("/memberships");
      setMemberships(response.data.slice(0, 11));
      setSummary({ totalMemberships: response.data.length });
    } catch (error) {
      console.error("Error fetching memberships:", error);
      alert("Cannot fetch memberships.");
    }
  };

  const handleEditMembership = (membership) => {
    setEditMembershipId(membership.member_id);
    setEditMembershipData(membership);
  };

  const handleChange = (e) => {
    setEditMembershipData({ ...editMembershipData, [e.target.name]: e.target.value });
  };

  const handleSaveEditMembership = async () => {
    try {
      const url = `/memberships/${editMembershipId}`;
      await axios.put(url, editMembershipData);
      setMemberships(
        memberships.map((m) => (m.member_id === editMembershipId ? editMembershipData : m))
      );
      setEditMembershipId(null);
      alert("Membership information updated successfully.");
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("Error updating membership. Please try again later.");
    }
  };

  const handleDeleteMembership = async (membershipId) => {
    try {
      const url = `/memberships/${membershipId}`;
      await axios.delete(url);
      setMemberships(memberships.filter((m) => m.member_id !== membershipId));
      alert("Membership deleted successfully.");
    } catch (error) {
      console.error("Error deleting membership:", error);
      alert("Cannot delete this membership.");
    }
  };

  const handleAddMembership = async () => {
    try {
      const response = await axios.post("/memberships", newMembershipData);
      setMemberships([...memberships, response.data]);
      alert("Membership added successfully.");
    } catch (error) {
      console.error("Error adding membership:", error);
      alert("Cannot add membership.");
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  return (
    <div className="container mx-auto p-4 overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-bold mb-4">Membership List</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p>Total Memberships: {summary.totalMemberships}</p>
      </div>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Membership ID</th>
            <th className="border border-gray-400 px-4 py-2">Name</th>
            <th className="border border-gray-400 px-4 py-2">Discount</th>
            <th className="border border-gray-400 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((membership) => (
            <tr key={membership.member_id}>
              <td className="border border-gray-400 px-4 py-2">{membership.member_id}</td>
              <td className="border border-gray-400 px-4 py-2">{membership.name}</td>
              <td className="border border-gray-400 px-4 py-2">{membership.discount}</td>
              <td className="border border-gray-400 px-4 py-2">
                {userRole === "admin" && (
                  <>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleEditMembership(membership)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDeleteMembership(membership.member_id)}
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
      {userRole === "admin" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Add New Membership</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newMembershipData.name}
            onChange={(e) => setNewMembershipData({ ...newMembershipData, name: e.target.value })}
            className="border border-gray-400 px-4 py-2 mr-2"
          />
          <input
            type="text"
            name="discount"
            placeholder="Discount"
            value={newMembershipData.discount}
            onChange={(e) => setNewMembershipData({ ...newMembershipData, discount: e.target.value })}
            className="border border-gray-400 px-4 py-2 mr-2"
          />
          {/* Add other input fields for new membership data as needed */}
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddMembership}
          >
            Add Membership
          </button>
        </div>
      )}
    </div>
  );
};

export default MembershipTable;

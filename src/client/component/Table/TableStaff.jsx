import React, { useState, useEffect } from "react";
import axios from "axios";

const TableStaff = () => {
  const [staff, setStaff] = useState([]);
  const [summary, setSummary] = useState({ totalStaff: 0 });
  const [editStaffId, setEditStaffId] = useState(null);
  const [editStaffData, setEditStaffData] = useState({});
  const [newStaffData, setNewStaffData] = useState({
    fName: "",
    mName: "",
    lName: "",
    email: "",
    username: "",
    password: "",
    phoneNo: "",
    dob: "",
    role_id: "",
    image_id: 1,
    imageurl: null,
  });

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaff(response.data.slice(0, 11)); // Limiting to 11 staff members
      setSummary({ totalStaff: response.data.length });
    } catch (error) {
      console.error("Error fetching staff:", error);
      alert("Cannot fetch staff.");
    }
  };

  const handleEditStaff = (staff) => {
    setEditStaffId(staff.staff_id);
    setEditStaffData(staff);
  };

  const handleChange = (e) => {
    setEditStaffData({ ...editStaffData, [e.target.name]: e.target.value });
  };

  const handleSaveEditStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "admin" && role !== "staff") {
        console.error("Unauthorized access: Not an admin or staff");
        return;
      }
      const url = `/staff/${editStaffId}`;
      console.log(`Sending PUT request to: ${url}`);
      console.log(`Data being sent: ${JSON.stringify(editUserData)}`);
      await axios.put(url, editStaffData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaff(
        staff.map((s) => (s.staff_id === editStaffId ? editStaffData : s))
      );
      setEditStaffId(null);
      alert("Staff information updated successfully.");
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("Error updating staff. Please try again later.");
    }
  };
  

  const handleDeleteStaff = async (staffId) => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        console.error("Unauthorized access: Not an admin");
        return;
      }
      const url = `/staff/${staffId}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaff(staff.filter((s) => s.staff_id !== staffId));
      alert("Staff deleted successfully.");
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Cannot delete this staff.");
    }
  };

  const handleAddStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/staff", newStaffData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaff([...staff, response.data]);
      alert("Staff added successfully.");
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Cannot add staff.");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="container mx-auto p-4 overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-bold mb-4">Staff List</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p>Total Staff: {summary.totalStaff}</p>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Staff ID</th>
            <th className="py-2 px-4 border-b">First Name</th>
            <th className="py-2 px-4 border-b">Middle Name</th>
            <th className="py-2 px-4 border-b">Last Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Phone No</th>
            <th className="py-2 px-4 border-b">DOB</th>
            <th className="py-            2 px-4 border-b">Role ID</th>
            <th className="py-2 px-4 border-b">Image URL</th>
            <th className="py-2 px-4 border-b">Image</th>
            {(localStorage.getItem("role") === "staff" ||
              localStorage.getItem("role") === "admin") && (
              <th className="py-2 px-4 border-b">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.staff_id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{s.staff_id}</td>
              <td className="py-2 px-4 border-b">{s.fName}</td>
              <td className="py-2 px-4 border-b">{s.mName}</td>
              <td className="py-2 px-4 border-b">{s.lName}</td>
              <td className="py-2 px-4 border-b">{s.email}</td>
              <td className="py-2 px-4 border-b">{s.username}</td>
              <td className="py-2 px-4 border-b">{s.phoneNo}</td>
              <td className="py-2 px-4 border-b">{s.dob}</td>
              <td className="py-2 px-4 border-b">{s.role_id}</td>
              <td className="py-2 px-4 border-b">{s.imageurl}</td>
              <td className="py-2 px-4 border-b">
                {s.imageurl && (
                  <img
                    src={s.imageurl}
                    alt="Staff Image"
                    className="w-10 h-10 rounded-full"
                  />
                )}
              </td>
              {(localStorage.getItem("role") === "staff" ||
                localStorage.getItem("role") === "admin") && (
                <td className="py-2 px-4 border-b space-x-2">
                  {localStorage.getItem("role") === "admin" && (
                    <button
                      onClick={() => handleDeleteStaff(s.staff_id)}
                      className="bg-red-500 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => handleEditStaff(s)}
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {editStaffId !== null && (
        <div>
          <h3>Edit Staff</h3>
          <input
            type="text"
            name="fName"
            value={editStaffData.fName}
            onChange={handleChange}
            placeholder="First Name"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="mName"
            value={editStaffData.mName}
            onChange={handleChange}
            placeholder="Middle Name"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="lName"
            value={editStaffData.lName}
            onChange={handleChange}
            placeholder="Last Name"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            value={editStaffData.email}
            onChange={handleChange}
            placeholder="Email"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="username"
            value={editStaffData.username}
            onChange={handleChange}
            placeholder="Username"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="phoneNo"
            value={editStaffData.phoneNo}
            onChange={handleChange}
            placeholder="Phone Number"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="dob"
            value={editStaffData.dob}
            onChange={handleChange}
            placeholder="Date of Birth"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="role_id"
            value={editStaffData.role_id}
            onChange={handleChange}
            placeholder="Role ID"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="imageurl"
            value={editStaffData.imageurl}
            onChange={handleChange}
            placeholder="Image URL"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <button
            className="bg-green-500 text-white py-1 px-3 rounded"
            onClick={handleSaveEditStaff}
          >
            Save
          </button>
        </div>
      )}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Add New Staff</h3>
        <input
          type="text"
          name="fName"
          value={newStaffData.fName}
          onChange={(e) =>
            setNewStaffData({
              ...newStaffData,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="First Name"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="mName"
          value={newStaffData.mName}
          onChange={(e) =>
            setNewStaffData({
              ...newStaffData,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Middle Name"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="lName"
          value={newStaffData.lName}
          onChange={(e) =>
            setNewStaffData({
              ...newStaffData,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Last Name"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          value={newStaffData.email}
          onChange={(e) =>
            setNewStaffData({
              ...newStaffData,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Email"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="username"
          value={newStaffData.username}
          onChange={(e) =>
            setNewStaffData({
              ...newStaffData,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Username"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          name="password"
          value={newStaffData.password}
          onChange={(e) =>
            setNewStaffData({
              ...newStaffData,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Password"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="phoneNo"
          value={newStaffData.phoneNo}
          onChange={(e) =>
            setNewStaffData({
              ...newStaffData,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Phone Number"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          name="dob"
          value={newStaffData.dob}
          onChange={(e) =>
            setNewStaffData({
              ...newStaffData,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Date of Birth"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="role_id"
          value={newStaffData.role_id}
          onChange={(e) =>
            setNewStaffData({
              ...newStaffData,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Role ID"
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="imageurl"
          value={newStaffData.imageurl}
          onChange={(e) =>
            setNewStaffData({
              ...newStaffData,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="imageurl"
          className="mb-2 p-2 border border-gray-300 rounded"
        />

        <button
          className="bg-green-500 text-white py-1 px-3 rounded"
          onClick={handleAddStaff}
        >
          Add Staff
        </button>
      </div>
    </div>
  );
};

export default TableStaff;



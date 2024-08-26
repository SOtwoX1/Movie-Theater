import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ totalUsers: 0 });
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({});
  const [newUserData, setNewUserData] = useState({
    fName: "",
    mName: "",
    lName: "",
    email: "",
    username: "",
    password: "",
    dateCreated: "",
    member_id: "",
    dob: "",
    image_id: "",
  });
  const [userRole, setUserRole] = useState(""); // Define userRole state

  useEffect(() => {
    // Fetch users when the component mounts
    fetchUsers();
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

  useEffect(() => {
    // Calculate summary whenever users change
    calculateSummary();
  }, [users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.slice(0, 11)); // Limiting to 11 users
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Cannot fetch users.");
    }
  };

  const calculateSummary = () => {
    const totalUsers = users.length;
    // You can calculate other metrics here
    setSummary({ totalUsers });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditUser = (user) => {
    setEditUserId(user.user_id);
    setEditUserData(user);
  };

  const handleSaveEditUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "admin" && role !== "staff") {
        console.error("Unauthorized access: Not an admin or staff");
        return;
      }
      const url = `/users/${editUserId}`;
      console.log(`Sending PUT request to: ${url}`);
      console.log(`Data being sent: ${JSON.stringify(editUserData)}`);
      await axios.put(url, editUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(
        users.map((user) =>
          user.user_id === editUserId ? editUserData : user
        )
      );
      setEditUserId(null);
      alert("User information updated successfully.");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        console.error("Unauthorized access: Not an admin");
        return;
      }
      const url = `/users/${userId}`;
      console.log(`Sending DELETE request to: ${url}`);
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.user_id !== userId));
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Can not delete this user.");
    }
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/users", newUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers([...users, response.data]);
      alert("User added successfully.");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Cannot add user.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p>Total Users: {summary.totalUsers}</p>
        {/* You can add more summary information here */}
      </div>
      <div className="overflow-y-auto max-h-80">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Middle Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Imageurl</th>
              <th className="py-2 px-4 border-b">Image</th>{" "}
              {/* New Column for Image */}
              {(userRole === "staff" || userRole === "admin") && (
                <th className="py-2 px-4 border-b">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{user.user_id}</td>
                <td className="py-2 px-4 border-b">{user.fName}</td>
                <td className="py-2 px-4 border-b">{user.mName}</td>
                <td className="py-2 px-4 border-b">{user.lName}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.imageurl}</td>

                <td className="py-2 px-4 border-b">
                  {user.imageurl && (
                    <img
                      src={user.imageurl}
                      alt="User Image"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                </td>{" "}
                {/* Display the Image */}
                {(userRole === "staff" || userRole === "admin") && (
                  <td className="py-2 px-4 border-b space-x-2">
                    {userRole === "admin" && (
                      <button
                        onClick={() => handleDeleteUser(user.user_id)}
                        className="bg-red-500 text-white py-1 px-3 rounded"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      onClick={() => handleEditUser(user)}
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
      </div>
      {editUserId !== null && (
        <div>
          <h3>Edit User</h3>
          <input
            type="text"
            name="fName"
            value={editUserData.fName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="mName"
            value={editUserData.mName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lName"
            value={editUserData.lName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="email"
            value={editUserData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            value={editUserData.username}
            onChange={handleChange}
          />
          <input
            type="text"
            name="imageurl"
            value={editUserData.imageurl}
            onChange={handleChange}
          />
          <button
            className="bg-green-500 text-white py-1 px-3 rounded"
            onClick={handleSaveEditUser}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;


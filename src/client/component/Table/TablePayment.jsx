import React, { useState, useEffect } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";

const PaymentTable = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ totalPayments: 0 });
  const [editPaymentId, setEditPaymentId] = useState(null);
  const [editPaymentData, setEditPaymentData] = useState({});
  const [newPaymentData, setNewPaymentData] = useState({
    user_id: "",
    type: "",
    creditcardNo: "",
    cvv: "",
  });

  const userRole = localStorage.getItem("role"); // Retrieve the role from local storage

  const fetchPayments = async () => {
    try {
      const response = await axios.get("/payments");
      setPayments(response.data.slice(0, 11));
      setSummary({ totalPayments: response.data.length });
    } catch (error) {
      console.error("Error fetching payments:", error);
      alert("Cannot fetch payments.");
    }
  };

  const handleEditPayment = (payment) => {
    setEditPaymentId(payment.payment_id);
    setEditPaymentData(payment);
  };

  const handleChange = (e) => {
    setEditPaymentData({ ...editPaymentData, [e.target.name]: e.target.value });
  };

  const handleSaveEditPayment = async () => {
    try {
      const url = `/payments/${editPaymentId}`;
      await axios.put(url, editPaymentData);
      setPayments(
        payments.map((p) => (p.payment_id === editPaymentId ? editPaymentData : p))
      );
      setEditPaymentId(null);
      alert("Payment information updated successfully.");
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Error updating payment. Please try again later.");
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      const url = `/payments/${paymentId}`;
      await axios.delete(url);
      setPayments(payments.filter((p) => p.payment_id !== paymentId));
      alert("Payment deleted successfully.");
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Cannot delete this payment.");
    }
  };

  const handleAddPayment = async () => {
    try {
      // Hash CVV
      const hashedCvv = await bcrypt.hash(newPaymentData.cvv, 10);
      
      // Mask half of the credit card number
      const maskedCreditCardNo =
        newPaymentData.creditcardNo.slice(0, 6) +
        "******" +
        newPaymentData.creditcardNo.slice(-4);

      const response = await axios.post("/payments", {
        ...newPaymentData,
        cvv: hashedCvv,
        creditcardNo: maskedCreditCardNo,
      });
      setPayments([...payments, response.data]);
      alert("Payment added successfully.");
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Cannot add payment.");
    }
  };

  // Function to hash the second half of the credit card number
  const hashCreditCard = (creditCardNo) => {
    const visiblePart = creditCardNo.substring(0, creditCardNo.length / 2);
    const hashedPart = creditCardNo.substring(creditCardNo.length / 2).replace(/\d/g, "*");
    return visiblePart + hashedPart;
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto p-4 overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-bold mb-4">Payment List</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p>Total Payments: {summary.totalPayments}</p>
      </div>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Payment ID</th>
            <th className="border border-gray-400 px-4 py-2">User ID</th>
            <th className="border border-gray-400 px-4 py-2">Type</th>
            <th className="border border-gray-400 px-4 py-2">Credit Card No</th>
            <th className="border border-gray-400 px-4 py-2">CVV</th>
            <th className="border border-gray-400 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.payment_id}>
              <td className="border border-gray-400 px-4 py-2">{payment.payment_id}</td>
              <td className="border border-gray-400 px-4 py-2">{payment.user_id}</td>
              <td className="border border-gray-400 px-4 py-2">{payment.type}</td>
              <td className="border border-gray-400 px-4 py-2">{hashCreditCard(payment.creditcardNo)}</td>              <td className="border border-gray-400 px-4 py-2">*****</td> {/* Display hashed CVV */}
              <td className="border border-gray-400 px-4 py-2">
                {userRole === "admin" && (
                  <>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleEditPayment(payment)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDeletePayment(payment.payment_id)}
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
          <h3 className="text-lg font-semibold mb-2">Add New Payment</h3>
          <input
            type="text"
            name="user_id"
            placeholder="User ID"
            value={newPaymentData.user_id}
            onChange={(e) => setNewPaymentData({ ...newPaymentData, user_id: e.target.value })}
            className="border border-gray-400 px-4 py-2 mr-2"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={newPaymentData.type}
            onChange={(e) => setNewPaymentData({ ...newPaymentData, type: e.target.value })}
            className="border border-gray-400 px-4 py-2mr-2"
            />
            <input
              type="text"
              name="creditcardNo"
              placeholder="Credit Card No"
              value={newPaymentData.creditcardNo}
              onChange={(e) => setNewPaymentData({ ...newPaymentData, creditcardNo: e.target.value })}
              className="border border-gray-400 px-4 py-2 mr-2"
            />
            <input
              type="password"
              name="cvv"
              placeholder="CVV"
              value={newPaymentData.cvv}
              onChange={(e) => setNewPaymentData({ ...newPaymentData, cvv: e.target.value })}
              className="border border-gray-400 px-4 py-2 mr-2"
            />
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddPayment}
            >
              Add Payment
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default PaymentTable;
  

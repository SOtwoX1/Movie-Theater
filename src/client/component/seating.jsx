import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import { Modal } from "flowbite-react";

const SeatSelector = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [confirmedSeats, setConfirmedSeats] = useState([]);
  const [disabledSeats, setDisabledSeats] = useState(["A1", "B2", "C3"]);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [creditNo, setCreditNo] = useState("");
  const [cvv, setCvv] = useState("");
  const [openModal, setOpenModal] = useState(false);

    function onCloseModal() {
      setOpenModal(false);
      setEmail("");
    }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Username: ", username);
    console.log("Credit Card Number: ", creditNo);
    console.log("CVV: ", cvv);
    
    Swal.fire({
      title: "Loading",
      icon: "info",
      showConfirmButton: false,
      timer: 5000,
    }).then(() => {
      // Perform any additional actions after the loading effect
      // For example, you can submit the form or navigate to another page
      Swal.fire({
        title: "Success",
        text: "Your payment was successful",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Redirect to another page
        window.location.href = "/";
      });
    });
  };

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const confirmSeats = () => {
    setConfirmedSeats(selectedSeats);
    setDisabledSeats([...disabledSeats, ...selectedSeats]);
    setSelectedSeats([]);
    setShowForm(true);
    setOpenModal(true);

  };

  const renderSeat = (row, col) => {
    const seat = `${String.fromCharCode(65 + row)}${col + 1}`;
    const isSelected = selectedSeats.includes(seat);
    const isDisabled =
      disabledSeats.includes(seat) || confirmedSeats.includes(seat);
    return (
      <div
        key={seat}
        className={`seat ${isSelected ? "selected" : ""} ${
          isDisabled ? "disabled" : ""
        } w-12 h-12 inline-block m-auto mb-2 leading-12 text-center cursor-pointer relative bg-write bg-cover`}
        onClick={() => !isDisabled && toggleSeat(seat)}
        style={{
          backgroundImage: 'url("/chair.png")',
          opacity: isDisabled ? 0.5 : isSelected ? 0.5 : 1,
          pointerEvents: isDisabled ? "none" : "auto",
        }}
      >
        {isSelected && (
          <FaCheck className="absolute top-0 left-0 w-full h-full text-blue-500" />
        )}
      </div>
    );
  };

  const rows = [...Array(5).keys()];
  const cols = [...Array(8).keys()];

  return (
    <div className="seat-selector bg-transparent rounded-xl">
      <div className="w-100% h-[20px] bg-transparent mb-20 text-white text-center font-semibold">
        Screen
      </div>
      <div className="flex flex-col justify-center items-center">
        {rows.map((row) => (
          <div key={row} className="row flex justify-center items-center gap-0">
            {cols.map((col) => renderSeat(row, col))}
          </div>
        ))}
      </div>
      <div>
        <div className=" flex justify-center mt-5">
          <button
            className=" w-full font-serif font-semibold bg-[#20208B] border-none rounded-[5px] text-white cursor-pointer block p-[10px]"
            onClick={confirmSeats}
          >
            <div className=" text-xl">CONFIRM</div>
          </button>
        </div>
      </div>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className=" flex justify-center items-center">
            <img src="/payment.png" width={200} height={200} alt="" />
          </div>
          <h1 className="text-2xl font-bold text-center">Payment Details</h1>
          <p className="text-center text-gray-500">
            Please enter your payment details
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Credit Card Number
              </label>
              <input
                type="text"
                name="creditno"
                value={creditNo}
                onChange={(e) => setCreditNo(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border-none rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700  focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SeatSelector;

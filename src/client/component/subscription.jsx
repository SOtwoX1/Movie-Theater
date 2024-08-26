"use client";

import { Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../index.css";
import axios from 'axios';

export function SubscriptionUI() {
  const [openModal, setOpenModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [creditNo, setCreditNo] = useState("");
  const [cvv, setCvv] = useState("");
  const [memberId, setMemberId] = useState(null); // Initialize memberId state

  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem("username");
    // Set the value of username state to the retrieved value
    setUsername(storedUsername);
  }, []);

  const handleClick = (id) => {
    // Perform any logic related to member_id here
    console.log("Member ID: ", id);
  
    // Set the memberId state
    setMemberId(id);

    // Toggle the visibility of the subscription form
    setShowForm(!showForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userInfo = {
      "username": username,
      "memberId": memberId
    };
    console.log(userInfo)
    Swal.fire({
      title: "Loading",
      icon: "info",
      showConfirmButton: false,
      timer: 2000,
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

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

  return (
    <>
      <Link
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold px-8 py-2.5 rounded-full transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
        onClick={() => setOpenModal(true)}
      >
        Shop Now!
      </Link>
      <Modal show={openModal} size="5xl" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <section className=" grid place-content-center w-full bg-white items-center justify-center">
            <div className="container ">
              <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3 md:gap-8">
                <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg justify-between border border-gray-300">
                  <div>
                    <h3 className="text-2xl font-bold text-center">Bronze</h3>
                    <div className="mt-4 text-center text-zinc-600">
                      <span className="text-4xl font-bold">$99</span>/ lifetime
                    </div>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        20 Baht Discount
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Free Popcorn Every Month
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Free Small Cup of Coke
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => handleClick(2)}
                      className="transition transform hover:scale-110 inline-flex items-center justify-center rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 h-10 px-4 py-2 w-full"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
                <div className="relative flex flex-col p-6 bg-white shadow-lg rounded-lg justify-between border border-purple-500">
                  <div className="px-3 py-1 text-sm text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full inline-block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    Popular
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-center">Silver</h3>
                    <div className="mt-4 text-center text-zinc-600">
                      <span className="text-4xl font-bold">$199</span>/ lifetime
                    </div>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        40 Baht Discount
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Free 2 Popcorns Every Month
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Free Medium Cup of Coke
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Gift Voucher
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => handleClick(3)}
                      className="transition transform hover:scale-110 rainbow-button inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background h-10 px-4 py-2 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
                <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg justify-between border border-gray-300">
                  <div>
                    <h3 className="text-2xl font-bold text-center">Gold</h3>
                    <div className="mt-4 text-center text-zinc-600">
                      <span className="text-4xl font-bold">$399</span>/ lifetime
                    </div>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        60 Baht Discount
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Free 4 Popcorns Every Month
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Free Large Cup of Coke
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Limited Edition Gifts
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Meeting With Actors
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => handleClick(4)}
                      className="transition transform hover:scale-110 inline-flex items-center justify-center rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 h-10 px-4 py-2 w-full"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {showForm && (
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
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
              </form>
            )}
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
}

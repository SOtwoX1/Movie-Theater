import React, { useState, useEffect } from "react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import useScrollDirection from './useScrollDirection';
import { Modal } from "flowbite-react"
import { Link as ScrollLink } from "react-scroll";
import axios from "axios";
import TicketList from './Ticketlist';
import Swal from 'sweetalert2';

export function NavbarFlow() {
  const [userInfo, setUserInfo] = useState(null);
  const scrollDirection = useScrollDirection();
  const show = scrollDirection === "up";
  const [openModal, setOpenModal] = useState(false);
  function onCloseModal() {
    setOpenModal(false);
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const role = localStorage.getItem("role");
        const username = localStorage.getItem("username");

        if (role === "user") {
          const response = await axios.post("http://localhost:3000/infouser", {
            username,
          });
          setUserInfo(response.data);
        } else {
          const response = await axios.post("http://localhost:3000/infostaff", {
            username,
          });
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const logout = () => {
    // Remove token, role, and username from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "You logged out",
      showConfirmButton: false,
      timer: 3000
    });
    // // Show a logout message
    // alert("Logged out successfully.");

    // Redirect to the homepage or any desired page
    window.location.href = "http://localhost:3000";
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "You logged out",
      showConfirmButton: false,
      timer: 3000
    });
  };

  return (
    <Navbar
      fluid
      className={`z-50 sticky top-0 bg-[#032541] ${
        show ? "translate-y-0" : "-translate-y-full"
      } transition-transform duration-300`}
    >
      <Navbar.Brand>
        <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="top bk logo" />
        <span className=" bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent self-center whitespace-nowrap text-2xl font-bold dark:text-white">
          TOP BK Ltd.
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <div className="mr-2"></div>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img={
                userInfo
                  ? userInfo[0].imageurl
                  : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              }
              rounded
            />
          }
        >
          {userInfo ? (
            <>
              <Dropdown.Header>
                <span className="block text-sm">{`${userInfo[0].fName} ${userInfo[0].lName}`}</span>
                <span className="block truncate text-sm font-medium">
                  {userInfo[0].email}
                </span>
              </Dropdown.Header>
              <Dropdown.Divider />
            </>
          ) : (
            <Dropdown.Header>
              <span>Loading...</span>
            </Dropdown.Header>
          )}
          <Dropdown.Item onClick={() => setOpenModal(true)}>
            Your Tickets
          </Dropdown.Item>
          <Dropdown.Item type="submit" onClick={logout}>
            Sign out
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
      <ScrollLink
          to="home"
          smooth={true}
          className="text-xl mr-2 text-white"
        >
          Home
        </ScrollLink>
        <ScrollLink to="product" smooth={true} className="text-xl text-white">
          Movie
        </ScrollLink>
        <ScrollLink to="search" smooth={true} className="text-xl text-white">
          Searching
        </ScrollLink>
        <ScrollLink to="member" smooth={true} className="text-xl text-white">
          Membership
        </ScrollLink>
        <ScrollLink to="contact" smooth={true} className=" text-xl text-white">
          Contact
        </ScrollLink>
      </Navbar.Collapse>
      <Modal show={openModal} size="5xl" onClose={onCloseModal} popup>
        <Modal.Header className="bg-black" />
        <Modal.Body className=" bg-gray-100">
          <TicketList />
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}

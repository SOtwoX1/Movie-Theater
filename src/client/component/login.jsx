"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

export function Login() {
  const [openModal, setOpenModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function onCloseModal() {
    setOpenModal(false);
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      console.log('Login successful:', response.data);
      const { token, user, staff } = response.data;

      // Set token expiration time (1 hour from now)
      const expirationTime = new Date().getTime() + 3600000; // 1 hour in milliseconds

      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', expirationTime);

      if (user) {
        localStorage.setItem('role', 'user');
        localStorage.setItem('user_id', user.user_id);
        localStorage.setItem('username', user.username);
        Swal.fire({
          title: "Login Successful",
          text: `Welcome, ${user.username}!`,
          icon: "success",
          timer: 2000
        });
        window.location.href = 'http://localhost:3000';
      } else if (staff) {
        localStorage.setItem('role', staff.rolename);
        localStorage.setItem('username', staff.username);
        Swal.fire({
          title: "Login Successful",
          text: `Welcome, ${staff.username} (Role: ${staff.rolename})!`,
          icon: "success",
          timer: 2000
        });
        window.location.href = 'http://localhost:3000/staffpage';
      }
    } catch (error) {
      console.error('Error during login:', error);
      Swal.fire({
        title: "Login Failed",
        text: "Invalid username or password",
        icon: "error"
      });
    }
  };

  return (
    <>
      <Button
        className="mr-2"
        gradientDuoTone="pinkToOrange"
        onClick={() => setOpenModal(true)}
      >
        <span className="text-lg">Login</span>
      </Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Sign in to our platform
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput
                id="username"
                placeholder="Your Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <Button onClick={handleLogin}>
                Log in to your account
              </Button>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <a
                href="/register"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Create account
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

import { Label, TextInput, FileInput, Button, Select } from "flowbite-react";
import {
  HiMail,
  HiUser,
  HiCalendar,
  HiKey,
  HiCheckCircle,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Ensure you have installed sweetalert2

function SignUp() {
  return (
    <div className="flex h-[115vh]">
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <div className="max-w-md text-center">
          <img
            src="banner.svg"
            alt="banner"
            width="524.67004"
            height="531.39694"
            className="w-full"
          />
        </div>
      </div>
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <div className="text-3xl font-semibold mb-6 text-black text-center">
            Sign Up
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between"></div>
          <RegisterForm />
          <div className="text-sm text-gray-600 text-center">
            <p>
              Already have an account?{" "}
              <Link
                to="/"
                className="text-orange-600 hover:underline font-bold"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterForm() {
  const [fName, setFName] = useState("");
  const [mName, setMName] = useState("");
  const [lName, setLName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [image, setImage] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [creditType, setCreditType] = useState("");
  const [creditno, setCreditno] = useState("");
  const [cvv, setCvv] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateForm = () => {
    if (password !== reenterPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
      });
      setPasswordMatch(false);
      return false;
    }
    return true;
  };

  const SaveData = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("fName", fName);
    formData.append("mName", mName);
    formData.append("lName", lName);
    formData.append("dob", dob);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("creditType", creditType);
    formData.append("creditno", creditno);
    formData.append("cvv", cvv);
    if (image) {
      formData.append("img", image);
    }

    try {
      const response = await axios.post("http://localhost:3000/register/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("User and image data submitted successfully:", response.data);
      Swal.fire({
        title: "Loading",
        icon: "info",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        Swal.fire({
          title: "Success",
          text: "Your registration was successful",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.href = "/";
        });
      });
    } catch (error) {
      console.error("Error occurred:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
      });
    }
  };

  return (
    <form className="max-w-md p-4 rounded" onSubmit={SaveData}>
      <div className="mb-2 block">
        <Label htmlFor="fName" value="First Name" />
        <TextInput
          id="fName"
          type="text"
          icon={HiUser}
          placeholder="First Name"
          required
          value={fName}
          onChange={(e) => setFName(e.target.value)}
        />

        <Label htmlFor="mName" value="Middle Name" />
        <TextInput
          id="mName"
          type="text"
          icon={HiUser}
          placeholder="Middle Name"
          value={mName}
          onChange={(e) => setMName(e.target.value)}
        />

        <Label htmlFor="lName" value="Last Name" />
        <TextInput
          id="lName"
          type="text"
          icon={HiUser}
          placeholder="Last Name"
          required
          value={lName}
          onChange={(e) => setLName(e.target.value)}
        />

        <Label htmlFor="dob" value="Date of Birth" />
        <TextInput
          id="dob"
          type="date"
          icon={HiCalendar}
          placeholder="Date of Birth"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <Label htmlFor="email" value="Email" />
        <TextInput
          id="email"
          type="email"
          icon={HiMail}
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {email && (
          <div className="text-sm text-green-500">
            <span className="font-medium">Alright!</span> Email available!
          </div>
        )}

        <Label htmlFor="username" value="Username" />
        <TextInput
          id="username"
          type="text"
          icon={HiUser}
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Label htmlFor="password" value="Password" />
        <TextInput
          id="password"
          type="password"
          icon={HiKey}
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Label htmlFor="reenterPassword" value="Re-enter Password" />
        <TextInput
          id="reenterPassword"
          type="password"
          icon={HiKey}
          placeholder="Re-enter Password"
          required
          value={reenterPassword}
          onChange={(e) => setReenterPassword(e.target.value)}
        />
        {!passwordMatch && (
          <div className="text-sm text-red-500">
            Passwords do not match.
          </div>
        )}

        <Label htmlFor="type" value="Select your credit type" />
        <Select
          id="type"
          required
          value={creditType}
          onChange={(e) => setCreditType(e.target.value)}
        >
          <option value="">Select Credit Type</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Mobile Payment">Mobile Payment</option>
        </Select>

        <Label htmlFor="creditno" value="CreditNo." />
        <TextInput
          id="creditno"
          type="text"
          icon={HiKey}
          placeholder="Enter Credit Card Number"
          required
          value={creditno}
          onChange={(e) => setCreditno(e.target.value)}
        />

        <Label htmlFor="cvv" value="CVV" />
        <TextInput
          id="cvv"
          type="text"
          icon={HiKey}
          placeholder="Enter CVV Number"
          required
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />

        <Label htmlFor="image" value="Image" />
        <FileInput
          id="image"
          placeholder="Upload Image"
          onChange={handleImageChange}
        />

        <Button
          className="bg-blue-900 border-none rounded text-white cursor-pointer flex text-base py-2 w-full mt-[1rem]"
          type="submit"
          icon={HiCheckCircle}
          color="primary"
        >
          Register
        </Button>
      </div>
    </form>
  );
}

export default SignUp;

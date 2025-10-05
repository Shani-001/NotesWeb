import React, { useState } from "react";
// import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BackgroundBeams } from "../components/ui/background-beams";
import { BACKEND_URL } from "../../utils/utils.js";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login successful: ", response.data);
      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Login failed!!!");
      }
    }
  };

  return (
    <div className="bg-black ">
      <div className="h-screen container mx-auto flex  items-center justify-center text-white">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5  ">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-full"
            />
            <Link to={"/"} className="text-xl font-bold text-white-500">
              SmartNotes
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={"/signup"}
              className="bg-transparent border border-gray-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md z-20"
            >
              Signup
            </Link>
            <Link
              to={"/notes"}
              className="bg-purple-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md z-20"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* Login Form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] m-8 md:m-0 mt-20 z-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-purple-500">SmartNotes</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Log in to access paid content!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className=" text-gray-400 mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className=" text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="********"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>
            {errorMessage && (
              <div className="mb-4 text-red-500 text-center">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-800 text-white py-3 px-6 rounded-md transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <BackgroundBeams className="z-10" />
    </div>
  );
}

export default Login;

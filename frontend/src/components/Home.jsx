import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InfiniteMovingCardsDemo } from "./MovingCard";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
// import { WavyBackground } from "../components/ui/wavy-background";
import { Vortex } from "../components/ui/vortex";
import { BACKEND_URL } from "../../utils/utils.js";
import ReviewList from "./Review";

function Home() {
  const [notes, setNotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/notes/notes`, {
          withCredentials: true,
        });
        setNotes(response.data.notes);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  return (
    <div className="bg-black min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto pb-40">
          <header className="flex flex-row justify-between w-[70vw] sm:flex-row items-center sm:justify-between p-4 sm:p-6 sm:bottom-24">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <img
                src="/logo.jpg"
                alt="logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
              />
              <h1 className="text-white font-bold text-xl sm:text-2xl">
                SmartNotes
              </h1>
            </div>
            <div className="flex flex-row sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-[20vw] sm:w-auto items-center sm:items-start">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-transparent text-white text-sm sm:text-lg py-2 ml-10 px-4 border border-white rounded w-full sm:w-auto sm:text-center text-center"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="bg-transparent text-white text-sm sm:text-lg py-2 px-4 mx-4 border border-white rounded w-full sm:w-auto text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to={"/signup"}
                    className="relative bottom-0.5 sm:bottom-0 bg-transparent text-white text-sm sm:text-lg py-2 px-4 border border-white rounded w-full sm:w-auto text-center"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </header>
        </div>
        {/* Hero Section */}
        <div className="w-[calc(100%-1rem)] mx-0 rounded-md  h-[30rem] overflow-hidden relative bottom-36">
          <Vortex
            backgroundColor="black"
            className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full "
          >
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold text-center mt-8 sm:mt-12">
              SmartNotes
            </p>
            <p className="text-sm sm:text-base md:text-lg mt-4 text-white font-normal text-center px-2 sm:px-0">
              Sharpen your knowledge with expertly crafted notes and study
              materials.
            </p>
            <p className="text-sm sm:text-base md:text-lg mt-4 text-white font-normal text-center px-2 sm:px-0">
              Join 250,000+ Students Using Our Notes
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
              <Link
                to={"/notes"}
                className="bg-white text-purple-600 py-2 sm:py-3 px-4 sm:px-6 rounded font-semibold hover:text-black hover:bg-white transition-all w-full sm:w-auto text-center"
              >
                Explore notes
              </Link>
              <Link
                to={"https://www.youtube.com"}
                className="bg-white text-black py-2 sm:py-3 px-4 sm:px-6 rounded font-semibold hover:text-purple-600 hover:bg-white transition-all w-full sm:w-auto text-center"
              >
                Notes videos
              </Link>
            </div>
          </Vortex>
        </div>

        {/* Infinite Moving Cards */}
        <hr className="my-12 border-gray-600 h-5" />
        <div className="mt-12">
          <InfiniteMovingCardsDemo className="bg-white/80 w-full" />
        </div>

        <hr className="my-12 border-gray-600 h-5" />
        <ReviewList />
        <hr className="my-1 border-gray-600 h-5" />
        {/* Footer */}
        <footer className="bg-black text-white py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Logo & Social */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center space-x-2">
                <img
                  src="/logo.jpg"
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <h1 className="text-2xl font-bold">SmartNotes</h1>
              </div>
              <div className="mt-3 flex flex-col items-center sm:items-start">
                <p className="mb-2">Follow us</p>
                <div className="flex space-x-4">
                  <a href="#">
                    <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                  </a>
                  <a href="#">
                    <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                  <a href="#">
                    <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                </div>
              </div>
            </div>

            {/* Connect Links */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-lg font-semibold mb-4">Connects</h3>
              <ul className="space-y-2 text-gray-100 text-center sm:text-left">
                <li className="hover:text-white cursor-pointer duration-300">
                  YouTube - Study Notes
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Telegram - Study Notes
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  GitHub - Study Notes
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-lg font-semibold mb-4">
                Copyrights &#169; 2025
              </h3>
              <ul className="space-y-2 text-gray-100 text-center sm:text-left">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;

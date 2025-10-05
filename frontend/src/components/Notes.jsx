import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API call
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
// import { FaDisnotes } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi"; // Import menu and close icons
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { LoaderOne } from "../components/ui/loader";
import { BACKEND_URL } from "../../utils/utils.js";
import { GrNotes } from "react-icons/gr";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
  const [search, setSearch] = useState("");

  console.log("notes: ", notes);

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch notes
  useEffect(() => {
    const fetchnotes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/notes/notes`, {
          withCredentials: true,
        });
        console.log(response.data.notes);
        setNotes(response.data.notes);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchnotes ", error);
      }
    };
    fetchnotes();
  }, []);

  // Logout
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
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-400 w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img
            src="/logo.jpg"
            alt="Profile"
            className="rounded-full h-12 w-12"
          />
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-gray-200">
                <GrNotes className="mr-2" /> Notes
              </a>
            </li>
            <li className="mb-4">
              <a href="/purchases" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <Link
                  to={"/"}
                  className="flex items-center"
                  onClick={handleLogout}
                >
                  <IoLogOut className="mr-2" /> Logout
                </Link>
              ) : (
                <Link to={"/login"} className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-0 md:ml-64 w-full bg-white p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold mr-3">Notes</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type here to search..."
                className="border border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center">
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>

            <FaCircleUser className="text-4xl text-purple-600" />
          </div>
        </header>

        {/* Vertically Scrollable notes Section */}
        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">
              <LoaderOne />
            </p>
          ) : notes.length === 0 ? (
            // Check if notes array is empty
            <p className="text-center text-gray-500">
              No notes posted yet by admin
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {notes
                .filter((note) =>
                  note.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((notes) => (
                  <div
                    key={notes._id}
                    className="border border-gray-200 rounded-lg p-4 shadow-2xs"
                  >
                    <img
                      src={notes.image.url}
                      alt={notes.title}
                      className="rounded mb-4 w-full h-[50vh]"
                    />
                    <h2 className="font-bold text-lg mb-2">{notes.title}</h2>
                    <p className="text-gray-600 mb-4 ">
                      {notes.description.length > 100
                        ? `${notes.description.slice(0, 100)}...`
                        : notes.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-xl">
                        ₹{notes.price}{" "}
                        <span className="text-gray-500 line-through">300</span>
                      </span>
                      <span className="text-white-600 text-green-600">
                        20% off
                      </span>
                    </div>

                    {/* Buy page */}
                    <div>
                      <Link
                        to={`/buy/${notes._id}`} // Pass notesId in URL
                        className="bg-purple-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Notes;

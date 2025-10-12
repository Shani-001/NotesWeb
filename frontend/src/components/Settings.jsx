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
// import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { LoaderOne } from "../components/ui/loader";
import { BACKEND_URL } from "../../utils/utils.js";
import { GrNotes } from "react-icons/gr";

function Settings() {
  const [notes, setNotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
  //  const [search,setSearch]=useState("")
  const [settings, setSettings] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token; // using optional chaining to avoid app crashing

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setSettings(response.data.settings);
        // console.log(response.data.settings)
        setLoading(false);
      } catch (error) {
        console.log("Error fetching settings", error);
        toast.error("Error fetching settings");
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BACKEND_URL}/user/settings`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setLoading(false);
    } catch (error) {
      console.log("Error updating settings", error);
      toast.error("Error updating settings");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (!token) {
    navigate("/login");
  }

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
              <a href="/notes" className="flex items-center">
                <GrNotes className="mr-2" /> Notes
              </a>
            </li>
            <li className="mb-4">
              <a href="/purchases" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center  text-gray-200">
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

      <main className="ml-0 md:ml-64 w-full bg-white p-10">
        {/* Vertically Scrollable notes Section */}
        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">
              <LoaderOne />
            </p>
          ) : (
            <div className="p-8 max-w-xl mx-auto bg-white shadow rounded-lg mt-10">
              <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    firstName
                  </label>
                  <input
                    type="text"
                    value={settings.firstName}
                    onChange={(e) =>
                      setSettings({ ...settings, firstName: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    lastName
                  </label>
                  <input
                    type="text"
                    value={settings.lastName}
                    onChange={(e) =>
                      setSettings({ ...settings, lastName: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    password
                  </label>
                  <input
                    type="password"
                    value={settings.password}
                    onChange={(e) =>
                      setSettings({ ...settings, password: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-800"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Settings;

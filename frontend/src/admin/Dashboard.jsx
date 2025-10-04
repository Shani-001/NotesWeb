import React from "react";
import { Link } from "react-router-dom";
// import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import axios from "axios";
import { Boxes } from "../components/ui/background-boxes";
import { BACKEND_URL } from "../../utils/utils.js";
function Dashboard() {
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-5 z-20">
        <div className="flex items-center flex-col mb-10">
          <img src="/logo.jpg" alt="Profile" className="rounded-full h-20 w-20" />
          <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/our-notes">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded">
              Our Notes
            </button>
          </Link>
          <Link to="/admin/create-notes">
            <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded">
              Create Notes
            </button>
          </Link>

          <Link to="/">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Home
            </button>
          </Link>
          <Link to="/admin/login">
            <button
              onClick={handleLogout}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
            >
              Logout
            </button>
          </Link>
        </nav>
      </div>
      {/* bg-slate-900 */}
      {/* <div className="flex h-screen items-center justify-center ml-[40%]"> */}
        <div className="h-full relative w-full overflow-hidden bg-gray-500 flex flex-col items-center justify-center ">
      <div className="absolute inset-0 w-full h-full bg-gray-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
 
      <Boxes className="z-10"/>
      <h1 className={"md:text-4xl text-xl text-white relative z-20 font-bold"}>
        Welcome To Admin Dashboard!! 
      </h1>
      <p className="text-center mt-2 text-neutral-300 relative z-20">
        This is a Notes Website Admin Pannel
      </p>
    {/* </div> */}
        {/* <Boxes className="w-[40vw] flex h-screen items-center justify-center ml-[40%] bg-black z-10"  /> */}
      </div>
    </div>
  );
}

export default Dashboard;
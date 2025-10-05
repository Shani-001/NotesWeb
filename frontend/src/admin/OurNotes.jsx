import { LoaderOne } from "../components/ui/loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils.js";

function OurNotes() {
  const [notes, setnotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin.token;

  if (!token) {
    toast.error("Please login to admin");
    navigate("/admin/login");
  }

  // fetch notes
  useEffect(() => {
    const fetchnotes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/notes/notes`, {
          withCredentials: true,
        });
        console.log(response.data.notes);
        setnotes(response.data.notes);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchnotes ", error);
      }
    };
    fetchnotes();
  }, []);

  // delete notes code
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/notes/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      toast.success(response.data.message);
      const updatedNotes = notes.filter((notes) => notes._id !== id);
      setnotes(updatedNotes);
    } catch (error) {
      console.log("Error in deleting notes ", error);
      toast.error(error.response.data.errors || "Error in deleting notes");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        <LoaderOne />
      </p>
    );
  }

  return (
    <div className="bg-gray-100 p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Our Notes</h1>
      <Link
        className="bg-purple-600 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
      <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((notes) => (
          <div key={notes._id} className="bg-white shadow-md rounded-lg p-4">
            {/* notes Image */}
            <img
              src={notes?.image?.url}
              alt={notes.title}
              className="h-60 w-full object-cover rounded-t-lg"
            />
            {/* notes Title */}
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              {notes.title}
            </h2>
            {/* notes Description */}
            <p className="text-gray-600 mt-2 text-sm">
              {notes.description.length > 200
                ? `${notes.description.slice(0, 200)}...`
                : notes.description}
            </p>
            {/* notes Price */}
            <div className="flex justify-between mt-4 text-gray-800 font-bold">
              <div>
                {" "}
                ₹{notes.price}{" "}
                <span className="line-through text-gray-500">₹300</span>
              </div>
              <div className="text-green-600 text-sm mt-2">20 % off</div>
            </div>

            <div className="flex justify-between">
              <Link
                to={`/admin/update-notes/${notes._id}`}
                className="bg-purple-600 text-white py-2 px-4 mt-4 rounded hover:bg-blue-700"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(notes._id)}
                className="bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurNotes;

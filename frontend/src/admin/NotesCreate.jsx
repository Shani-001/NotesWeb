import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils.JS";

function NotesCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [notesPdf, setnotesPdf] = useState(null);

  const navigate = useNavigate();

  // Image handler
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  // PDF handler
  const changePdfHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setnotesPdf(file);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!image || !notesPdf) {
      toast.error("Please select both an image and a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("notesPdf", notesPdf);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/notes/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response)
      toast.success(response.data.message || "Notes created successfully");
      navigate("/admin/our-notes");
      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setnotesPdf(null);
      setImagePreview("");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.errors || "Error creating notes");
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gray-600">
      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-2xl bg-white">
        <h3 className="text-2xl font-semibold mb-8">Create Notes</h3>

        <form onSubmit={handleCreateCourse} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-lg">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-lg">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-lg">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none"
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="block text-lg">Notes Image</label>
            <div className="flex items-center justify-center">
              <img
                src={imagePreview || "/imgPL.webp"}
                alt="Image"
                className="w-full max-w-sm h-auto rounded-md object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={changePhotoHandler}
              className="w-full px-3 py-2 border rounded-md outline-none"
            />
          </div>

          {/* PDF */}
          <div className="space-y-2">
            <label className="block text-lg">Notes PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={changePdfHandler}
              className="w-full px-3 py-2 border rounded-md outline-none"
            />
            {notesPdf && <p className="text-sm mt-1">{notesPdf.name}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-800 text-white rounded-md"
          >
            Create Notes
          </button>
        </form>
      </div>
    </div>
  );
}

export default NotesCreate;

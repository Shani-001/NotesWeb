import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderOne } from "../components/ui/loader";
import { BACKEND_URL } from "../../utils/utils.JS";

function Updatenotes() {
  const { id } = useParams();
// console.log(id)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [notesPdf,setnotesPdf]=useState("")
  const navigate = useNavigate();
  useEffect(() => {
    const fetchnotesData = async () => {
      try {
        const response= await axios.get(`${BACKEND_URL}/notes/notes/${id}`, {
          withCredentials: true,
        });
        console.log(response.data);
        setTitle(response.data.notes.title);
        setDescription(response.data.notes.description);
        setPrice(response.data.notes.price);
        setImage(response.data.notes.image.url);
        setImagePreview(response.data.notes.image.url);
        setnotesPdf(response.data.notes.notesPdf.url)
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch notes data");
        setLoading(false);
      }
    };
    fetchnotesData();
  }, [id]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };
    const changePdfHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setnotesPdf(file);
  };
  const handleUpdatenotes = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image && typeof image !== "string") {
  formData.append("image", image); // not "imageUrl"
}
if(notesPdf && typeof notesPdf !=="string"){
  formData.append("notesPdf", notesPdf);
}
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token;
    if (!token) {
      toast.error("Please login to admin");
      return;
    }
    try {
      const response = await axios.put(
        `${BACKEND_URL}/notes/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
             "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "notes updated successfully");
      navigate("/admin/our-notes"); // Redirect to notess page after update
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.errors || "Error in updating Notes");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500"><LoaderOne/></p>;
  }

  return (
    <div>
      <div className="min-h-screen py-10 bg-gray-600 z-10">
        <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg bg-white z-20">
          <h3 className="text-2xl font-semibold mb-8">Update notes</h3>
          <form onSubmit={handleUpdatenotes} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your notes title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your notes description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your notes price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">notes Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="notes"
                  className="w-[30vw] max-w-sm h-[70vh] rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
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
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200"
            >
              Update notes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Updatenotes;
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../utils/utils.js";

//ReviewForm
export function ReviewForm({ onReviewAdded }) {
  let token;
  useEffect(() => {
    token = localStorage.getItem("user");
  }, []);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${BACKEND_URL}/review`,
      { name, rating, review },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    // console.log(res.data);
    onReviewAdded(res.data);
    setName("");
    setRating(0);
    setReview("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-800 rounded-2xl text-white w-full  max-w-md"
    >
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 rounded mb-3 bg-gray-700"
        required
      />
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            onClick={() => setRating(i)}
            className={`cursor-pointer text-2xl ${
              i <= rating ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 mb-3"
        required
      ></textarea>
      <button className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded w-full">
        Submit Review
      </button>
    </form>
  );
}

//ReviewCard
export function ReviewCard({ name, rating, review, date }) {
  return (
    <div className="bg-[#0f172a] text-white rounded-2xl p-4 shadow-lg w-80 flex-shrink-0 border-2">
      <div className="flex items-center mb-2">
        <img
          src={`https://ui-avatars.com/api/?name=${name}`}
          alt={name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-400">User</p>
        </div>
      </div>
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={i <= rating ? "text-yellow-400" : "text-gray-500"}
          >
            ★
          </span>
        ))}
      </div>
      <p className="text-gray-300 text-sm mb-2">{review}</p>
      <p className="text-xs text-gray-500">{new Date(date).toDateString()}</p>
    </div>
  );
}

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const scrollRef = useRef(null);
  let token;

  useEffect(() => {
    token = localStorage.getItem("user");
  }, []);

  const fetchReviews = async () => {
    const res = await axios.get(`${BACKEND_URL}/review`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    console.log(res.data);
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center text-white p-6 bg-black min-h-screen w-full">
      <h2 className="text-3xl font-bold mb-6">Community Reviews</h2>
      <ReviewForm onReviewAdded={(r) => setReviews([r, ...reviews])} />

      <div className="relative w-full max-w-5xl mt-6">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-700 bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full"
        >
          &#8249;
        </button>

        {/* Scrollable Card Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto p-4 scrollbar-hide"
        >
          {reviews.map((r) => (
            <ReviewCard key={r._id} {...r} />
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-700 bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}

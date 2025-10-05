import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Notes from "./components/Notes";
import Buy from "./components/Buy";
import Purchases from "./components/Purchases";
import NotesCreate from "./admin/NotesCreate";
import Updatenotes from "./admin/Updatenotes";
import OurNotes from "./admin/OurNotes";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import { Toaster } from "react-hot-toast";
import Settings from "./components/Settings";

function App() {
  // const [count, setCount] = useState(0)
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Other Routes */}
          <Route path="/notes" element={<Notes />} />
          <Route path="/buy/:notesId" element={<Buy />} />
          <Route path="/purchases" element={<Purchases />} />
          {/* settings */}
          <Route path="/settings" element={<Settings />} />

          {/* Admin Routes */}
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={admin ? <Dashboard /> : <Navigate to={"/admin/login"} />}
          />
          <Route path="/admin/create-notes" element={<NotesCreate />} />
          <Route path="/admin/update-notes/:id" element={<Updatenotes />} />
          <Route path="/admin/our-notes" element={<OurNotes />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;

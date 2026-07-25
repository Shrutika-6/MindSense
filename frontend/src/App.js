import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import EmotionDetection from "./components/EmotionDetection";
import MindfulExercises from "./components/MindfulExercises";
import MoodDashboard from "./components/MoodDashboard";

function App() {
  const location = useLocation();
  const isAuthPage = ["/", "/signup", "/login"].includes(location.pathname);

  return (
    <div className="relative min-h-screen">
      <div className="lava-background">
        <div className="lava-blob blob-lavender"></div>
        <div className="lava-blob blob-pink"></div>
        <div className="lava-blob blob-mint"></div>
        <div className="lava-blob blob-peach"></div>
      </div>

      {!isAuthPage && (
        <nav className="backdrop-blur-md bg-white/40 border-b border-white/60 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <Link to="/home" className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent flex items-center gap-1 hover:opacity-90 transition">
            MindSense 🌿
          </Link>
          <div className="flex gap-8 items-center">
            <Link to="/home" className="text-slate-600 hover:text-violet-600 font-bold transition text-sm">Home</Link>
            <Link to="/emotion-detection" className="text-slate-600 hover:text-violet-600 font-bold transition text-sm">Emotion Scan</Link>
            <Link to="/insights" className="text-slate-600 hover:text-violet-600 font-bold transition text-sm">Exercises</Link>
            <Link to="/dashboard" className="text-slate-600 hover:text-violet-600 font-bold transition text-sm">Mood History</Link>
            <Link to="/login" className="text-slate-500 hover:text-red-500 font-semibold transition text-sm">Logout</Link>
          </div>
        </nav>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 py-8 page-transition">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/emotion-detection" element={<EmotionDetection />} />
          <Route path="/insights" element={<MindfulExercises />} />
          <Route path="/dashboard" element={<MoodDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

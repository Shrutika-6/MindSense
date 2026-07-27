import React from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import "./App.css";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import EmotionDetection from "./components/EmotionDetection";
import BreathingExercises from "./components/BreathingExercises";
import ReflectionJournal from "./components/ReflectionJournal";
import MoodDashboard from "./components/MoodDashboard";
import SelfCompassionJar from "./components/SelfCompassionJar";
import MindSenseLogo from "./components/MindSenseLogo";

function App() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("userEmail");

  // Determine if the current route is one of the auth pages
  const isAuthPage = ["/", "/signup", "/login"].includes(location.pathname);

  // 1. Route Guard: Redirect unauthorized users to login
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Route Guard: Redirect logged-in users away from signup/login to home
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="lava-background">
        <div className="lava-blob blob-lavender"></div>
        <div className="lava-blob blob-pink"></div>
        <div className="lava-blob blob-mint"></div>
        <div className="lava-blob blob-peach"></div>
      </div>

      {!isAuthPage && (
        <nav className="backdrop-blur-md bg-white/40 border-b border-white/60 sticky top-0 z-50 px-8 py-3.5 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <Link to="/home" className="text-2xl font-extrabold flex items-center gap-2 hover:opacity-90 transition">
            <MindSenseLogo size={32} />
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
              MindSense
            </span>
          </Link>
          <div className="flex gap-8 items-center">
            <Link to="/home" className="text-slate-600 hover:text-indigo-600 font-bold transition text-sm">Home</Link>
            <Link to="/emotion-detection" className="text-slate-600 hover:text-indigo-600 font-bold transition text-sm">Emotion Scan</Link>
            <Link to="/exercises" className="text-slate-600 hover:text-indigo-600 font-bold transition text-sm">Exercises</Link>
            <Link to="/journal" className="text-slate-600 hover:text-indigo-600 font-bold transition text-sm">Journal</Link>
            <Link to="/jar" className="text-slate-600 hover:text-indigo-600 font-bold transition text-sm">Joy Jar</Link>
            <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-bold transition text-sm">Mood History</Link>
            {/* Clear user session upon click */}
            <Link 
              to="/login" 
              onClick={() => localStorage.removeItem("userEmail")} 
              className="text-slate-500 hover:text-red-500 font-semibold transition text-sm"
            >
              Logout
            </Link>
          </div>
        </nav>
      )}

      {isAuthPage ? (
        <div className="w-full min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 page-transition">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/emotion-detection" element={<EmotionDetection />} />
            <Route path="/exercises" element={<BreathingExercises />} />
            <Route path="/journal" element={<ReflectionJournal />} />
            <Route path="/dashboard" element={<MoodDashboard />} />
            <Route path="/jar" element={<SelfCompassionJar />} />
            {/* Catch-all redirect to home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;

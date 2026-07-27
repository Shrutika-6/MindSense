import React, { useState } from "react";
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("userEmail");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
            {/* Click triggers confirmation overlay modal */}
            <button 
              onClick={() => setShowLogoutConfirm(true)} 
              className="text-slate-500 hover:text-red-500 font-semibold transition text-sm cursor-pointer bg-transparent border-none outline-none"
            >
              Logout
            </button>
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

      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-modal-fade">
          <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-[32px] p-6 max-w-sm w-full shadow-2xl animate-scale-up text-center flex flex-col gap-4">
            <div className="text-4xl mb-1">🚪</div>
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">Log Out</h3>
              <p className="text-slate-500 text-xs font-semibold mt-2 leading-relaxed">
                Are you sure you want to end your wellness session today? Your mood analytics and reflections are safe.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  localStorage.removeItem("userEmail");
                  navigate("/login");
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

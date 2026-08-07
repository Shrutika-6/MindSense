import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH_API_URL } from "./config";
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

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Determine if the current route is one of the auth pages
  const isAuthPage = ["/", "/signup", "/login"].includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsTokenValid(false);
      setIsValidating(false);
      return;
    }

    // Verify token validity with Express auth_service backend
    axios.get(`${AUTH_API_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.data && res.data.status === "Success") {
          setIsTokenValid(true);
        } else {
          // Token is invalid/expired
          localStorage.removeItem("authToken");
          localStorage.removeItem("userEmail");
          setIsTokenValid(false);
        }
        setIsValidating(false);
      })
      .catch((err) => {
        console.error("Session verification error:", err);
        // Fallback: If network is offline but local token exists, allow offline usage to prevent blocking
        setIsTokenValid(true);
        setIsValidating(false);
      });
  }, [location.pathname]);

  // Loading indicator overlay during active token verification
  if (isValidating) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="lava-background">
          <div className="lava-blob blob-lavender"></div>
          <div className="lava-blob blob-pink"></div>
          <div className="lava-blob blob-mint"></div>
          <div className="lava-blob blob-peach"></div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-[32px] p-8 max-w-xs text-center shadow-lg flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // 1. Route Guard: Redirect unauthorized users to login
  if (!isTokenValid && !isAuthPage) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Route Guard: Redirect logged-in users away from signup/login to home
  if (isTokenValid && isAuthPage) {
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
        <nav className="backdrop-blur-md bg-white/40 border-b border-white/60 sticky top-0 z-50 px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <Link to="/home" className="text-2xl font-extrabold flex items-center gap-2 hover:opacity-90 transition">
            <MindSenseLogo size={32} />
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
              MindSense
            </span>
          </Link>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-8 items-center text-center">
            <Link to="/home" className="text-slate-600 hover:text-indigo-600 font-bold transition text-xs md:text-sm">Home</Link>
            <Link to="/emotion-detection" className="text-slate-600 hover:text-indigo-600 font-bold transition text-xs md:text-sm">Emotion Scan</Link>
            <Link to="/exercises" className="text-slate-600 hover:text-indigo-600 font-bold transition text-xs md:text-sm">Exercises</Link>
            <Link to="/journal" className="text-slate-600 hover:text-indigo-600 font-bold transition text-xs md:text-sm">Journal</Link>
            <Link to="/jar" className="text-slate-600 hover:text-indigo-600 font-bold transition text-xs md:text-sm">Joy Jar</Link>
            <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-bold transition text-xs md:text-sm">Mood History</Link>
            {/* Click triggers confirmation overlay modal */}
            <button 
              onClick={() => setShowLogoutConfirm(true)} 
              className="text-slate-600 hover:text-red-500 font-bold transition text-xs md:text-sm cursor-pointer bg-transparent border-none outline-none p-0"
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
                  localStorage.removeItem("authToken");
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

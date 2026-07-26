"use client"
import React from "react"
import { useNavigate } from "react-router-dom"

const MindSenseLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4f46e5"/>
        <stop offset="100%" stopColor="#10b981"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#logoGrad)"/>
    <ellipse cx="50" cy="48" rx="26" ry="22" fill="none" stroke="white" strokeWidth="2.5"/>
    <ellipse cx="50" cy="48" rx="14" ry="15" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 2"/>
    <polyline points="24,48 33,48 37,34 43,62 49,42 54,54 58,48 76,48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="28" cy="32" r="2.5" fill="white" opacity="0.7"/>
    <circle cx="72" cy="34" r="2" fill="white" opacity="0.6"/>
    <circle cx="70" cy="66" r="2.5" fill="white" opacity="0.7"/>
  </svg>
)

export default function Home() {
  const navigate = useNavigate()
  const userEmail = localStorage.getItem("userEmail") || "friend"
  const displayName = userEmail.split("@")[0]

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 relative select-none">
      
      {/* 3D Floating Orbs & Sparks in background */}
      <div className="absolute top-10 left-[15%] w-24 h-24 rounded-full bg-gradient-to-tr from-teal-300/30 to-indigo-400/20 blur-md animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-mint-300/20 to-teal-400/20 blur-lg animate-bounce pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] text-teal-300/40 text-xl animate-pulse">✦</div>

      {/* Top Welcome Banner */}
      <div className="w-full bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 flex justify-between items-center shadow-[0_15px_35px_rgba(13,148,136,0.04)] relative overflow-hidden group">
        <div className="flex items-center gap-4">
          <MindSenseLogo size={52} />
          <div>
            <h2 className="text-2xl font-black text-slate-800 leading-tight capitalize">Welcome, {displayName}!</h2>
            <p className="text-slate-500 text-xs font-semibold mt-1">Let's nurture your mind and create space for peace today.</p>
          </div>
        </div>
        <div className="hidden md:block bg-gradient-to-r from-indigo-600 via-teal-500 to-emerald-400 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md">
          🌸 MindSense AI Premium
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: AI Camera Check-in Centerpiece (Width: 5/12) */}
        <div className="md:col-span-5 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(13,148,136,0.06)] flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[400px]">
          
          <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Mood check-in
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Emotion Scanner</h3>
            <p className="text-slate-400 text-xs font-semibold">Instant webcam-based sentiment mapping</p>
          </div>

          {/* 3D Rotating Breathing Centerpiece */}
          <div 
            onClick={() => navigate("/emotion-detection")}
            className="breathing-border cursor-pointer transition-transform duration-500 hover:scale-105 my-6"
          >
            <div className="w-40 h-40 rounded-full bg-white/90 flex flex-col items-center justify-center p-3 text-center shadow-inner relative overflow-hidden group">
              <span className="text-4xl mb-1 group-hover:scale-110 transition-transform">🌿</span>
              <span className="text-xs font-extrabold text-teal-600 tracking-wider uppercase">Scan Face</span>
              <span className="text-[9px] font-bold text-slate-400 mt-1">Tap to launch camera</span>
            </div>
          </div>

          <button 
            onClick={() => navigate("/emotion-detection")}
            className="w-full py-3.5 rounded-2xl font-extrabold text-white text-xs tracking-wider uppercase bg-gradient-to-r from-indigo-600 via-teal-500 to-emerald-400 shadow-[0_6px_15px_rgba(13,148,136,0.25)] hover:shadow-[0_10px_24px_rgba(13,148,136,0.35)] transition-all"
          >
            Start scanning
          </button>
        </div>

        {/* Right Column: Feature Dashboard Grid (Width: 7/12) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Feature 1: Breathing Exercises */}
            <div 
              onClick={() => navigate("/insights")}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-48 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(16,185,129,0.12)] transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-200/50 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                🌬️
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 leading-tight mb-1">Breathing Exercises</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">Guided deep breathing patterns to reduce anxiety and stress instantly.</p>
              </div>
            </div>

            {/* Feature 2: Gratitude Journal */}
            <div 
              onClick={() => navigate("/insights")}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-48 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(13,148,136,0.1)] transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-teal-200/30 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                📓
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 leading-tight mb-1">Mindfulness Journal</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">Reflect on your thoughts, log gratitude entries, and track patterns.</p>
              </div>
            </div>

            {/* Feature 3: Mood History Analytics */}
            <div 
              onClick={() => navigate("/dashboard")}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-48 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(13,148,136,0.12)] transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-200/50 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                📊
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 leading-tight mb-1">Mood Analytics</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">Inspect 7-day reports, charts, and generate personalized AI insights.</p>
              </div>
            </div>

            {/* Feature 4: Self-Compassion Jar */}
            <div 
              onClick={() => navigate("/jar")}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-48 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(20,184,166,0.12)] transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-teal-200/50 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                🫙
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 leading-tight mb-1">Self-Compassion Jar</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">Save glowing memories of gratitude and draw them randomly when you feel low.</p>
              </div>
            </div>

          </div>

          {/* Daily Quote / Coping Tip Card */}
          <div className="w-full bg-white/50 border border-white/80 rounded-[24px] p-5 shadow-inner flex items-center gap-4">
            <span className="text-3xl animate-bounce">🌸</span>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Reflection</p>
              <p className="text-slate-700 text-xs font-semibold italic mt-0.5 leading-relaxed">
                "You don't have to control your thoughts. You just have to stop letting them control you." — Dan Millman
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

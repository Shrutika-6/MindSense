"use client"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MindSenseLogo from "./MindSenseLogo"

const WELLNESS_QUOTES = [
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "Self-compassion is simply giving ourselves the same kindness we would give to others.", author: "Kristin Neff" },
  { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh" },
  { text: "You are worth quiet moments. You are worth space to breathe.", author: "Morgan Harper Nichols" },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { text: "Caring for myself is not self-indulgence, it is self-preservation.", author: "Audre Lorde" },
  { text: "Breathe in deeply to bring your mind home to your body.", author: "Thich Nhat Hanh" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" }
]

export default function Home() {
  const navigate = useNavigate()
  const userEmail = localStorage.getItem("userEmail") || "friend"
  const displayName = userEmail.split("@")[0]

  const dateIndex = new Date().getDate() % WELLNESS_QUOTES.length
  const dailyQuote = WELLNESS_QUOTES[dateIndex]

  const [latestCheckin, setLatestCheckin] = useState(null)

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/history/latest?user_id=${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.latest) {
          const lastTime = new Date(data.latest.timestamp)
          const now = new Date()
          const diffTime = Math.abs(now - lastTime)
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          setLatestCheckin({
            emotion: data.latest.emotion,
            daysAgo: diffDays
          })
        }
      })
      .catch((err) => console.log("Failed to fetch latest emotion:", err))
  }, [userEmail])

  const getGreetingMessage = () => {
    if (!latestCheckin) {
      return "Welcome! We haven't done an emotion check-in yet. How are you feeling today?"
    }
    const { emotion, daysAgo } = latestCheckin
    if (daysAgo === 0) {
      return `Glad to see you back today! Earlier you checked in feeling ${emotion}. How are you feeling right now?`
    }
    return `Haven't seen you in ${daysAgo} day${daysAgo > 1 ? 's' : ''}! Last time you checked in, you were feeling ${emotion}. How are you feeling now?`
  }

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
            <p className="text-slate-500 text-xs font-semibold mt-1.5 leading-relaxed">
              {getGreetingMessage()}
            </p>
          </div>
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
              <div className="w-16 h-16 flex items-center justify-center mb-1 select-none relative">
                
                {/* Tech Scanning Sweeper Line */}
                <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_8px_#2dd4bf] z-10 animate-scan pointer-events-none" />

                <svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-105 transition-transform duration-500">
                  <defs>
                    <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="rgba(45, 212, 191, 0.18)" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>

                  {/* High-tech glow backing */}
                  <circle cx="50" cy="50" r="42" fill="url(#meshGlow)" />

                  {/* Symmetrical Human Head Outline */}
                  <circle 
                    cx="50" 
                    cy="36" 
                    r="16" 
                    stroke="rgba(79, 70, 229, 0.75)" 
                    strokeWidth="2.5" 
                    fill="none" 
                  />

                  {/* Symmetrical Human Shoulders outline */}
                  <path 
                    d="M 24 76 C 24 60, 34 52, 50 52 C 66 52, 76 60, 76 76" 
                    stroke="rgba(79, 70, 229, 0.75)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    fill="none" 
                  />

                  {/* Target Scanner Reticle */}
                  <circle cx="50" cy="36" r="23" stroke="rgba(20,184,166,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                  
                  {/* Crosshair ticks */}
                  <path d="M 50 8 V 14" stroke="rgba(20,184,166,0.4)" strokeWidth="1" />
                  <path d="M 50 58 V 64" stroke="rgba(20,184,166,0.4)" strokeWidth="1" />
                  <path d="M 22 36 H 28" stroke="rgba(20,184,166,0.4)" strokeWidth="1" />
                  <path d="M 72 36 H 78" stroke="rgba(20,184,166,0.4)" strokeWidth="1" />
                </svg>
              </div>
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
              onClick={() => navigate("/exercises")}
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
              onClick={() => navigate("/journal")}
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
                "{dailyQuote.text}" — {dailyQuote.author}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

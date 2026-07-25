"use client"
import React from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate("/emotion-detection")
  }

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center py-6 px-4 relative overflow-hidden select-none">
      {/* Decorative Pastel Stars/Sparkles */}
      <div className="absolute top-10 left-[15%] text-pink-400/50 text-2xl animate-pulse">✦</div>
      <div className="absolute top-[20%] right-[10%] text-purple-400/50 text-3xl animate-bounce delay-75">✧</div>
      <div className="absolute bottom-10 left-[20%] text-teal-400/50 text-2xl animate-pulse delay-500">✦</div>
      <div className="absolute bottom-[30%] right-[15%] text-amber-400/60 text-xl animate-bounce">✧</div>

      {/* Hero Section Container */}
      <div className="bg-white/50 backdrop-blur-2xl border border-white/70 rounded-[32px] p-10 md:p-14 max-w-3xl w-full text-center shadow-[0_20px_50px_rgba(244,114,182,0.15)] mb-12 relative z-10">
        
        {/* Soft Inner Glow Decorative Dot */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-pink-300/30"></div>
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-purple-300/30"></div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent tracking-tight mb-4 animate-fade-in">
          How are you feeling today?
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto mb-10">
          Step into a serene space powered by compassionate AI. Let us help you check in with yourself.
        </p>

        {/* Breathing Centerpiece Circle with Rotating Rainbow Gradient Border */}
        <div className="flex justify-center mb-10">
          <div 
            onClick={handleStart}
            className="breathing-border cursor-pointer transition-transform duration-500 hover:scale-105"
          >
            <div className="w-48 h-48 rounded-full bg-white/90 flex flex-col items-center justify-center p-4 text-center shadow-inner relative overflow-hidden group">
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">🌿</span>
              <span className="text-sm font-extrabold text-violet-600 tracking-wider uppercase">Check In</span>
              <span className="text-[10px] font-bold text-slate-400 mt-1">Tap to scan face</span>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-4">
          <button 
            onClick={() => navigate("/insights")}
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.45)] hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <span>🌬️</span> Breathing
          </button>
          
          <button 
            onClick={() => navigate("/insights")}
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow-[0_8px_20px_rgba(244,63,94,0.25)] hover:shadow-[0_12px_28px_rgba(244,63,94,0.45)] hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <span>📓</span> Journal
          </button>

          <button 
            onClick={() => navigate("/calculator")}
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-400 to-purple-600 shadow-[0_8px_20px_rgba(124,58,237,0.25)] hover:shadow-[0_12px_28px_rgba(124,58,237,0.45)] hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <span>📊</span> Assessment
          </button>
        </div>

      </div>

      {/* Quote Banner */}
      <p className="text-slate-400 text-sm md:text-base font-semibold italic text-center max-w-md bg-white/30 px-6 py-2 rounded-full border border-white/40 shadow-sm backdrop-blur-sm">
        "Feeling is the first step toward healing."
      </p>
    </div>
  )
}

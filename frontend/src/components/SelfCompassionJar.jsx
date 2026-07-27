import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function SelfCompassionJar() {
  const [memories, setMemories] = useState([])
  const [newMemory, setNewMemory] = useState("")
  const [drawnMemory, setDrawnMemory] = useState(null)
  const [shaking, setShaking] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorModal, setErrorModal] = useState(null)
  const [bubbleFloating, setBubbleFloating] = useState(false)
  const [revealMemoryCard, setRevealMemoryCard] = useState(false)
  const navigate = useNavigate()

  const userId = localStorage.getItem("userEmail") || "anonymous"

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = () => {
    fetch(`http://127.0.0.1:5000/memories?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setMemories(data.memories || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleAddMemory = (e) => {
    e.preventDefault()
    if (!newMemory.trim() || submitting) return

    setSubmitting(true)
    fetch("http://127.0.0.1:5000/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, text: newMemory })
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(false)
        if (data.is_positive === false) {
          setErrorModal(data.message)
        } else {
          setNewMemory("")
          fetchMemories() // Reload memories list to drop a new sphere in the jar
        }
      })
      .catch(() => setSubmitting(false))
  }

  const handleDrawMemory = () => {
    if (memories.length === 0) return
    setShaking(true)
    setDrawnMemory(null)
    setBubbleFloating(false)
    setRevealMemoryCard(false)

    // Shake animation for 1.2 seconds, then retrieve random memory
    setTimeout(() => {
      fetch(`http://127.0.0.1:5000/memories/random?user_id=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setShaking(false)
          setDrawnMemory(data.memory)
          if (data.memory) {
            setBubbleFloating(true)
            // Wait 1.8s for bubble to float up, then pop and reveal the text card
            setTimeout(() => {
              setBubbleFloating(false)
              setRevealMemoryCard(true)
            }, 1800)
          }
        })
        .catch(() => setShaking(false))
    }, 1200)
  }

  // Create an array for the floating spheres inside the jar (vibrant, rich gradients with strong glows)
  const sphereColors = [
    "bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-100 shadow-[0_0_20px_rgba(245,158,11,0.9)]",
    "bg-gradient-to-tr from-pink-500 via-pink-400 to-pink-100 shadow-[0_0_20px_rgba(244,63,94,0.9)]",
    "bg-gradient-to-tr from-violet-500 via-violet-400 to-fuchsia-105 shadow-[0_0_20px_rgba(139,92,246,0.9)]",
    "bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-100 shadow-[0_0_20px_rgba(16,185,129,0.9)]",
    "bg-gradient-to-tr from-cyan-500 via-cyan-400 to-sky-100 shadow-[0_0_20px_rgba(6,182,212,0.9)]",
  ]

  // Render floating spheres at randomized offsets within the glass jar body boundaries
  const renderedSpheres = memories.slice(0, 15).map((_, i) => {
    const colorClass = sphereColors[i % sphereColors.length]
    // Generate deterministic pseudo-random positions inside the SVG body bounds
    const leftOffset = 22 + ((i * 17) % 52) // Between 22% and 74%
    const bottomOffset = 12 + ((i * 12) % 56) // Between 12% and 68%
    const delay = (i * 0.3).toFixed(1)
    const scale = 0.9 + ((i * 0.1) % 0.4) // Scale between 0.9 and 1.3

    return (
      <div
        key={i}
        className={`absolute rounded-full w-7 h-7 ${colorClass} animate-pulse`}
        style={{
          left: `${leftOffset}%`,
          bottom: `${bottomOffset}%`,
          transform: `scale(${scale})`,
          animationDelay: `${delay}s`,
          transition: "all 0.5s ease"
        }}
      />
    )
  })

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 flex flex-col items-center gap-6 relative select-none">
      
      {/* Back button */}
      <Link to="/home" className="text-slate-700 hover:text-indigo-600 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 self-start select-none cursor-pointer hover:-translate-x-0.5">
        ← Back to Home
      </Link>

      <div className="text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
          The Self-Compassion Jar 🫙
        </h1>
        <p className="text-slate-500 text-sm font-semibold mt-2">
          Save glowing memories of gratitude and draw them randomly when you need a gentle pick-me-up.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-4">
        
        {/* Left Side: The 3D-feel Jar Visualizer (Width: 5/12) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          
          <div className="relative">
            {/* Custom SVG Glass Jar Container with Spheres layered inside */}
            <div className={`relative w-[260px] h-[340px] flex items-center justify-center ${shaking ? "animate-shake" : ""}`}>
              
              {/* Spheres Layer (layered behind the glass reflections) */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-400">Loading jar...</div>
                ) : memories.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-slate-400 font-semibold text-[11px] leading-relaxed">
                    <span>✨ Empty Jar ✨</span>
                    <span className="mt-1">Drop a glowing memory inside!</span>
                  </div>
                ) : (
                  renderedSpheres
                )}
              </div>

              {/* Glowing floating memory bubble (rising out of the jar neck during draw) */}
              {bubbleFloating && (
                <div className="absolute top-[30px] left-[106px] w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-300/60 via-amber-400/50 to-pink-300/30 border border-white/80 shadow-[0_0_25px_rgba(245,158,11,0.85)] z-30 animate-bubble-float pointer-events-none" />
              )}

              {/* Open Drawn Memory Bubble (Centered overlay inside the jar itself!) */}
              {drawnMemory && revealMemoryCard && (
                <div className="absolute top-[48px] left-[5px] right-[5px] bottom-[5px] bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center animate-modal-fade rounded-[48px]">
                  <span className="text-3xl mb-2 animate-bounce">🔮</span>
                  <p className="text-amber-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">Drawn Memory</p>
                  <p className="text-white text-xs font-semibold leading-relaxed italic px-2 max-h-[140px] overflow-y-auto">
                    "{drawnMemory.text}"
                  </p>
                  <button 
                    onClick={() => {
                      setDrawnMemory(null);
                      setRevealMemoryCard(false);
                    }}
                    className="mt-4 bg-white/20 hover:bg-white/30 text-white font-extrabold text-[10px] uppercase px-4 py-1.5 rounded-full border border-white/40 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Custom SVG Jar Artwork */}
              <svg width="260" height="340" viewBox="0 0 260 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 z-0">
                <defs>
                  {/* Cork Lid Gradient */}
                  <linearGradient id="corkGrad" x1="95" y1="19" x2="165" y2="19" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8B4513" />
                    <stop offset="50%" stopColor="#CD853F" />
                    <stop offset="100%" stopColor="#8B4513" />
                  </linearGradient>
                  
                  {/* Glass Wall Gradient */}
                  <linearGradient id="glassGrad" x1="40" y1="48" x2="220" y2="335" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
                    <stop offset="30%" stopColor="rgba(255, 255, 255, 0.15)" />
                    <stop offset="70%" stopColor="rgba(255, 255, 255, 0.05)" />
                    <stop offset="100%" stopColor="rgba(233, 213, 255, 0.25)" />
                  </linearGradient>
                  
                  {/* Highlight Reflection */}
                  <linearGradient id="highlightGrad" x1="50" y1="195" x2="62" y2="195" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
                    <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>

                {/* Jar Lid (Cork) */}
                <path d="M95 12 C95 8, 165 8, 165 12 L160 30 C160 30, 100 30, 100 30 Z" fill="url(#corkGrad)" stroke="#6F360F" strokeWidth="1.5" />
                
                {/* Jar Neck */}
                <path d="M102 30 H158 V48 H102 Z" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="2.5" />
                
                {/* Jar Main Body with curved shoulders and smooth bottom */}
                <path d="M102 48 
                         C 80 48, 40 70, 40 100 
                         L 40 290 
                         C 40 315, 70 335, 130 335 
                         C 190 335, 220 315, 220 290 
                         L 220 100 
                         C 220 70, 180 48, 158 48 
                         Z" 
                      fill="url(#glassGrad)" 
                      stroke="rgba(255, 255, 255, 0.9)" 
                      strokeWidth="4.5" 
                />

                {/* Glass Gloss Highlight Overlay */}
                <path d="M50 110 C 50 110, 60 110, 60 100 L 60 280 C 60 290, 50 290, 50 280 Z" fill="url(#highlightGrad)" opacity="0.8" />
                
                {/* Inner Glow bottom shadow highlight */}
                <path d="M130 327 C 80 327, 50 310, 50 290 L 50 285 C 50 305, 80 322, 130 322 C 180 322, 210 305, 210 285 L 210 290 C 210 310, 180 327, 130 327 Z" fill="rgba(233, 213, 255, 0.35)" />
              </svg>

            </div>
          </div>

          {/* Shake / Open Button */}
          {memories.length > 0 && (
            <button
              onClick={handleDrawMemory}
              disabled={shaking}
              className="mt-6 bg-gradient-to-r from-indigo-600 via-teal-500 to-emerald-400 text-white font-extrabold px-6 py-3 rounded-2xl text-xs tracking-wider uppercase shadow-[0_6px_15px_rgba(13,148,136,0.25)] hover:shadow-[0_10px_24px_rgba(13,148,136,0.35)] transition disabled:opacity-60"
            >
              {shaking ? "💫 Shaking the Jar..." : "🔮 Draw a Happy Memory"}
            </button>
          )}
        </div>

        {/* Right Side: Log a Positive Memory Form (Width: 7/12) */}
        <div className="md:col-span-7 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-8 shadow-[0_15px_35px_rgba(13,148,136,0.05)] flex flex-col gap-5">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800">Log a Moment of Joy</h3>
            <p className="text-slate-500 text-xs font-semibold mt-1">Capture a small success, a compliment, or a moment of peace to save for later.</p>
          </div>

          <form onSubmit={handleAddMemory} className="flex flex-col gap-4">
            <textarea
              required
              rows={4}
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              placeholder="Today, I felt really good when I..."
              maxLength={200}
              className="w-full px-5 py-4 bg-white/80 border border-slate-200/80 rounded-2xl text-slate-700 text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Sphere count: {memories.length}
              </span>
              <button
                type="submit"
                disabled={submitting || !newMemory.trim()}
                className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-extrabold px-6 py-3 rounded-2xl text-xs uppercase shadow-[0_6px_15px_rgba(16,185,129,0.2)] hover:shadow-[0_10px_24px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-60"
              >
                {submitting ? "Dropping sphere..." : "✨ Drop in Jar"}
              </button>
            </div>
          </form>

          <div className="border-t border-slate-200/50 pt-4">
            <p className="text-slate-600 font-bold text-xs uppercase tracking-wider mb-2">Logged Memories</p>
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
              {memories.length === 0 ? (
                <p className="text-slate-400 text-xs font-semibold italic text-center py-4">No moments logged yet.</p>
              ) : (
                memories.map((m, i) => (
                  <div key={i} className="bg-white/50 rounded-xl px-4 py-2 border border-white/60 text-xs font-medium text-slate-700">
                    "{m.text}"
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Custom Refusal Modal Dialog */}
      {errorModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center animate-modal-fade p-4">
          <div className="bg-white/90 border border-white/80 rounded-[32px] p-8 max-w-sm w-full text-center shadow-[0_20px_50px_rgba(239,68,68,0.15)] flex flex-col items-center gap-4 animate-scale-up">
            <span className="text-4xl">🫙❌</span>
            <h3 className="text-lg font-extrabold text-slate-800">The Jar Refuses this Memory</h3>
            <p className="text-slate-600 text-xs font-semibold leading-relaxed">
              {errorModal}
            </p>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setErrorModal(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setErrorModal(null)
                  navigate("/emotion-detection")
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-extrabold py-3 rounded-2xl text-xs shadow-[0_4px_12px_rgba(13,148,136,0.2)] hover:opacity-95 transition"
              >
                Talk to Companion
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

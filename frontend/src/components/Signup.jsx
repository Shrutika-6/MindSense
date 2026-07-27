import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import MindSenseLogo from "./MindSenseLogo"
import { AUTH_API_URL } from "../config"

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handlePasswordChange = (val) => {
    setPassword(val)
    if (val.length >= 8) {
      setError("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      setLoading(false)
      return
    }
    setError("")
    setLoading(true)
    axios
      .post(`${AUTH_API_URL}/user`, { name, email, password })
      .then((result) => {
        navigate("/login")
        console.log(result)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* LEFT SIDE — Branding */}
      <div className="w-1/2 flex flex-col justify-center px-16 py-6 gap-4">

        {/* Logo + name */}
        <div className="flex items-center gap-3">
          <MindSenseLogo size={48} />
          <div>
            <p className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent leading-none">MindSense</p>
            <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">Your Wellness Companion</p>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
          Your mind deserves<br/>
          care every day.
        </h1>

        <p className="text-slate-700 text-sm lg:text-base font-semibold leading-relaxed">
          MindSense understands how you feel through your expressions and guides you toward calm, clarity, and wellbeing — personalized just for you.
        </p>

        {/* Features */}
        <div className="flex flex-col gap-3">
          {[
            { emoji: "🧠", title: "Emotion Detection", desc: "Reads your mood through your face and words" },
            { emoji: "💬", title: "Personalized Support", desc: "Responses grounded in verified wellness techniques" },
            { emoji: "📊", title: "Mood Insights", desc: "Track your emotional patterns over time" },
            { emoji: "🆘", title: "Crisis Safety Net", desc: "Always routes you to real help when you need it" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/70 backdrop-blur border border-white/80 shadow-sm flex items-center justify-center text-lg flex-shrink-0">
                {item.emoji}
              </div>
              <div>
                <p className="text-slate-800 font-bold text-sm leading-none mb-0.5">{item.title}</p>
                <p className="text-slate-500 text-xs font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex gap-3">
          {[
            { value: "7", label: "Emotions tracked" },
            { value: "6+", label: "Wellness techniques" },
            { value: "24/7", label: "Crisis support" },
          ].map((stat, i) => (
            <div key={i} className="flex-1 bg-white/50 backdrop-blur border border-white/70 rounded-xl py-2 text-center shadow-sm">
              <p className="text-xl font-black bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="border-l-4 border-emerald-300 pl-4">
          <p className="text-slate-600 text-xs font-semibold italic leading-relaxed">
            "Taking care of your mental health is one of the most important things you can do — for yourself and for the people you love."
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — Form */}
      <div className="w-1/2 flex items-center justify-center px-12 py-6">
        <div className="relative w-full max-w-md">

          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-teal-400 to-emerald-300 rounded-[36px] blur-xl opacity-20 pointer-events-none" />

          {/* Card */}
          <div className="relative bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[32px] px-10 py-8 shadow-[0_20px_60px_rgba(13,148,136,0.08)]">

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Create account</h2>
              <p className="text-slate-500 text-sm font-semibold">Start your wellness journey today — it's free</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { label: "Full Name", type: "text", placeholder: "Your name", emoji: "👤", setter: setName },
                { label: "Email Address", type: "email", placeholder: "name@domain.com", emoji: "✉️", setter: setEmail },
                { label: "Password", type: "password", placeholder: "••••••••", emoji: "🔒", setter: handlePasswordChange },
              ].map((field, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider pl-1">{field.label}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">{field.emoji}</span>
                    <input
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200/80 rounded-2xl text-slate-700 text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                    />
                  </div>
                  {field.label === "Password" && error && (
                    <p className="text-red-500 text-[10.5px] font-bold mt-1 pl-1.5 animate-pulse flex items-center gap-1">
                      <span>⚠️</span> <span>{error}</span>
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-2xl font-extrabold text-white text-sm tracking-wide bg-gradient-to-r from-indigo-600 via-teal-500 to-emerald-400 shadow-[0_6px_15px_rgba(13,148,136,0.25)] hover:shadow-[0_10px_24px_rgba(13,148,136,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating your account..." : "✨ Create Account"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-200/60" />
              <span className="text-slate-400 text-xs font-bold uppercase">or</span>
              <div className="flex-1 h-px bg-slate-200/60" />
            </div>

            <p className="text-center text-slate-500 text-xs font-semibold">
              Already have an account?{" "}
              <Link to="/login" className="font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent hover:opacity-80 transition">
                Login here →
              </Link>
            </p>

            <div className="flex items-center justify-center gap-2 mt-4 bg-slate-50/80 rounded-xl py-2 px-3">
              <span className="text-sm">🔒</span>
              <p className="text-slate-500 text-xs font-bold">Your data is private and secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup

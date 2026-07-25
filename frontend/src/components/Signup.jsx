import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

function Signup() {
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post("http://localhost:3001/user", { name, email, password })
      .then((result) => {
        navigate("/login")
        console.log(result)
      })
      .catch((err) => console.error(err))
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1.5rem",
        width: "100vw",
        boxSizing: "border-box",
      }}
    >
      <div className="glass-card" style={{ width: "100%", maxWidth: "500px", padding: "3rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" }}>Create Account</h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", fontWeight: "500" }}>Start your journey with MindSense AI</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              required
              className="form-input"
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="form-input"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="form-input"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem", padding: "1rem" }}>
            Sign Up
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "500" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "underline", color: "#0d9488", fontWeight: "700" }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', { email, password })
      .then(result => {
        console.log(result);
        if (result.data === "Success") {
          navigate("/home");
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

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
          <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" }}>Welcome Back</h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", fontWeight: "500" }}>Login to your MindSense AI account</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
            Sign In
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "500" }}>
            Don’t have an account?{' '}
            <Link to="/signup" style={{ textDecoration: "underline", color: "#0d9488", fontWeight: "700" }}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import React from "react"

export default function MindSenseLogo({ size = 48 }) {
  return (
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
}

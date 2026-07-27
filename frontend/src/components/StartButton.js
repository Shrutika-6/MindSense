import React from "react";

const StartButton = ({ onClick }) => (
  <button 
    className="bg-gradient-to-r from-indigo-600 via-teal-500 to-emerald-400 text-white font-extrabold text-xs uppercase tracking-wider px-10 py-4 rounded-2xl shadow-[0_6px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_28px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer" 
    onClick={onClick}
  >
    Start Scan
  </button>
);

export default StartButton;

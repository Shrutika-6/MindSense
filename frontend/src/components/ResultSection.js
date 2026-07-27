import React from "react";

const ResultSection = ({ stableEmotion, onRedirect }) => (
  <div className="w-full flex flex-col items-center gap-2 mt-2">
    <p className="text-emerald-600 font-extrabold uppercase tracking-widest text-[9px] flex items-center gap-1">
      🟢 Detection Complete
    </p>
    <button 
      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-center" 
      onClick={onRedirect}
    >
      🧘 Explore Calming Strategies
    </button>
  </div>
);

export default ResultSection;

import React from "react";

const EMOTION_METADATA = {
  happy: { emoji: "😊", label: "Happy", color: "bg-amber-400" },
  sad: { emoji: "🌧️", label: "Sad", color: "bg-indigo-500" },
  angry: { emoji: "🌋", label: "Angry", color: "bg-rose-500" },
  fear: { emoji: "🌪️", label: "Anxious", color: "bg-purple-500" },
  disgust: { emoji: "🤢", label: "Uncomfortable", color: "bg-emerald-500" },
  surprise: { emoji: "😲", label: "Surprised", color: "bg-pink-500" },
  neutral: { emoji: "🍃", label: "Neutral", color: "bg-slate-400" }
};

const EmotionCounts = ({ counts }) => {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="w-full flex flex-col gap-3 mt-4 text-left">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
        Stabilizing Classifications
      </span>
      {Object.entries(counts)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]) // Sort highest count first
        .map(([emotion, count]) => {
          const meta = EMOTION_METADATA[emotion] || { emoji: "🌿", label: emotion, color: "bg-slate-400" };
          const pct = Math.round((count / total) * 100);
          return (
            <div key={emotion} className="flex flex-col gap-1.5 w-full animate-scale-up">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span>{meta.emoji}</span>
                  <span className="capitalize">{meta.label}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-extrabold">{pct}% ({count}s)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${meta.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default EmotionCounts;

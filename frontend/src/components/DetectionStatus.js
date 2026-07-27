import React from "react";
import EmotionCounts from "./EmotionCounts";

const DetectionStatus = ({ emotionCounts, detectionTime }) => (
  <div className="w-full flex flex-col items-center gap-2">
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-2 w-full text-center">
      <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider">
        ⏱️ Scanner Active: {detectionTime} / 10 Seconds
      </span>
    </div>
    <EmotionCounts counts={emotionCounts} />
  </div>
);

export default DetectionStatus;

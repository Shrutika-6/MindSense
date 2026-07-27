import React from "react";

const EmotionVideo = ({ videoRef, canvasRef }) => (
  <div className="w-full h-full relative rounded-full overflow-hidden">
    <video 
      ref={videoRef} 
      className="w-full h-full object-cover bg-slate-100" 
      style={{ transform: "scaleX(-1)" }} 
      autoPlay 
      playsInline 
      muted 
    />
    <canvas ref={canvasRef} className="hidden" width="300" height="300" />
  </div>
);

export default EmotionVideo;

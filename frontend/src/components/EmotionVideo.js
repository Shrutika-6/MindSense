import React from "react";

const EmotionVideo = ({ videoRef, canvasRef }) => (
  <div className="video-wrapper">
    <video ref={videoRef} className="video-element" autoPlay muted />
    <canvas ref={canvasRef} className="hidden-canvas" width="300" height="300" />
  </div>
);

export default EmotionVideo;

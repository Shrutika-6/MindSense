import React from "react";

const StartButton = ({ onClick }) => (
  <button className="btn-primary pulsing-glow" onClick={onClick}>
    Start Analyzing
  </button>
);

export default StartButton;

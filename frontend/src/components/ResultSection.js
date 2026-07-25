import React from "react";

const ResultSection = ({ stableEmotion, onRedirect }) => (
  <>
    <p className="completion-message">Detection complete.</p>
    <button className="btn-primary" onClick={onRedirect}>
      Explore Calming Strategies
    </button>
  </>
);

export default ResultSection;

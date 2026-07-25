import React from "react";

export default function Neutral1a2b1() {
  return (
    <div className="recommendations-container">
      <ul>
        <li>Celebrating small wins boosts your mood and builds confidence — keep recognizing them!</li>
        <li>Resolving issues helps reduce stress — continue addressing things that weigh on you.</li>
        <li>Taking action brings a sense of control — nurture that empowered feeling.</li>
        <li>Reflecting on your progress reinforces positive behavior — make it a habit!</li>
      </ul>
     

      <style jsx>{`
        .recommendations-container {
          max-width: 700px;
          margin: 60px auto;
          padding: 40px;
          background: #e8f5e9;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
        }

        
        ul {
          list-style-type: none;
          padding-left: 0;
          margin-bottom: 20px;
        }

        ul li {
          font-size: 1.1rem;
          margin-bottom: 12px;
        }

        
      `}</style>
    </div>
  );
}

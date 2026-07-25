import React from "react";

export default function Neutral1c1a() {
  return (
    <div className="recommendations-container">
      
      <section>
        <h3>Explore What Might Be Going On</h3>
        <ul>
          <li>
            <strong>Feeling overwhelmed or stressed:</strong> Detachment can be a coping mechanism for stress. Acknowledge what's overwhelming you and consider simple stress-reducing activities.
          </li>
          <li>
            <strong>Lack of sleep or physical fatigue:</strong> Fatigue can dull emotions. Prioritize rest and see if your emotional responsiveness returns with more energy.
          </li>
          <li>
            <strong>Recent significant event (positive or negative):</strong> Major events, even positive ones, can sometimes lead to temporary emotional numbness. Allow yourself time to process.
          </li>
        </ul>
      </section>

      <p>It is okay to feel disconnected sometimes. These sensations often pass when we rest, reflect, and care for ourselves. You are not alone—take things at your pace.</p>

      <style jsx>{`
        .recommendations-container {
          max-width: 800px;
          margin: 50px auto;
          padding: 40px;
          background: #ebebe8ff;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #182d10ff;
        }

        h2 {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 25px;
          color: #151f0fff;
        }

        h3 {
          font-size: 1.3rem;
          color: #1e2816ff;
          margin-bottom: 15px;
        }

        ul {
          list-style: disc;
          margin-left: 25px;
        }

        ul li {
          font-size: 1.1rem;
          margin-bottom: 15px;
        }

        p {
          text-align: center;
          margin-top: 30px;
          font-size: 1.05rem;
        }
      `}</style>
    </div>
  );
}

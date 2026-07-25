import React from "react";

export default function Neutral1b1a() {
  return (
    <div className="recommendations-container">
      <h2>Calm and Centered: Reinforce Your Strategies</h2>
      <section>
        <ul>
          <li><strong>Quiet time:</strong> Quiet activities like reading or music are excellent for fostering peace. Make time for them regularly.</li>
          <li><strong>Nature connection:</strong> Connecting with nature is incredibly calming and restorative. Seek out these moments.</li>
   
        </ul>
      </section>
      <section>
  
        <ul>
          <li><strong>Gentle activities:</strong> Yoga or walking help reduce stress. Move mindfully and consistently.</li>
          <li><strong>Intense exercise:</strong> Running or sports help release tension and foster calm afterward. Stay active.</li>
          <li><strong>Mindful movement:</strong> Practices like Tai Chi or stretching connect mind and body for deeper calm.</li>
        </ul>
      </section>



      <style jsx>{`
        .recommendations-container {
          max-width: 800px;
          margin: 60px auto;
          padding: 40px;
          background: #e0f7fa;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #06342cff;
        }

        h2 {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 30px;
          color: #06332eff;
        }

        section {
          margin-bottom: 30px;
        }

        

        ul {
          list-style: disc;
          margin-left: 20px;
        }

        ul li {
          font-size: 1.1rem;
          margin-bottom: 10px;
        }

        p {
          margin-top: 30px;
          font-size: 1rem;
          text-align: center;
          color: #0c332cff;
        }
      `}</style>
    </div>
  );
}

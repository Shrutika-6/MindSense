import React from "react";

export default function Neutral1c3a() {
  return (
    <div className="recommendations-container">

      <section>
      
        <ul>
          <li>
            Yes, it makes connecting with others difficult.<em>Impact on relationships:</em> Emotional detachment can create distance in relationships. Consider talking to a trusted friend or therapist about ways to reconnect emotionally.
          </li>
         
          <li>No, I function fine, it's just how I am. <em>Self-acceptance:</em> If you function well and are content, this might be part of your emotional baseline. Continue to monitor your well-being and seek support if it changes.
          </li>
        </ul>
      </section>

  

      <style jsx>{`
        .recommendations-container {
          max-width: 800px;
          margin: 50px auto;
          padding: 40px;
          background: #e8f5e9;
          border-radius: 20px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #020302ff;
        }

        h2 {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 25px;
          color: #020402ff;
        }

        h3 {
          font-size: 1.3rem;
          color: #000000ff;
          margin-bottom: 15px;
        }

        ul {
          list-style: disc;
          margin-left: 25px;
        }

        ul li {
          font-size: 1.1rem;
          margin-bottom: 20px;
        }

        p {
          text-align: center;
          margin-top: 30px;
          font-size: 1.05rem;
          color: #2e7d32;
        }
      `}</style>
    </div>
  );
}

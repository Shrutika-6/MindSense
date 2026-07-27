import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ML_API_URL } from "../config";

const emotionColors = {
  happy: "#fbbf24",
  sad: "#818cf8",
  angry: "#f87171",
  fear: "#c084fc",
  disgust: "#34d399",
  surprise: "#f472b6",
  neutral: "#94a3b8"
};

const emotionEmojis = {
  happy: "😊", sad: "🌧️", angry: "🌋",
  fear: "🌪️", disgust: "🤢", surprise: "😲", neutral: "🍃"
};

function MoodDashboard() {
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userEmail") || "anonymous";

  useEffect(() => {
    fetch(`${ML_API_URL}/history?user_id=${userId}&days=7`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || []);
        processChartData(data.history || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const processChartData = (records) => {
    const counts = {};
    records.forEach((r) => {
      counts[r.emotion] = (counts[r.emotion] || 0) + 1;
    });
    const formatted = Object.entries(counts).map(([emotion, count]) => ({
      emotion,
      count,
      emoji: emotionEmojis[emotion] || "🌿"
    }));
    setChartData(formatted);
  };

  const generateInsight = () => {
    if (history.length === 0) return;
    setLoadingInsight(true);

    const summary = chartData
      .map((d) => `${d.emotion}: ${d.count} times`)
      .join(", ");

    fetch(`${ML_API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        emotion: "neutral",
        message: `Based on my emotion history this week: ${summary}. Give me a short, warm, personalized insight about my emotional patterns in 2-3 sentences. Be specific about what you notice.`
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setInsight(data.response || "");
        setLoadingInsight(false);
      })
      .catch(() => setLoadingInsight(false));
  };

  const getDominantEmotion = () => {
    if (chartData.length === 0) return null;
    return chartData.reduce((a, b) => (a.count > b.count ? a : b));
  };

  const dominant = getDominantEmotion();

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 flex flex-col gap-6">
      <Link to="/home" className="text-slate-700 hover:text-indigo-600 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 self-start select-none cursor-pointer hover:-translate-x-0.5">
        ← Back to Home
      </Link>
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent text-center">
        Your Mood History 📊
      </h1>
      <p className="text-center text-slate-500 font-medium text-sm">
        Last 7 days of emotional patterns
      </p>

      {loading ? (
        <div className="text-center text-slate-400 font-semibold py-12">Loading your mood data...</div>
      ) : history.length === 0 ? (
        <div className="text-center bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-10 shadow-sm">
          <p className="text-slate-500 font-semibold text-lg">No mood data yet!</p>
          <p className="text-slate-400 text-sm mt-2">Complete an emotion scan to start tracking your patterns.</p>
        </div>
      ) : (
        <>
          {dominant && (
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 shadow-sm text-center">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Most Frequent Emotion</p>
              <div className="text-5xl mb-2">{emotionEmojis[dominant.emotion]}</div>
              <p className="text-2xl font-extrabold text-slate-800 capitalize">{dominant.emotion}</p>
              <p className="text-slate-400 text-sm mt-1">detected {dominant.count} times this week</p>
            </div>
          )}

          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 shadow-sm">
            <p className="text-slate-600 font-bold text-sm mb-4 uppercase tracking-wider">Emotion Frequency</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="emotion"
                  tick={{ fontSize: 12, fontWeight: 600, fill: "#64748b" }}
                  tickFormatter={(val) => `${emotionEmojis[val] || ""} ${val}`}
                />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(value, name) => [value, "detections"]}
                  labelFormatter={(label) => `${emotionEmojis[label] || ""} ${label}`}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={emotionColors[entry.emotion] || "#a78bfa"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 shadow-sm">
            <p className="text-slate-600 font-bold text-sm mb-4 uppercase tracking-wider">Recent Sessions</p>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {history.slice(0, 10).map((record, i) => (
                <div key={i} className="flex items-center justify-between bg-white/50 rounded-xl px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span>{emotionEmojis[record.emotion] || "🌿"}</span>
                    <span className="text-slate-700 font-semibold capitalize text-sm">{record.emotion}</span>
                  </div>
                  <span className="text-slate-400 text-xs">
                    {new Date(record.timestamp).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 shadow-sm">
            <p className="text-slate-600 font-bold text-sm mb-4 uppercase tracking-wider">✨ AI Insight</p>
            {insight ? (
              <p className="text-slate-700 font-medium leading-relaxed text-sm">{insight}</p>
            ) : (
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-4">Get a personalized AI analysis of your emotional patterns this week.</p>
                <button
                  onClick={generateInsight}
                  disabled={loadingInsight}
                  className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:opacity-95 disabled:opacity-60"
                >
                  {loadingInsight ? "Analyzing your patterns..." : "✨ Generate My Insight"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MoodDashboard;

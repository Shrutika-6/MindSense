"use client";

import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const EXERCISES = [
  {
    id: 1,
    title: "Deep Breathing",
    duration: "5-10 minutes",
    icon: "🌬️",
    description: "Focus on slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 6. This activates your parasympathetic nervous system and reduces stress.",
    steps: [
      "Sit comfortably with your back straight",
      "Place one hand on chest, one on belly",
      "Breathe in slowly through your nose",
      "Feel your belly rise more than your chest",
      "Exhale slowly through your mouth",
    ],
  },
  {
    id: 2,
    title: "Body Scan Meditation",
    duration: "10-20 minutes",
    icon: "🧘‍♀️",
    description: "Systematically focus on different parts of your body, releasing tension and increasing awareness of physical sensations.",
    steps: [
      "Lie down comfortably",
      "Start from your toes",
      "Notice sensations without judgment",
      "Move slowly up your body",
      "End at the top of your head",
    ],
  },
  {
    id: 3,
    title: "5-4-3-2-1 Grounding",
    duration: "3-5 minutes",
    icon: "🌟",
    description: "Use your senses to ground yourself in the present moment. Perfect for anxiety and overwhelming situations.",
    steps: [
      "5 things you can see",
      "4 things you can touch",
      "3 things you can hear",
      "2 things you can smell",
      "1 thing you can taste",
    ],
  },
  {
    id: 4,
    title: "Loving-Kindness Meditation",
    duration: "10-15 minutes",
    icon: "💝",
    description: "Cultivate compassion and love for yourself and others through repeated positive intentions and wishes.",
    steps: [
      "Start with yourself: 'May I be happy'",
      "Extend to loved ones",
      "Include neutral people",
      "Embrace difficult relationships",
      "Expand to all beings",
    ],
  },
  {
    id: 5,
    title: "Mindful Walking",
    duration: "10-30 minutes",
    icon: "🚶‍♀️",
    description: "Transform ordinary walking into a meditative practice by focusing on each step and your surroundings.",
    steps: [
      "Walk slower than usual",
      "Feel your feet touching the ground",
      "Notice your surroundings",
      "Coordinate with your breathing",
      "Return attention when mind wanders",
    ],
  },
  {
    id: 6,
    title: "Progressive Muscle Relaxation",
    duration: "15-20 minutes",
    icon: "💪",
    description: "Systematically tense and release different muscle groups to achieve deep physical and mental relaxation.",
    steps: [
      "Start with your toes",
      "Tense muscles for 5 seconds",
      "Release and notice the relaxation",
      "Move up through your body",
      "End with your face and scalp",
    ],
  }
];

const MOOD_TAGS = [
  { emoji: "😊", label: "Peaceful", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { emoji: "☀️", label: "Joyful", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { emoji: "🍃", label: "Neutral", color: "bg-slate-50 text-slate-700 border-slate-200" },
  { emoji: "🌧️", label: "Heavy", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { emoji: "🌪️", label: "Anxious", color: "bg-purple-50 text-purple-700 border-purple-200" }
];

export default function MindfulExercises() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("exercises");
  const [activeExercise, setActiveExercise] = useState(null);

  // Journal States
  const [journalText, setJournalText] = useState("");
  const [selectedMood, setSelectedMood] = useState("Neutral");
  const [journalEntries, setJournalEntries] = useState([]);

  useEffect(() => {
    // Load entries from localStorage
    const saved = localStorage.getItem("mindsense_journal_entries");
    if (saved) {
      setJournalEntries(JSON.parse(saved));
    }
  }, []);

  // Sync tab if navigation state changes
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    const newEntry = {
      id: Date.now(),
      text: journalText,
      mood: selectedMood,
      date: new Date().toISOString()
    };

    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    localStorage.setItem("mindsense_journal_entries", JSON.stringify(updated));

    // Clear form
    setJournalText("");
    setSelectedMood("Neutral");
  };

  const handleDeleteEntry = (id) => {
    const updated = journalEntries.filter(entry => entry.id !== id);
    setJournalEntries(updated);
    localStorage.setItem("mindsense_journal_entries", JSON.stringify(updated));
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 flex flex-col gap-6 relative select-none">
      
      {/* Back Button */}
      <Link to="/home" className="text-slate-500 hover:text-indigo-600 font-bold text-sm transition flex items-center gap-1 self-start">
        ← Back to Home
      </Link>

      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent leading-tight">
          Your Mindful Space
        </h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Take a moment to nurture your emotional wellness
        </p>
      </div>

      {/* Custom Tabs Navigation */}
      <div className="flex bg-slate-200/60 backdrop-blur-md rounded-2xl p-1 gap-1 self-center border border-white/60">
        <button
          onClick={() => setActiveTab("exercises")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === "exercises"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🌬️ Exercises
        </button>
        <button
          onClick={() => setActiveTab("journal")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === "journal"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📓 Reflection Journal
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "exercises" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {EXERCISES.map((exercise) => {
            const isOpen = activeExercise === exercise.id;
            return (
              <div
                key={exercise.id}
                onClick={() => setActiveExercise(isOpen ? null : exercise.id)}
                className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 shadow-sm flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-3xl bg-white/70 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      {exercise.icon}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded-full px-3 py-1 uppercase tracking-wider">
                      {exercise.duration}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight mb-2">
                    {exercise.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">
                    {exercise.description}
                  </p>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-200/50 animate-scale-up">
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-2">How to practice:</p>
                      <ul className="flex flex-col gap-2">
                        {exercise.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-2 items-start text-xs font-semibold text-slate-600 leading-relaxed">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/30 flex justify-end">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 group-hover:underline">
                    {isOpen ? "Click to collapse" : "Click to practice"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4 items-start animate-scale-up">
          {/* Left Column: Log Reflection (7/12) */}
          <div className="md:col-span-7 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">Reflect & Release</h3>
              <p className="text-slate-500 text-[11px] font-medium mt-1 leading-relaxed">
                Writing down your thoughts helps clear mental clutter and grounds you in the present.
              </p>
            </div>

            <form onSubmit={handleSaveEntry} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">How's your mind today?</label>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Write down any thoughts, gratitude list, or daily reflections here..."
                  className="w-full h-32 bg-white/50 border border-slate-200 rounded-2xl p-4 text-xs font-medium focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed text-slate-700"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Associate Mood State</label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_TAGS.map((tag) => {
                    const isSelected = selectedMood === tag.label;
                    return (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => setSelectedMood(tag.label)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : `${tag.color} hover:opacity-90`
                        }`}
                      >
                        <span>{tag.emoji}</span>
                        <span>{tag.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                💾 Save Reflection Entry
              </button>
            </form>
          </div>

          {/* Right Column: Past Logs (5/12) */}
          <div className="md:col-span-5 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-6 shadow-sm flex flex-col gap-4 max-h-[460px]">
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">Your Reflection Log</h3>
              <p className="text-slate-500 text-[11px] font-medium mt-1">Review your emotional patterns over time</p>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
              {journalEntries.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-semibold text-xs leading-relaxed">
                  📖 No entries saved yet.<br/>
                  Write your first reflection on the left!
                </div>
              ) : (
                journalEntries.map((entry) => {
                  const tagInfo = MOOD_TAGS.find(t => t.label === entry.mood) || MOOD_TAGS[2];
                  return (
                    <div key={entry.id} className="bg-white/50 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-2 relative group shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:border-slate-300/80 transition-all">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${tagInfo.color}`}>
                          {tagInfo.emoji} {entry.mood}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(entry.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs font-semibold leading-relaxed break-words whitespace-pre-line">
                        "{entry.text}"
                      </p>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-[9px] font-bold text-red-500/80 hover:text-red-600 underline self-end mt-1 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

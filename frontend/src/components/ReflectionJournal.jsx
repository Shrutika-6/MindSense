"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MOOD_TAGS = [
  { emoji: "😊", label: "Peaceful", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { emoji: "☀️", label: "Joyful", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { emoji: "🍃", label: "Neutral", color: "bg-slate-50 text-slate-700 border-slate-200" },
  { emoji: "🌧️", label: "Heavy", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { emoji: "🌪️", label: "Anxious", color: "bg-purple-50 text-purple-700 border-purple-200" }
];

export default function ReflectionJournal() {
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
      <Link to="/home" className="text-slate-700 hover:text-indigo-600 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 self-start select-none cursor-pointer hover:-translate-x-0.5">
        ← Back to Home
      </Link>

      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent leading-tight">
          Reflection Journal
        </h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Log your thoughts, set gratitude entries, and track your patterns
        </p>
      </div>

      {/* Grid Content */}
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
    </div>
  );
}

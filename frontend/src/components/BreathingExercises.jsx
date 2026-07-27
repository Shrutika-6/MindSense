"use client";

import { useState } from "react";
import { Link } from "react-router-dom";

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

export default function BreathingExercises() {
  const [activeExercise, setActiveExercise] = useState(null);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 flex flex-col gap-6 relative select-none">
      
      {/* Back Button */}
      <Link to="/home" className="text-slate-700 hover:text-indigo-600 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 self-start select-none cursor-pointer hover:-translate-x-0.5">
        ← Back to Home
      </Link>

      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent leading-tight">
          Mindfulness & Breathing Exercises
        </h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Take a moment to release tension and focus your mind
        </p>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-scale-up">
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
    </div>
  );
}

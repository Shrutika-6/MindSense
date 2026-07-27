import React, { useRef, useEffect, useState } from "react";
import EmotionVideo from "./EmotionVideo";
import DetectionStatus from "./DetectionStatus";
import StartButton from "./StartButton";
import ResultSection from "./ResultSection";
import { useNavigate, Link } from "react-router-dom";

function EmotionDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [currentEmotion, setCurrentEmotion] = useState("Detecting...");
  const [stableEmotion, setStableEmotion] = useState(null);
  const [emotionCounts, setEmotionCounts] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });
  const emotionCountsRef = useRef(emotionCounts);

  const [detectionTime, setDetectionTime] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const userId = localStorage.getItem("userEmail") || "anonymous";

  const emotionBadges = {
    happy: { label: "Happy", emoji: "😊", gradient: "from-amber-300 to-orange-400 text-amber-950 shadow-[0_8px_20px_rgba(245,158,11,0.25)]" },
    sad: { label: "Sad", emoji: "🌧️", gradient: "from-violet-300 to-blue-400 text-violet-950 shadow-[0_8px_20px_rgba(59,130,246,0.25)]" },
    angry: { label: "Angry", emoji: "🌋", gradient: "from-rose-400 to-red-500 text-rose-950 shadow-[0_8px_20px_rgba(239,68,68,0.25)]" },
    fear: { label: "Anxious", emoji: "🌪️", gradient: "from-purple-400 to-violet-500 text-purple-950 shadow-[0_8px_20px_rgba(139,92,246,0.25)]" },
    disgust: { label: "Uncomfortable", emoji: "🤢", gradient: "from-emerald-300 to-teal-400 text-emerald-950 shadow-[0_8px_20px_rgba(16,185,129,0.2)]" },
    surprise: { label: "Surprised", emoji: "😲", gradient: "from-pink-300 to-rose-400 text-pink-950 shadow-[0_8px_20px_rgba(244,63,94,0.25)]" },
    neutral: { label: "Neutral", emoji: "🍃", gradient: "from-emerald-200 to-slate-100 text-emerald-950 shadow-[0_8px_20px_rgba(16,185,129,0.15)]" }
  };

  useEffect(() => {
    let localStream = null;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        localStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Webcam error:", err);
        setCurrentEmotion("Webcam access denied");
      });
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isDetecting) {
      interval = setInterval(() => {
        captureAndSendFrame();
        setDetectionTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= 10) {
            finishDetection();
            return 10;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting]);

  const captureAndSendFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, 300, 300);
    const imageData = canvas.toDataURL("image/jpeg");
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData }),
    })
      .then((res) => res.json())
      .then((data) => {
        const detectedEmotion = data.emotion?.toLowerCase() || "neutral";
        setCurrentEmotion(detectedEmotion);
        setEmotionCounts((prev) => {
          const updated = {
            ...prev,
            [detectedEmotion]: prev[detectedEmotion] + 1,
          };
          emotionCountsRef.current = updated;
          return updated;
        });
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setCurrentEmotion("Error connecting to server");
      });
  };

  const finishDetection = () => {
    setIsDetecting(false);
    const localCounts = { ...emotionCountsRef.current };
    let maxEmotion = "neutral";
    let maxCount = 0;
    for (const [emotion, count] of Object.entries(localCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxEmotion = emotion;
      }
    }
    setStableEmotion(maxEmotion);
    setCurrentEmotion(maxEmotion);

    // Auto-log emotion scan to history database
    fetch("http://127.0.0.1:5000/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        emotion: maxEmotion
      })
    })
      .then((res) => res.json())
      .then((data) => console.log("Auto-logged check-in:", data))
      .catch((err) => console.error("Auto-log check-in failed:", err));

    const greetings = {
      happy: "I notice a bright smile on your face! That's wonderful. What's bringing you joy today?",
      sad: "I see a touch of sadness in your expression. I'm here to listen. How are you holding up?",
      angry: "I detect some frustration or anger. It's completely valid to feel this way. Want to talk about what's going on?",
      fear: "I notice some anxiety or worry. Let's take a slow breath together. What's on your mind?",
      neutral: "You look calm and balanced. How has your day been so far?",
      disgust: "I notice a bit of discomfort. I'm here to support you. What's making you feel this way?",
      surprise: "Oh, you look surprised! Did something unexpected happen today?"
    };

    setChatMessages([
      { sender: "ai", text: greetings[maxEmotion] || "Hello, I'm MindSense. How can I support you today?", isCrisis: false }
    ]);
  };

  const handleStartDetection = () => {
    setHasStarted(true);
    setIsDetecting(true);
    setDetectionTime(0);
    setEmotionCounts({
      angry: 0, disgust: 0, fear: 0,
      happy: 0, sad: 0, surprise: 0, neutral: 0,
    });
    setCurrentEmotion("Detecting...");
    setStableEmotion(null);
    setChatMessages([]);
  };

  const navigate = useNavigate();

  const redirectToEmotionPage = () => {
    if (stableEmotion) {
      navigate(`/${stableEmotion}`);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg, isCrisis: false }]);
    setIsTyping(true);

    fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMsg,
        emotion: stableEmotion,
        user_id: userId
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsTyping(false);
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.response || "I'm here for you.",
            isCrisis: data.action === "crisis"
          },
        ]);
      })
      .catch(() => {
        setIsTyping(false);
        setChatMessages((prev) => [
          ...prev,
          { sender: "ai", text: "I'm here to support you, though I had trouble reaching my AI core.", isCrisis: false },
        ]);
      });
  };

  return (
    <div className="w-full flex flex-col items-center py-6 px-4">
      {/* Background accents */}
      <div className="absolute top-10 left-[10%] text-teal-300/40 text-xl animate-pulse">✦</div>
      <div className="absolute top-[40%] right-[10%] text-indigo-300/40 text-2xl animate-bounce">✧</div>

      {/* Back to Home Link */}
      <Link to="/home" className="text-slate-700 hover:text-indigo-600 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 self-start mb-6 select-none cursor-pointer hover:-translate-x-0.5">
        ← Back to Home
      </Link>
      
      {/* Page Title Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent leading-tight">
          Emotion Scanner
        </h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Instant webcam-based facial keypoint tracking and sentiment mapping
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Webcam Scanner Visualizer (5/12) */}
        <div className="md:col-span-5 flex flex-col items-center bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-6 shadow-sm">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-6">Camera Capture Feed</p>
          
          {/* Cam Circular container */}
          <div className="flex justify-center mb-6 relative">
            <div className={`${isDetecting ? "breathing-border" : "border-4 border-white/90 rounded-full"} p-2.5 transition-all duration-500`}>
              <div className="w-64 h-64 rounded-full overflow-hidden bg-slate-100 border-2 border-white/80 shadow-lg relative">
                <EmotionVideo videoRef={videoRef} canvasRef={canvasRef} />
                
                {isDetecting && (
                  <>
                    {/* Sweeping Laser Beam Line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#2dd4bf] z-10 animate-scan pointer-events-none" />
                    
                    {/* Circular target reticle ring */}
                    <div className="absolute inset-0 border border-teal-400/25 rounded-full pointer-events-none z-10 animate-pulse" />
                    
                    {/* Scope Crosshair Ticks */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] border-l border-dashed border-teal-400/20 z-10 pointer-events-none" />
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] border-t border-dashed border-teal-400/20 z-10 pointer-events-none" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Left Column guides & actions */}
          {!hasStarted && (
            <div className="w-full bg-white/40 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 text-center">Camera Alignment Tips</span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="text-emerald-500">✔</span>
                  <span>Center your face inside the frame</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="text-emerald-500">✔</span>
                  <span>Ensure good, bright lighting</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="text-emerald-500">✔</span>
                  <span>Maintain a natural expression</span>
                </div>
              </div>
            </div>
          )}

          {hasStarted && isDetecting && (
            <div className="w-full text-center">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">Landmark Scan Progress</p>
              {/* Linear Loading Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${(detectionTime / 10) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                Scanning... {Math.round((detectionTime / 10) * 100)}%
              </span>
            </div>
          )}

          {hasStarted && !isDetecting && (
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handleStartDetection}
                className="w-full py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-extrabold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                🔄 Scan Again
              </button>
              {stableEmotion && (
                <ResultSection stableEmotion={stableEmotion} onRedirect={redirectToEmotionPage} />
              )}
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Content Card (7/12) */}
        <div className="md:col-span-7 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-6 shadow-sm min-h-[460px] flex flex-col justify-between">
          
          {/* STATE 1: Idle (Before Scan) */}
          {!hasStarted && (
            <div className="flex flex-col justify-between h-full flex-1">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight">AI Expression Mapping 🧠</h3>
                  <p className="text-slate-500 text-xs font-semibold mt-1 leading-relaxed">
                    By launching a scan, MindSense utilizes a custom convolutional neural network (CNN) model to capture micro-expressions, helping identify your primary emotional state.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="bg-white/40 border border-slate-200/50 rounded-2xl p-4">
                    <span className="text-2xl">📸</span>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mt-2 mb-1">Webcam Mapping</h4>
                    <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Runs completely in-browser to identify key coordinates of eyes, brows, and lips.</p>
                  </div>
                  <div className="bg-white/40 border border-slate-200/50 rounded-2xl p-4">
                    <span className="text-2xl">🌿</span>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mt-2 mb-1">AI Coping Companion</h4>
                    <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Integrates Llama's cognitive techniques to guide you through reflections corresponding to your state.</p>
                  </div>
                </div>

                <div className="border-l-4 border-teal-300 pl-4 mt-2">
                  <p className="text-slate-600 text-xs font-semibold italic leading-relaxed">
                    "Self-awareness is the start of alignment. Take 10 seconds to pause and scan your mood."
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-center w-full">
                <StartButton onClick={handleStartDetection} />
              </div>
            </div>
          )}

          {/* STATE 2: Active Scan Logging (Detecting) */}
          {hasStarted && isDetecting && (
            <div className="flex flex-col justify-center items-center flex-1 py-12 gap-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-2xl animate-spin" style={{ animationDuration: '4s' }}>
                🌀
              </div>
              <div className="text-center">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Processing coordinates</p>
                <h3 className="text-2xl font-black text-slate-800 capitalize leading-tight">
                  Analyzing: <span className="text-indigo-600">{currentEmotion}</span>
                </h3>
                <p className="text-slate-500 text-xs font-semibold mt-2 leading-relaxed max-w-sm mx-auto">
                  Hold your expression still. Our CNN is scanning your facial geometry grid to stabilize the classification...
                </p>
              </div>
              
              <div className="w-full max-w-sm mt-4">
                <DetectionStatus emotionCounts={emotionCounts} detectionTime={detectionTime} />
              </div>
            </div>
          )}

          {/* STATE 3: Scan Complete (Chat Interface) */}
          {hasStarted && !isDetecting && stableEmotion && (
            <div className="flex flex-col justify-between h-full flex-1 animate-scale-up">
              <div>
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-4 mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight">Scanner Result</h3>
                    <p className="text-slate-400 text-[10px] font-medium">Mapped dominant facial expression</p>
                  </div>
                  <div className={`flex items-center gap-2 py-2 px-5 rounded-full font-extrabold text-sm bg-gradient-to-r ${emotionBadges[stableEmotion]?.gradient || "from-teal-300 to-emerald-400 text-teal-950"} shadow-sm`}>
                    <span>{emotionBadges[stableEmotion]?.emoji || "🌿"}</span>
                    <span>{emotionBadges[stableEmotion]?.label || stableEmotion}</span>
                  </div>
                </div>

                {/* Companion Chat bubbles block */}
                <div className="w-full bg-white/40 border border-white/60 rounded-[24px] p-4 shadow-inner flex flex-col max-h-[300px] overflow-hidden">
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scroll-smooth min-h-[220px]">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.isCrisis ? (
                          <div className="w-full bg-red-50 border border-red-200 rounded-[20px] px-5 py-4 text-sm font-semibold text-red-800 border-l-4 border-l-red-500">
                            🆘 {msg.text}
                          </div>
                        ) : (
                          <div className={`max-w-[85%] rounded-[20px] px-5 py-3 text-xs font-semibold shadow-sm leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-br-none"
                              : "bg-white/80 text-slate-700 rounded-bl-none border-l-4 border-teal-400"
                          }`}>
                            {msg.text}
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white/80 rounded-[20px] px-5 py-3 rounded-bl-none border-l-4 border-teal-400 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-teal-400/50 typing-dot"></span>
                          <span className="w-2 h-2 rounded-full bg-indigo-400/50 typing-dot"></span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400/50 typing-dot"></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a reflection or talk to AI Companion..."
                      className="flex-1 px-4 py-3 bg-white/90 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-400 text-slate-700"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition cursor-pointer"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default EmotionDetection;

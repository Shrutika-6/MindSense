import React, { useRef, useEffect, useState } from "react";
import EmotionVideo from "./EmotionVideo";
import DetectionStatus from "./DetectionStatus";
import StartButton from "./StartButton";
import ResultSection from "./ResultSection";
import { useNavigate } from "react-router-dom";

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
      <div className="absolute top-10 left-[10%] text-teal-300/40 text-xl animate-pulse">✦</div>
      <div className="absolute top-[40%] right-[10%] text-indigo-300/40 text-2xl animate-bounce">✧</div>

      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent mb-8">
        MindSense Scan
      </h1>

      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="flex justify-center mb-6">
          <div className={`${isDetecting ? "breathing-border" : "border-4 border-white/90 rounded-full"} p-2 transition-all duration-500`}>
            <div className="w-48 h-48 rounded-full overflow-hidden bg-slate-200 border-2 border-white/80 shadow-md">
              <EmotionVideo videoRef={videoRef} canvasRef={canvasRef} />
            </div>
          </div>
        </div>

        {!hasStarted && (
          <div className="mt-4">
            <StartButton onClick={handleStartDetection} />
          </div>
        )}

        {hasStarted && (
          <div className="w-full bg-white/60 backdrop-blur-xl border border-white/80 rounded-[28px] p-8 shadow-[0_15px_35px_rgba(13,148,136,0.05)]">
            {isDetecting ? (
              <div className="text-center">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Analyzing expression</p>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-4 capitalize">
                  Current: <span className="text-indigo-600">{currentEmotion}</span>
                </h3>
                <DetectionStatus emotionCounts={emotionCounts} detectionTime={detectionTime} />
              </div>
            ) : (
              stableEmotion && (
                <div className="flex flex-col items-center">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Dominant State</p>

                  <div className={`flex items-center gap-2 py-2 px-6 rounded-full font-extrabold text-lg bg-gradient-to-r ${emotionBadges[stableEmotion]?.gradient || "from-teal-300 to-emerald-400 text-teal-950"} mb-6`}>
                    <span>{emotionBadges[stableEmotion]?.emoji || "🌿"}</span>
                    <span>{emotionBadges[stableEmotion]?.label || stableEmotion}</span>
                  </div>

                  <div className="w-full bg-white/40 border border-white/60 rounded-[24px] p-6 shadow-inner flex flex-col max-h-[400px] overflow-hidden">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scroll-smooth min-h-[200px]">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          {msg.isCrisis && (
                            <div className="w-full bg-red-50 border border-red-200 rounded-[20px] px-5 py-4 text-sm font-semibold text-red-800 border-l-4 border-l-red-500">
                              🆘 {msg.text}
                            </div>
                          )}
                          {!msg.isCrisis && (
                            <div className={`max-w-[80%] rounded-[20px] px-5 py-3 text-sm font-semibold shadow-sm leading-relaxed ${
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
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-400/50 typing-dot"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400/50 typing-dot"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/50 typing-dot"></span>
                          </div>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Talk to MindSense AI..."
                        className="flex-1 px-4 py-3 bg-white/90 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-400 text-slate-700"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition"
                      >
                        Send
                      </button>
                    </form>
                  </div>

                  <div className="mt-6 flex justify-between w-full border-t border-slate-200/50 pt-4">
                    <button
                      onClick={handleStartDetection}
                      className="text-slate-500 hover:text-slate-700 font-bold text-sm transition"
                    >
                      🔄 Scan Again
                    </button>
                    <ResultSection stableEmotion={stableEmotion} onRedirect={redirectToEmotionPage} />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmotionDetection;

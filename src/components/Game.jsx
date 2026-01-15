"use client"
import { useState, useEffect, useRef } from "react"
import confetti from "canvas-confetti"

const GameScreen = ({ players, question, turn, onAnswer }) => {
  const [time, setTime] = useState(15);
  const [selected, setSelected] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [fullScreenGlow, setFullScreenGlow] = useState(""); 
  const timerRef = useRef();
  const bgMusic = useRef(null);

  const speak = (text) => {
    if (isMuted) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.3;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    
    bgMusic.current = new Audio("/bg-music.mp3");
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.2;
    if (!isMuted) bgMusic.current.play().catch(() => {});

    return () => bgMusic.current.pause();
  }, []);


  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) bgMusic.current.pause();
    else bgMusic.current.play();
  };

  useEffect(() => {
    setTime(15);
    setSelected(null);
    setFullScreenGlow(""); 
    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) { onAnswer(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [question]);

  const handleSelect = (opt) => {
    if (selected) return;
    clearInterval(timerRef.current);
    setSelected(opt);
    
    const isCorrect = opt === question.correctAnswer;
    
    if (isCorrect) {
      setFullScreenGlow("flash-green");
      speak("Excellent!");
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
    } else {
      setFullScreenGlow("flash-red"); 
      speak("Wrong Answer!");
    }
    
    setTimeout(() => onAnswer(isCorrect), 1500);
  };

  return (
    <div className={`full-page-wrapper ${fullScreenGlow}`}>

      <button className="sound-toggle" onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>

      <div className="game-container animate-fade">
        <div className="battle-header">
          <div className={`p-badge ${turn === 0 ? "active-glow" : ""}`}>
            {players[0].name}: {players[0].score}
          </div>
          <div className="timer-box">{time}s</div>
          <div className={`p-badge ${turn === 1 ? "active-glow" : ""}`}>
            {players[1].name}: {players[1].score}
          </div>
        </div>

        <div className="question-card glass">
          <p className="turn-indicator">{players[turn].name.toUpperCase()}'S TURN</p>
          <h2>{question.question}</h2>
        </div>

        <div className="options-grid">
          {question.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleSelect(opt)}
              className={`emerald-option ${selected === opt ? (opt === question.correctAnswer ? "correct-glow" : "wrong-opt") : ""}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
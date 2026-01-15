"use client"
import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const GameScreen = ({ players, question, turn, onAnswer, mode, myRole }) => {
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(15);
  const [fullScreenGlow, setFullScreenGlow] = useState(""); 
  const timerRef = useRef();

  // Turn check logic
  const isMyTurn = mode === "local" ? true : turn === myRole;

  // Hooks hamesha top level par hone chahiye (Early return se pehle)
  useEffect(() => {
    setSelected(null);
    setTime(15);
    setFullScreenGlow("");

    if (isMyTurn && question) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onAnswer(false); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [question, turn, isMyTurn, onAnswer]);

  // Early return ab Hooks ke BAAD hai (Rules of Hooks fix)
  if (!players || players.length === 0 || !question) {
    return <div className="loading-screen">Loading Battle...</div>;
  }

  const handleSelect = (opt) => {
    if (selected || !isMyTurn) return;

    clearInterval(timerRef.current);
    setSelected(opt);
    
    const isCorrect = opt === question.correctAnswer;
    
    if (isCorrect) {
      setFullScreenGlow("flash-green");
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      setFullScreenGlow("flash-red");
    }

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1000);
  };

  return (
    <div className={`full-page-wrapper ${fullScreenGlow}`}>
      <div className="game-container animate-fade">
        
        <div className="battle-header">
          <div className={`p-badge ${turn === 0 ? "active-glow" : ""}`}>
            {players[0]?.name}: {players[0]?.score || 0}
          </div>
          
          <div className="timer-box">
            {mode === "local" || isMyTurn ? `${time}s` : "⏳"}
          </div>
          
          <div className={`p-badge ${turn === 1 ? "active-glow" : ""}`}>
            {players[1]?.name}: {players[1]?.score || 0}
          </div>
        </div>

        <div className="question-card glass">
          <div className="indicator-area">
            {mode === "online" && !isMyTurn ? (
              <p className="turn-indicator waiting-pulse">WAITING FOR {players[turn]?.name?.toUpperCase()}...</p>
            ) : (
              <p className="turn-indicator">{players[turn]?.name?.toUpperCase()}'S TURN</p>
            )}
          </div>
          <h2>{question.question}</h2>
        </div>

        <div className={`options-grid ${!isMyTurn ? "disabled-grid" : ""}`}>
          {question.options.map((opt, i) => (
            <button 
              key={i} 
              disabled={!isMyTurn}
              onClick={() => handleSelect(opt)}
              className={`emerald-option ${
                selected === opt 
                  ? (opt === question.correctAnswer ? "correct-glow" : "wrong-opt") 
                  : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .full-page-wrapper { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: background 0.3s ease; width: 100%; }
        .flash-green { background: rgba(16, 185, 129, 0.2); }
        .flash-red { background: rgba(239, 68, 68, 0.2); }
        .battle-header { display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 600px; margin-bottom: 30px; }
        .p-badge { padding: 10px 20px; background: #064e3b; border-radius: 12px; color: white; border: 2px solid transparent; transition: 0.4s; font-weight: bold; }
        .active-glow { border-color: #10b981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); background: #065f46; }
        .timer-box { font-size: 22px; font-weight: 800; color: #10b981; background: #051c14; width: 65px; height: 65px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #10b981; }
        .question-card { background: rgba(255, 255, 255, 0.04); padding: 40px; border-radius: 25px; text-align: center; border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 25px; width: 100%; max-width: 650px; }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; max-width: 650px; }
        .emerald-option { padding: 20px; background: #064e3b; border: 1px solid #10b981; color: white; border-radius: 15px; cursor: pointer; transition: 0.2s; font-size: 18px; }
        .correct-glow { background: #10b981 !important; color: #051c14 !important; }
        .wrong-opt { background: #ef4444 !important; }
        .disabled-grid { opacity: 0.6; pointer-events: none; }
        .loading-screen { color: #10b981; font-size: 24px; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default GameScreen;
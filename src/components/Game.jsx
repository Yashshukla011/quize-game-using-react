"use client"
import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const GameScreen = ({ players, question, turn, onAnswer, mode, myRole }) => {
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(15);
  const [fullScreenGlow, setFullScreenGlow] = useState(""); 
  const timerRef = useRef();


  const isMyTurn = mode === "local" ? true : turn === myRole;

  useEffect(() => {
    setSelected(null);
    setTime(15);
    setFullScreenGlow("");
    if (timerRef.current) clearInterval(timerRef.current);

   
    if (isMyTurn && question) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
          
            handleTimeout(); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question, turn, isMyTurn]);

  const handleTimeout = () => {
    if (selected) return;
    setFullScreenGlow("flash-red");
    setTimeout(() => onAnswer(false), 500); 
  };

  const handleSelect = (opt) => {

    if (selected !== null || !isMyTurn) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(opt);


    const correctAnswer = question.correctAnswer || question.answer;
    const isCorrect = opt === correctAnswer;

    if (isCorrect) {
      setFullScreenGlow("flash-green");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setFullScreenGlow("flash-red");
    }


    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1200);
  };

  if (!players || players.length < 2 || !question) {
    return (
      <div className="full-page-wrapper">
        <div className="loader">Waiting for opponent to join...</div>
      </div>
    );
  }

  const p1 = players[0];
  const p2 = players[1];
  const currentCorrectAnswer = question.correctAnswer || question.answer;

  return (
    <div className={`full-page-wrapper ${fullScreenGlow}`}>
      <div className="game-container">
    
        <div className="battle-header">
          <div className={`p-badge ${turn === 0 ? "active-glow" : ""}`}>
            <div className="name-tag">{p1.name}</div>
            <div className="score-tag">{p1.score}</div>
          </div>
          
          <div className="timer-box">
             
            {isMyTurn ? `${time}s` : "⏳"}
          </div>
          
        {/* P2 (Opponent) Badge */}
<div className={`p-badge ${turn === 1 ? "active-glow" : ""}`}>
  <div className="name-tag">{p2?.name || "Joining..."}</div>
  <div className="score-tag">{p2?.score || 0}</div>
</div>
        </div>

 
        <div className="question-card glass">
         
<p className="turn-indicator">
  {isMyTurn ? (
    "YOUR TURN"
  ) : (
    // Agar turn 0 hai toh player 1 ka naam, agar 1 hai toh player 2 ka naam
    `WAITING FOR ${players[turn]?.name?.toUpperCase() || "OPPONENT"}`
  )}
</p>
          <h2>{question.question}</h2>
        </div>

      
        <div className={`options-grid ${!isMyTurn || selected !== null ? "disabled-grid" : ""}`}>
          {question.options.map((opt, i) => {
     
            let statusClass = "";
            if (selected === opt) {
              statusClass = opt === currentCorrectAnswer ? "correct-glow" : "wrong-opt";
            } else if (selected !== null && opt === currentCorrectAnswer) {
              statusClass = "correct-glow"; 
            }

            return (
              <button 
                key={i} 
                disabled={!isMyTurn || selected !== null} 
                onClick={() => handleSelect(opt)}
                className={`emerald-option ${statusClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .full-page-wrapper { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; background: #020617; color: white; transition: 0.4s; overflow: hidden; padding: 20px; }
        .game-container { width: 100%; max-width: 700px; display: flex; flex-direction: column; align-items: center; }
        .flash-green { background: #064e3b !important; }
        .flash-red { background: #451a1a !important; }
        .battle-header { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 30px; gap: 10px; }
        .p-badge { padding: 10px 20px; background: #1e293b; border-radius: 12px; flex: 1; text-align: center; border: 2px solid transparent; transition: 0.3s; }
        .active-glow { border-color: #10b981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); background: #0f172a; }
        .name-tag { font-size: 14px; opacity: 0.7; overflow: hidden; text-overflow: ellipsis; }
        .score-tag { font-size: 22px; font-weight: 800; color: #10b981; }
        .timer-box { font-size: 24px; font-weight: bold; border: 3px solid #10b981; min-width: 65px; height: 65px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #020617; }
        .question-card { background: rgba(255,255,255,0.05); padding: 30px; border-radius: 20px; text-align: center; width: 100%; margin-bottom: 25px; border: 1px solid rgba(16, 185, 129, 0.1); backdrop-filter: blur(10px); }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; }
        .emerald-option { padding: 20px; background: #1e293b; border: 1px solid #334155; color: white; border-radius: 15px; cursor: pointer; transition: 0.2s; font-size: 18px; font-weight: 500; }
        .emerald-option:hover:not(:disabled) { background: #334155; transform: translateY(-2px); }
        .correct-glow { background: #10b981 !important; color: white !important; border-color: #059669 !important; }
        .wrong-opt { background: #ef4444 !important; border-color: #dc2626 !important; }
        .disabled-grid { opacity: 0.8; }
        .turn-indicator { color: #10b981; font-size: 12px; letter-spacing: 2px; margin-bottom: 10px; font-weight: bold; }
        @media (max-width: 500px) {
          .options-grid { grid-template-columns: 1fr; }
          .battle-header { scale: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default GameScreen;
import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti"; // 1. Confetti import karein

const GameScreen = ({ gameState, handleAnswer, handleTimeout, player1Name, player2Name, questions, isHost, gameMode, roomId }) => {
  const [time, setTime] = useState(15);
  const [selected, setSelected] = useState(null);
  const [aiHint, setAiHint] = useState("");
  const [usedAIThisQuestion, setUsedAIThisQuestion] = useState(false);
  const [feedbackClass, setFeedbackClass] = useState(""); 
  const timerRef = useRef();

  const speakFeedback = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1; 
    setTimeout(() => { window.speechSynthesis.speak(utterance); }, 50);
  };

  // --- 2. Confetti Blast Function ---
  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      // Do jagah se blast (Left aur Right)
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const useAIExpert = () => {
    if (usedAIThisQuestion || !isMyTurn || selected) return;
    setUsedAIThisQuestion(true);
    const currentQuestion = questions[gameState.currentQuestionIndex];
    const hints = [
      `The answer starts with the letter ${currentQuestion.correctAnswer[0]}`,
      `Focus on the word ${currentQuestion.correctAnswer.split(' ')[0]}`,
      `I believe it's a ${currentQuestion.correctAnswer.length > 7 ? "long" : "short"} answer.`
    ];
    const pickedHint = hints[Math.floor(Math.random() * hints.length)];
    setAiHint(pickedHint);
    speakFeedback(pickedHint);
  };

  useEffect(() => {
    if (gameState && questions && questions[gameState.currentQuestionIndex]) {
      const isMyTurn = gameMode === "local" ? true : (isHost ? gameState.isYashsTurn : !gameState.isYashsTurn);
      setTime(15);
      setSelected(null);
      setAiHint(""); 
      setUsedAIThisQuestion(false);
      setFeedbackClass(""); 

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTime(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            if (isMyTurn) {
              speakFeedback("Time is up!");
              handleTimeout();
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { 
      if (timerRef.current) clearInterval(timerRef.current);
      window.speechSynthesis.cancel(); 
    };
  }, [gameState?.currentQuestionIndex, isHost, gameMode, handleTimeout, questions]);

  const { currentQuestionIndex, isYashsTurn, yashScore, shukalScore } = gameState;
  const currentQuestion = questions[currentQuestionIndex];
  const isMyTurn = gameMode === "local" ? true : (isHost ? isYashsTurn : !isYashsTurn);

  const onSelect = (opt) => {
    if (selected || !isMyTurn) return;
    setSelected(opt);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = opt === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setFeedbackClass("correct-glow");
      speakFeedback("Your answer is correct");
      fireConfetti(); // 3. Sahi jawab par blast!
    } else {
      setFeedbackClass("wrong-shake");
      speakFeedback("Wrong answer");
    }

    setTimeout(() => {
      handleAnswer(isCorrect);
    }, 2000); // Thoda zyada delay taaki confetti dikhe
  };

  return (
    <div className={`game-container animate-fade ${feedbackClass}`}>
      <div className="game-header">
        <span className="room-badge">ROOM: {roomId?.slice(0,6)}</span>
        <div className="score-row">
          <div className={`p-score ${isYashsTurn ? 'active-glow' : ''}`}>
            <span className="p-name">{player1Name}</span>
            <span className="p-points">{yashScore}</span>
          </div>
          <div className="score-vs">VS</div>
          <div className={`p-score ${!isYashsTurn ? 'active-glow' : ''}`}>
            <span className="p-name">{player2Name}</span>
            <span className="p-points">{shukalScore}</span>
          </div>
        </div>
      </div>

      <div className="question-card">
        <div className="timer-wrapper">
          <svg className="timer-svg">
            <circle r="35" cx="40" cy="40"></circle>
            <circle r="35" cx="40" cy="40" style={{ strokeDashoffset: 220 - (220 * time) / 15 }}></circle>
          </svg>
          <span className="timer-text">{time}</span>
        </div>

        <h2 className="question-text">{currentQuestion?.question}</h2>

        <div className="advance-actions">
          {isMyTurn && !selected && (
            <button 
              onClick={useAIExpert} 
              className={`adv-btn ai ${usedAIThisQuestion ? 'disabled-btn' : ''}`}
              disabled={usedAIThisQuestion}
            >
              🤖 {usedAIThisQuestion ? "Hint Used" : "Get AI Hint"}
            </button>
          )}
        </div>

        {aiHint && <div className="ai-hint-msg animate-fade">🤖 {aiHint}</div>}
      </div>

      <div className="options-grid">
        {currentQuestion?.options.map((opt, index) => (
          <button 
            key={index} 
            onClick={() => onSelect(opt)} 
            disabled={!isMyTurn || !!selected}
            className={`emerald-option ${selected === opt ? (opt === currentQuestion.correctAnswer ? "correct-opt" : "wrong-opt") : ""} ${!isMyTurn ? "locked" : ""}`}
          >
            <span className="opt-index">{String.fromCharCode(65 + index)}</span>
            <span className="opt-text">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
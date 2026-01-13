import React, { useState, useEffect, useRef } from "react";

const GameScreen = ({ gameState, handleAnswer, handleTimeout, player1Name, player2Name, questions, isHost, gameMode, roomId }) => {
  const [time, setTime] = useState(15);
  const [selected, setSelected] = useState(null);
  const timerRef = useRef();

  // Hooks (Rules of Hooks follow karte hue top par)
  useEffect(() => {
    if (gameState && questions && questions[gameState.currentQuestionIndex]) {
      const isMyTurn = gameMode === "local" ? true : (isHost ? gameState.isYashsTurn : !gameState.isYashsTurn);
      
      setTime(15);
      setSelected(null);
      
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTime(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            if (isMyTurn) handleTimeout();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState?.currentQuestionIndex, isHost, gameMode, handleTimeout, questions]);

  if (!gameState || !questions || questions.length === 0) {
    return <div className="emerald-loader">Connecting to Arena...</div>;
  }

  const { currentQuestionIndex, isYashsTurn, yashScore, shukalScore } = gameState;
  const currentQuestion = questions[currentQuestionIndex];
  const isMyTurn = gameMode === "local" ? true : (isHost ? isYashsTurn : !isYashsTurn);

  const onSelect = (opt) => {
    if (selected || !isMyTurn) return;
    setSelected(opt);
    if (timerRef.current) clearInterval(timerRef.current);
    handleAnswer(opt === currentQuestion.correctAnswer);
  };

  return (
    <div className="game-container animate-fade">
      {/* Header Info */}
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

      {/* Question Card */}
      <div className="question-card">
        <div className="timer-wrapper">
          <svg className="timer-svg">
            <circle r="35" cx="40" cy="40"></circle>
            <circle r="35" cx="40" cy="40" style={{ strokeDashoffset: 220 - (220 * time) / 15 }}></circle>
          </svg>
          <span className="timer-text">{time}</span>
        </div>
        <h2 className="question-text">{currentQuestion?.question}</h2>
      </div>

      {/* Options Grid */}
      <div className="options-grid">
        {currentQuestion?.options.map((opt, index) => (
          <button 
            key={index} 
            onClick={() => onSelect(opt)} 
            disabled={!isMyTurn || !!selected}
            className={`emerald-option ${selected === opt ? "selected" : ""} ${!isMyTurn ? "locked" : ""}`}
          >
            <span className="opt-index">{String.fromCharCode(65 + index)}</span>
            <span className="opt-text">{opt}</span>
          </button>
        ))}
      </div>

      {/* Turn Indicator Footer */}
      <div className="turn-footer">
        <div className={`status-pill ${isMyTurn ? "my-turn" : "waiting"}`}>
          {isMyTurn ? "YOUR TURN - CHOOSE NOW" : `WAITING FOR ${isYashsTurn ? player1Name : player2Name}...`}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
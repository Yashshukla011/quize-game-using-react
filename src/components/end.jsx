import React from "react";

const EndScreen = ({ player1Name, player2Name, yashScore, shukalScore }) => {
  const isP1Winner = yashScore > shukalScore;
  const isP2Winner = shukalScore > yashScore;
  const isTie = yashScore === shukalScore;

  const winnerText = isP1Winner 
    ? player1Name 
    : isP2Winner 
    ? player2Name 
    : "No One";

  return (
    <div className="emerald-container animate-fade">
      {/* Victory Header */}
      <div className="victory-box">
        <div className="crown-icon">👑</div>
        <h1 className="result-title">{isTie ? "MATCH TIED" : "VICTORY!"}</h1>
        {!isTie && <p className="winner-name-highlight">{winnerText} dominates the arena!</p>}
      </div>

      {/* Score Cards Area */}
      <div className="y">
      <div className="final-score-grid">
        {/* Player 1 Card */}
        <div className={`result-card ${isP1Winner ? "winner-glow" : ""}`}>
          <div className="rank-tag">{isP1Winner ? "#1ST" : isTie ? "DRAW" : "#2ND"}</div>
          <h2 className="player-label">{player1Name}</h2>
          <div className="final-points">{yashScore}</div>
          <p className="pts-subtext">TOTAL POINTS</p>
        </div>

        {/* VS Divider */}
        <div className="final-vs">VS</div>

        {/* Player 2 Card */}
        <div className={`result-card ${isP2Winner ? "winner-glow" : ""}`}>
          <div className="rank-tag blue">{isP2Winner ? "#1ST" : isTie ? "DRAW" : "#2ND"}</div>
          <h2 className="player-label">{player2Name}</h2>
          <div className="final-points">{shukalScore}</div>
          <p className="pts-subtext">TOTAL POINTS</p>
        </div>
      </div>
</div>
      {/* Control Buttons */}
      <div className="end-actions">
        <button
          onClick={() => window.location.reload()}
          className="play-again-btn"
        >
          <span className="btn-icon">🔄</span> REMATCH
        </button>
      </div>
    </div>
  );
};

export default EndScreen;
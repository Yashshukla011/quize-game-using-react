import React from "react";

const EndScreen = ({ player1Name, player2Name, yashScore, shukalScore }) => {
  const winnerText =
    yashScore > shukalScore
      ? `${player1Name} 🏆 wins!`
      : shukalScore > yashScore
      ? `${player2Name} 🏆 wins!`
      : "🤝 It's a tie!";

  return (
    <div className="end-screen-content">
      <h2 className="game-over-title">Game Over!</h2>
      <p className="winner-text">{winnerText}</p>

      <div className="final-scores">
        <p className="player-1-score">
          {player1Name}: <strong>{yashScore}</strong>
        </p>
        <p className="player-2-score">
          {player2Name}: <strong>{shukalScore}</strong>
        </p>
      </div>

      <div style={{ paddingTop: "1rem" }}>
        <button onClick={() => window.location.reload()} className="play-again-button">
          🔄 Play Again
        </button>
      </div>
    </div>
  );
};

export default EndScreen;

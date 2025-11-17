
import React from 'react';

const EndScreen = ({ player1Name, player2Name, yashScore, shukalScore }) => {
  let winnerText = "";

  if (yashScore > shukalScore) {
    winnerText = `${player1Name} 🏆 wins!`;
  } else if (shukalScore > yashScore) {
    winnerText = `${player2Name} 🏆 wins!`;
  } else {
    winnerText = "🤝 It's a tie!";
  }

  return (
    <div className="end-screen-content">
      <h2 className="game-over-title">Game Over!</h2>
      <p className="winner-text">{winnerText}</p>
      <div className="final-scores">
        <p className="player-1-score">{player1Name}: <span style={{ fontWeight: 'bold' }}>{yashScore}</span></p>
        <p className="player-2-score">{player2Name}: <span style={{ fontWeight: 'bold' }}>{shukalScore}</span></p>
      </div>
      <div style={{ paddingTop: '1rem' }}>
        <button 
          onClick={() => window.location.reload()} 
          className="play-again-button"
        >
          🔄 Play Again
        </button>
      </div>
    </div>
  );
};

export default EndScreen;
"use client"

const EndScreen = ({ allPlayers = [] }) => {

  const sorted = [...allPlayers].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <div className="game-container animate-fade">
      <div className="victory-box">
        <div className="crown-icon">👑</div>
        <h1 className="victory-title">VICTORY!</h1>
        <p className="winner-name">{winner?.name}</p>
        <p className="winner-subtext">The Arena Champion</p>
      </div>

      <div className="leaderboard">
        {sorted.map((p, i) => (
          <div key={i} className={`score-row ${i === 0 ? "gold-border" : ""}`}>
            <span className="rank">#{i + 1}</span>
            <span className="player-n">{p.name}</span>
            <span className="player-s">{p.score} PTS</span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => window.location.reload()} 
        className="login-btn"
        style={{ marginTop: '20px' }}
      >
        PLAY AGAIN
      </button>
    </div>
  );
};

export default EndScreen;
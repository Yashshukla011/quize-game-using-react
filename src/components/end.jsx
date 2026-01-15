"use client"

const EndScreen = ({ allPlayers = [] }) => {
  // Score ke basis par sort karna
  const sorted = [...allPlayers].sort((a, b) => (b?.score || 0) - (a?.score || 0));
  const winner = sorted[0];
  const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score;

  return (
    <div className="game-container animate-fade">
      <div className="victory-box">
        <div className="crown-icon">{isTie ? "🤝" : "👑"}</div>
        <h1 className="victory-title">{isTie ? "DRAW!" : "VICTORY!"}</h1>
        <p className="winner-name">{isTie ? "Both are Champions" : winner?.name}</p>
        <p className="winner-subtext">{isTie ? "Equal Might" : "The Arena Champion"}</p>
      </div>

      <div className="leaderboard">
        {sorted.map((p, i) => (
          <div key={i} className={`score-row ${i === 0 && !isTie ? "gold-border" : ""}`}>
            <span className="rank">#{i + 1}</span>
            <span className="player-n">{p?.name || "Player"}</span>
            <span className="player-s">{p?.score || 0} PTS</span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => window.location.reload()} 
        className="login-btn"
        style={{ marginTop: '20px', padding: '15px 40px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        PLAY AGAIN
      </button>
    </div>
  );
};

export default EndScreen;
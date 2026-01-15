"use client"

const EndScreen = ({ allPlayers = [] }) => {
  const sortedPlayers = [...allPlayers].sort((a, b) => b.score - a.score)
  const winner = sortedPlayers[0]
  const isMultiplayer = allPlayers.length >= 2

  return (
    <div className="end-screen-layout">
      <div className="emerald-container animate-fade">
        {/* Victory Header */}
        <div className="victory-box">
          <div className="crown-icon">👑</div>
          <h1 className="result-title">VICTORY!</h1>
          {isMultiplayer && <p className="winner-name-highlight">{winner?.name} dominates the arena!</p>}
        </div>

        {/* Single/Dual Player Score Display */}
        {allPlayers.length <= 2 && (
          <div className="final-score-grid">
            {sortedPlayers.map((player, idx) => (
              <div key={idx} className={`result-card ${idx === 0 ? "winner-glow" : ""}`}>
                <div className={`rank-tag ${idx > 0 ? "blue" : ""}`}>#{idx + 1}</div>
                <h2 className="player-label">{player.name}</h2>
                <div className="final-points">{player.score}</div>
                <p className="pts-subtext">TOTAL POINTS</p>
              </div>
            ))}
          </div>
        )}

        {/* Control Buttons */}
        <div className="end-actions">
          <button onClick={() => window.location.reload()} className="play-again-btn">
            <span className="btn-icon">🔄</span> REMATCH
          </button>
        </div>
      </div>

      {isMultiplayer && (
        <div className="leaderboard-panel">
          <div className="panel-header">Final Leaderboard</div>
          <div className="leaderboard-list">
            {sortedPlayers.map((player, idx) => (
              <div key={idx} className={`leaderboard-item ${idx === 0 ? "winner-highlight" : ""}`}>
                <span className="rank-number">#{idx + 1}</span>
                <span className="player-name-lb">{player.name}</span>
                <span className="score-lb">{player.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EndScreen

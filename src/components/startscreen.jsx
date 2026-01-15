"use client"
import { useState } from "react"

const StartScreen = ({ onStart }) => {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  return (
    <div className="emerald-container animate-fade">
   
      <div className="main-logo animate-glow"><div className="inner-icon">⚔️</div></div>
     
      <h1 className="welcome-text">Quiz Battle</h1>

      <div className="glass-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input
          type="text"
          placeholder="Hero 1 Name"
          value={p1}
          onChange={(e) => setP1(e.target.value)}
          className="emerald-input"
        />
        <input
          type="text"
          placeholder="Hero 2 Name"
          value={p2}
          onChange={(e) => setP2(e.target.value)}
          className="emerald-input"
        />
        <button 
          onClick={() => p1 && p2 ? onStart(p1, p2) : alert("Enter both names!")} 
          className="login-btn"
          style={{ padding: '15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          START BATTLE
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
"use client"
import { useState } from "react"

const StartScreen = ({ onStart }) => {
  const [mode, setMode] = useState("local");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState(""); 
  const [roomId, setRoomId] = useState("");
  const [isHost, setIsHost] = useState(true);

  const generateRoomId = () => {
    // 6 characters ka unique uppercase code
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
    setIsHost(true);
  };

  const handleStart = () => {
    if (mode === "local") {
      if (p1 && p2) onStart(p1, p2, null, "local");
      else alert("Enter both Hero names!");
    } else {
      if (p1 && roomId) onStart(p1, null, roomId, "online");
      else alert("Please enter name and Room ID!");
    }
  };

  return (
    <div className="emerald-container animate-fade">
      <div className="main-logo animate-glow"><div className="inner-icon">⚔️</div></div>
      <h1 className="welcome-text">Quiz Battle</h1>

     <div className="mode-toggle-box">
  <button 
    onClick={() => setMode("local")} 
    className={`mode-btn ${mode === "local" ? "active" : ""}`}
  >
    <span className="icon">🏠</span> Local Hero
  </button>
  <button 
    onClick={() => setMode("online")} 
    className={`mode-btn ${mode === "online" ? "active" : ""}`}
  >
    <span className="icon">🌐</span> Online Battle
  </button>
</div>

      <div className="glass-form">
        <input
          type="text"
          placeholder="Your Name"
          value={p1}
          onChange={(e) => setP1(e.target.value)}
          className="emerald-input"
        />

        {mode === "local" ? (
          <input
            type="text"
            placeholder="Hero 2 Name"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            className="emerald-input"
          />
        ) : (
          <div className="online-inputs">
            <div className="room-actions">
               <button type="button" onClick={generateRoomId} className="gen-btn">Create Room</button>
               <button type="button" onClick={() => {setIsHost(false); setRoomId("")}} className="gen-btn join">Join Friend</button>
            </div>
            
            <input
              type="text"
              placeholder={isHost ? "Generated Room ID" : "Enter Friend's Room ID"}
              value={roomId}
              readOnly={isHost}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="emerald-input room-id-input"
            />
            {isHost && roomId && <p className="share-text">Room Code: <span className="highlight">{roomId}</span></p>}
          </div>
        )}

        <button onClick={handleStart} className="login-btn">
          {mode === 'local' ? "START BATTLE" : (isHost ? "CREATE & START" : "JOIN BATTLE")}
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
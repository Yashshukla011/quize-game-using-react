import React, { useState } from "react";
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./Firebase";

const StartScreen = ({ onStartGame }) => {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [gameMode, setGameMode] = useState("online"); // Default to Online
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = async () => {
    const p1 = player1Name.trim();
    if (!p1) return alert("Please enter your name!");

    try {
      setIsSubmitting(true);
      if (gameMode === "local") {
        const p2 = player2Name.trim() || "Player 2";
        const docRef = await addDoc(collection(db, "games"), {
          player1Name: p1, player2Name: p2, player1Score: 0, player2Score: 0,
          currentQuestionIndex: 0, isYashsTurn: true, status: "active", mode: "local", createdAt: serverTimestamp()
        });
        onStartGame(p1, p2, "Medium", docRef.id, "local", true);
      } else {
        if (roomIdInput.trim()) {
          const docRef = doc(db, "games", roomIdInput.trim());
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            await updateDoc(docRef, { player2Name: p1, status: "active" });
            onStartGame(snap.data().player1Name, p1, "Medium", roomIdInput.trim(), "online", false);
          } else alert("Invalid Room ID!");
        } else {
          const docRef = await addDoc(collection(db, "games"), {
            player1Name: p1, player2Name: "Waiting...", player1Score: 0, player2Score: 0,
            currentQuestionIndex: 0, isYashsTurn: true, status: "waiting", mode: "online", createdAt: serverTimestamp()
          });
          alert(`Room Created! ID: ${docRef.id}`);
          onStartGame(p1, "Waiting...", "Medium", docRef.id, "online", true);
        }
      }
    } catch (e) { alert("Error!"); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="emerald-container">
      <div className="main-logo animate-glow">
        <div className="inner-icon">∞</div>
      </div>
      
      <h1 className="welcome-text">Hi, Welcome!</h1>
      <p className="sub-text">Prepare for the Ultimate Battle</p>

      <div className="glass-form">
        <div className="mode-switcher">
          <button className={gameMode === 'online' ? 'active' : ''} onClick={() => setGameMode('online')}>ONLINE</button>
          <button className={gameMode === 'local' ? 'active' : ''} onClick={() => setGameMode('local')}>LOCAL</button>
        </div>

        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="User Name or Email" 
            value={player1Name} 
            onChange={e => setPlayer1Name(e.target.value)} 
            className="emerald-input"
          />
        </div>

        {gameMode === "local" ? (
          <div className="input-wrapper animate-fade">
            <input 
              type="text" 
              placeholder="Opponent Name" 
              value={player2Name} 
              onChange={e => setPlayer2Name(e.target.value)} 
              className="emerald-input"
            />
          </div>
        ) : (
          <div className="input-wrapper animate-fade">
            <input 
              type="text" 
              placeholder="Room ID (to Join)" 
              value={roomIdInput} 
              onChange={e => setRoomIdInput(e.target.value)} 
              className="emerald-input"
            />
          </div>
        )}

        <button onClick={handleStart} className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? "SYNCING..." : "START BATTLE"}
        </button>
        
      </div>
    </div>
  );
};

export default StartScreen;
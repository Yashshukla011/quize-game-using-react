"use client"
import React, { useState, useEffect } from "react";
import StartScreen from "./components/startscreen";
import GameScreen from "./components/Game";
import EndScreen from "./components/end";
import { fetchQuizData, db } from "./components/quizData"; 
import { doc, setDoc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";

const App = () => {
  const [screen, setScreen] = useState("start");
  const [mode, setMode] = useState("local");
  const [questions, setQuestions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [turnInfo, setTurnInfo] = useState({ qIndex: 0, pTurn: 0 });
  const [roomId, setRoomId] = useState("");
  const [myRole, setMyRole] = useState(null); 

  const QUESTION_LIMIT = 5;

  // Real-time listener for Online Mode
  useEffect(() => {
    let unsubscribe;
    if (mode === "online" && roomId && screen === "game") {
      const roomRef = doc(db, "rooms", roomId);
      unsubscribe = onSnapshot(roomRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // 1. Sync Questions (Sirf ek baar)
          if (data.questions && questions.length === 0) {
            setQuestions(data.questions);
          }

          // 2. Sync Players State
          const p1 = data.player1;
          const p2 = data.player2;
          setPlayers([p1, p2]);

          // 3. Logic: Turn aur Question Index nikalna
          // Jiska index kam hai, uski turn hai
          let currentTurn = 0;
          if (p1.qIdx > p2.qIdx) {
            currentTurn = 1;
          } else if (p1.qIdx === p2.qIdx) {
            currentTurn = 0; // Dono barabar hain toh P1 start karega
          }

          const currentQIdx = currentTurn === 0 ? p1.qIdx : p2.qIdx;
          setTurnInfo({ qIndex: currentQIdx, pTurn: currentTurn });

          // 4. Game Over check (Jab dono limit tak pahunch jayein)
          if (p1.qIdx >= QUESTION_LIMIT && p2.qIdx >= QUESTION_LIMIT) {
            setScreen("end");
          }
        }
      });
    }
    return () => unsubscribe && unsubscribe();
  }, [mode, roomId, screen, questions.length]);

  const handleStartGame = async (p1Name, p2Name, rid, m) => {
    setMode(m);
    if (m === "local") {
      const data = await fetchQuizData();
      setQuestions(data);
      setPlayers([
        { name: p1Name, score: 0, qIdx: 0 }, 
        { name: p2Name, score: 0, qIdx: 0 }
      ]);
      setTurnInfo({ qIndex: 0, pTurn: 0 });
      setScreen("game");
    } else {
      // ONLINE MODE
      setRoomId(rid);
      const roomRef = doc(db, "rooms", rid);
      const roomSnap = await getDoc(roomRef);
      
      if (!roomSnap.exists()) {
        // Player 1 (Room Creator)
        const data = await fetchQuizData();
        setMyRole(0);
        sessionStorage.setItem("quiz_role", "0");
        await setDoc(roomRef, { 
          questions: data, 
          player1: { name: p1Name, score: 0, qIdx: 0 }, 
          player2: { name: "Waiting...", score: 0, qIdx: 0 } 
        });
      } else {
        // Player 2 (Joiner)
        setMyRole(1);
        sessionStorage.setItem("quiz_role", "1");
        await updateDoc(roomRef, { 
          "player2.name": p1Name, // Joiner ka naam yahan p1Name variable mein hi aata hai
          "player2.score": 0,
          "player2.qIdx": 0 
        });
      }
      setScreen("game");
    }
  };

  const handleAnswer = async (isCorrect) => {
    if (mode === "local") {
      const currentRole = turnInfo.pTurn;
      const nextTurn = currentRole === 0 ? 1 : 0;

      setPlayers((prev) => {
        const updated = [...prev];
        if (isCorrect) updated[currentRole].score += 10;
        updated[currentRole].qIdx += 1;

        const p1Done = updated[0].qIdx >= QUESTION_LIMIT;
        const p2Done = updated[1].qIdx >= QUESTION_LIMIT;

        if (p1Done && p2Done) {
          setScreen("end");
        } else {
          const targetTurn = updated[nextTurn].qIdx < QUESTION_LIMIT ? nextTurn : currentRole;
          setTurnInfo({ pTurn: targetTurn, qIndex: updated[targetTurn].qIdx });
        }
        return updated;
      });
    } else {
      // ONLINE MODE UPDATE
      const role = myRole !== null ? myRole : parseInt(sessionStorage.getItem("quiz_role"));
      if (role === null || isNaN(role)) return;

      const pKey = role === 0 ? "player1" : "player2";
      const currentPlayer = players[role];

      await updateDoc(doc(db, "rooms", roomId), {
        [`${pKey}.score`]: isCorrect ? (currentPlayer.score + 10) : currentPlayer.score,
        [`${pKey}.qIdx`]: currentPlayer.qIdx + 1
      });
    }
  };

  return (
    <div className="app-main">
      {screen === "start" && <StartScreen onStart={handleStartGame} />}
      
      {screen === "game" && questions.length > 0 && players.length >= 2 && (
        <GameScreen 
          players={players} 
          question={questions[turnInfo.qIndex]} 
          turn={turnInfo.pTurn} 
          onAnswer={handleAnswer} 
          mode={mode} 
          myRole={myRole !== null ? myRole : parseInt(sessionStorage.getItem("quiz_role"))} 
        />
      )}
      
      {screen === "end" && <EndScreen allPlayers={players} />}
    </div>
  );
};

export default App;
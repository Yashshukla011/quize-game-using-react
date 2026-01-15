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

  useEffect(() => {
    let unsubscribe;
    if (mode === "online" && roomId && screen === "game") {
      unsubscribe = onSnapshot(doc(db, "rooms", roomId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPlayers([data.player1, data.player2]);
          if (data.questions && questions.length === 0) setQuestions(data.questions);

          const p1Idx = data.player1?.qIdx || 0;
          const p2Idx = data.player2?.qIdx || 0;
          
          // Turn logic: Agar p1 ne jawaab de diya (qIdx badh gaya), toh p2 ki turn
          const currentTurn = p1Idx <= p2Idx ? 0 : 1;
          const currentQIdx = Math.min(p1Idx, p2Idx);

          setTurnInfo({ qIndex: currentQIdx, pTurn: currentTurn });

          if (p1Idx >= QUESTION_LIMIT && p2Idx >= QUESTION_LIMIT) setScreen("end");
        }
      });
    }
    return () => unsubscribe && unsubscribe();
  }, [mode, roomId, screen, questions.length]);

  const handleStartGame = async (p1, p2, rid, m) => {
    setMode(m);
    if (m === "local") {
      const data = await fetchQuizData();
      setQuestions(data);
      setPlayers([{ name: p1, score: 0, qIdx: 0 }, { name: p2, score: 0, qIdx: 0 }]);
      setScreen("game");
    } else {
      setRoomId(rid);
      const roomRef = doc(db, "rooms", rid);
      const roomSnap = await getDoc(roomRef);
      
      if (!roomSnap.exists()) {
        // HOST logic
        const data = await fetchQuizData();
        setQuestions(data);
        setMyRole(0); 
        sessionStorage.setItem("myRole", "0"); // Store role
        await setDoc(roomRef, { 
          questions: data, 
          player1: { name: p1, score: 0, qIdx: 0 }, 
          player2: { name: "Waiting...", score: 0, qIdx: 0 } 
        });
      } else {
        // GUEST logic
        setMyRole(1); 
        sessionStorage.setItem("myRole", "1"); // Store role
        await updateDoc(roomRef, { "player2.name": p1 });
      }
      setScreen("game");
    }
  };

  const handleAnswer = async (isCorrect) => {
    if (mode === "local") {
      const up = [...players];
      if (isCorrect) up[turnInfo.pTurn].score += 10;
      up[turnInfo.pTurn].qIdx += 1;
      setPlayers(up);
      setTurnInfo(prev => ({ ...prev, pTurn: prev.pTurn === 0 ? 1 : 0 }));
      if (up[0].qIdx >= QUESTION_LIMIT && up[1].qIdx >= QUESTION_LIMIT) setScreen("end");
    } else {
      // Online role retrieval
      const role = myRole !== null ? myRole : parseInt(sessionStorage.getItem("myRole"));
      if (role === null || isNaN(role)) return;

      const pKey = role === 0 ? "player1" : "player2";
      await updateDoc(doc(db, "rooms", roomId), {
        [`${pKey}.score`]: isCorrect ? (players[role].score || 0) + 10 : (players[role].score || 0),
        [`${pKey}.qIdx`]: (players[role].qIdx || 0) + 1
      });
    }
  };

  return (
    <div className="app-main">
      {screen === "start" && <StartScreen onStart={handleStartGame} />}
      {screen === "game" && questions.length > 0 && (
        <GameScreen 
          players={players} 
          question={questions[turnInfo.qIndex]} 
          turn={turnInfo.pTurn} 
          onAnswer={handleAnswer} 
          mode={mode} 
          myRole={myRole !== null ? myRole : parseInt(sessionStorage.getItem("myRole"))} 
        />
      )}
      {screen === "end" && <EndScreen allPlayers={players} />}
    </div>
  );
};
export default App;
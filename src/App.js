"use client"
import React, { useState } from "react";
import StartScreen from "./components/startscreen";
import GameScreen from "./components/Game";
import EndScreen from "./components/end";
import { fetchQuizData } from "./components/quizData"; 

const App = () => {
  const [screen, setScreen] = useState("start");
  const [questions, setQuestions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [turnInfo, setTurnInfo] = useState({ qIndex: 0, pTurn: 0 });

  const handleStartGame = async (p1Name, p2Name) => {
    const data = await fetchQuizData();
    if (data && data.length > 0) {
      setQuestions(data);
      setPlayers([
        { name: p1Name || "Player 1", score: 0 },
        { name: p2Name || "Player 2", score: 0 }
      ]);
      setScreen("game");
    }
  };

  const handleAnswer = (isCorrect) => {
    const updatedPlayers = [...players];
    if (isCorrect) updatedPlayers[turnInfo.pTurn].score += 10;
    setPlayers(updatedPlayers);

    if (turnInfo.qIndex < questions.length - 1) {
      setTurnInfo({
        qIndex: turnInfo.qIndex + 1,
        pTurn: turnInfo.pTurn === 0 ? 1 : 0
      });
    } else {
      setScreen("end");
    }
  };

  return (
    <div className="app-main">
      {screen === "start" && <StartScreen onStart={handleStartGame} />}
      {screen === "game" && (
        <GameScreen 
          players={players} 
          question={questions[turnInfo.qIndex]} 
          turn={turnInfo.pTurn} 
          onAnswer={handleAnswer} 
        />
      )}
      {screen === "end" && <EndScreen allPlayers={players} />}
    </div>
  );
};

export default App;
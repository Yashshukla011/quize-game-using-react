import React, { useState, useEffect, useCallback } from "react";
import StartScreen from "./components/startscreen";
import GameScreen from "./components/Game";
import EndScreen from "./components/end";
import "./App.css";
import { fetchQuizData } from "./components/quizData";
import { db } from "./components/Firebase";
import { doc, updateDoc, increment, onSnapshot } from "firebase/firestore";

function App() {
  const [quizData, setQuizData] = useState([]);
  const [view, setView] = useState("start");
  const [gameId, setGameId] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [gameMode, setGameMode] = useState("local");

  // Sync States
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [yashScore, setYashScore] = useState(0);
  const [shukalScore, setShukalScore] = useState(0);
  const [isYashsTurn, setIsYashsTurn] = useState(true);

  useEffect(() => {
    if (gameId && view === "playing") {
      const unsub = onSnapshot(doc(db, "games", gameId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentQuestionIndex(data.currentQuestionIndex || 0);
          setIsYashsTurn(data.isYashsTurn ?? true);
          setYashScore(data.player1Score || 0);
          setShukalScore(data.player2Score || 0);
          if (data.status === "ended") setView("ended");
          if (!isHost) {
            setPlayer1Name(data.player1Name);
            setPlayer2Name(data.player2Name);
          }
        }
      });
      return () => unsub();
    }
  }, [gameId, view, isHost]);

  const startGame = async (p1, p2, level, id, mode, hostStatus) => {
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setGameId(id);
    setGameMode(mode);
    setIsHost(hostStatus);
    
    const data = await fetchQuizData();
    setQuizData(data);
    setView("playing");
  };

  const handleAnswer = useCallback(async (isCorrect) => {
    if (!gameId) return;
    const isGameOver = currentQuestionIndex + 1 >= quizData.length;
    const gameRef = doc(db, "games", gameId);
    
    await updateDoc(gameRef, {
      [isYashsTurn ? "player1Score" : "player2Score"]: increment(isCorrect ? 10 : 0),
      isYashsTurn: !isYashsTurn,
      currentQuestionIndex: isGameOver ? currentQuestionIndex : currentQuestionIndex + 1,
      status: isGameOver ? "ended" : "playing"
    });
  }, [gameId, isYashsTurn, currentQuestionIndex, quizData]);

  return (
    <div className="body-bg">
      <div className="main-container">
        {view === "start" && <StartScreen onStartGame={startGame} />}
        {view === "playing" && (
          <GameScreen
            gameState={{ currentQuestionIndex, isYashsTurn, yashScore, shukalScore }}
            handleAnswer={handleAnswer}
            handleTimeout={() => handleAnswer(false)}
            player1Name={player1Name}
            player2Name={player2Name}
            questions={quizData}
            isHost={isHost}
            gameMode={gameMode}
            roomId={gameId}
          />
        )}
        {view === "ended" && (
          <EndScreen player1Name={player1Name} player2Name={player2Name} yashScore={yashScore} shukalScore={shukalScore} />
        )}
      </div>
    </div>
  );
}
export default App;
"use client"
import React, { useState, useEffect, useCallback } from "react"
import StartScreen from "./components/startscreen"
import GameScreen from "./components/Game"
import EndScreen from "./components/end"
import { fetchQuizData } from "./components/quizData"
import { db } from "./components/Firebase"
import { doc, updateDoc, increment, onSnapshot } from "firebase/firestore"
import "./App.css"

function App() {
  const [quizData, setQuizData] = useState([])
  const [view, setView] = useState("start")
  const [gameId, setGameId] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [gameMode, setGameMode] = useState("local")

  const [player1Name, setPlayer1Name] = useState("")
  const [player2Name, setPlayer2Name] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [yashScore, setYashScore] = useState(0)
  const [shukalScore, setShukalScore] = useState(0)
  const [isYashsTurn, setIsYashsTurn] = useState(true)

  // 🔵 ONLINE SYNC
  useEffect(() => {
    if (gameMode === "online" && gameId && view === "playing") {
      const unsub = onSnapshot(doc(db, "games", gameId), (snap) => {
        if (!snap.exists()) return
        const d = snap.data()

        setCurrentQuestionIndex(d.currentQuestionIndex || 0)
        setIsYashsTurn(d.isYashsTurn ?? true)
        setYashScore(d.player1Score || 0)
        setShukalScore(d.player2Score || 0)

        if (d.status === "ended") setView("ended")
      })
      return () => unsub()
    }
  }, [gameMode, gameId, view])

  const startGame = async (p1, p2, level, id, mode, hostStatus) => {
    setPlayer1Name(p1)
    setPlayer2Name(p2)
    setGameMode(mode)
    setIsHost(hostStatus)
    setGameId(id)

    const data = await fetchQuizData()
    setQuizData(data)
    setView("playing")
  }

  // ✅ ANSWER HANDLER
  const handleAnswer = useCallback(
    async (isCorrect) => {
      // 🟢 LOCAL MODE
      if (gameMode === "local") {
        if (isYashsTurn && isCorrect) setYashScore((s) => s + 10)
        if (!isYashsTurn && isCorrect) setShukalScore((s) => s + 10)
        setIsYashsTurn(!isYashsTurn)
        return
      }

      // 🔵 ONLINE MODE
      const gameRef = doc(db, "games", gameId)
      await updateDoc(gameRef, {
        [isYashsTurn ? "player1Score" : "player2Score"]: increment(isCorrect ? 10 : 0),
        isYashsTurn: !isYashsTurn,
      })
    },
    [gameMode, isYashsTurn, gameId]
  )

  // ✅ NEXT QUESTION
  const handleNextQuestion = async () => {
    // 🟢 LOCAL MODE → AUTO
    if (gameMode === "local") {
      if (currentQuestionIndex + 1 >= quizData.length) {
        setView("ended")
      } else {
        setCurrentQuestionIndex((i) => i + 1)
      }
      return
    }

    // 🔵 ONLINE MODE → ADMIN ONLY
    if (!isHost) return
    const isOver = currentQuestionIndex + 1 >= quizData.length
    const gameRef = doc(db, "games", gameId)

    await updateDoc(gameRef, {
      currentQuestionIndex: increment(1),
      status: isOver ? "ended" : "playing",
    })
  }

  const allPlayers = [
    { name: player1Name, score: yashScore },
    { name: player2Name, score: shukalScore },
  ]

  return (
    <div className="body-bg">
      <div className="main-container">
        {view === "start" && <StartScreen onStartGame={startGame} />}

        {view === "playing" && (
          <GameScreen
            gameState={{ currentQuestionIndex, isYashsTurn }}
            handleAnswer={handleAnswer}
            handleTimeout={() => handleAnswer(false)}
            questions={quizData}
            isHost={isHost}
            gameMode={gameMode}
            roomId={gameId}
            allPlayers={allPlayers}
            onNextQuestion={handleNextQuestion}
          />
        )}

        {view === "ended" && <EndScreen allPlayers={allPlayers} />}
      </div>
    </div>
  )
}

export default App

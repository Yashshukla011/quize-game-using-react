"use client"

import { useState } from "react"
import GameScreen from "../components/GameScreen"
import EndScreen from "../components/EndScreen"
import StartScreen from "../components/StartScreen"
import { db } from "../components/Firebase"
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore"
import quizData from "./components/quizData"

export default function Page() {
  const [gameState, setGameState] = useState(null)
  const [currentScreen, setCurrentScreen] = useState("start")
  const [gameMode, setGameMode] = useState("online")
  const [roomId, setRoomId] = useState("")
  const [isHost, setIsHost] = useState(false)
  const [allPlayers, setAllPlayers] = useState([])

  const setupGameListener = (docId) => {
    const unsubscribe = onSnapshot(doc(db, "games", docId), (snap) => {
      if (snap.exists()) {
        const data = snap.data()

        let players = []
        if (data.players && data.players.length > 0) {
          players = data.players
        } else {
          players = [
            { name: data.player1Name || "Player 1", score: data.player1Score || 0 },
            { name: data.player2Name || "Player 2", score: data.player2Score || 0 },
          ]
        }

        setAllPlayers(players)

        setGameState({
          currentQuestionIndex: data.currentQuestionIndex || 0,
          currentPlayerIndex: data.currentPlayerIndex || 0,
          players: players,
          status: data.status || "active",
        })

        if (data.status === "finished") {
          setCurrentScreen("end")
        }
      }
    })
    return unsubscribe
  }

  const handleStartGame = (p1, p2, difficulty, docId, mode, host, playersArray) => {
    setGameMode(mode)
    setRoomId(docId)
    setIsHost(host)
    setAllPlayers(playersArray)

    setGameState({
      currentQuestionIndex: 0,
      currentPlayerIndex: 0,
      players: playersArray,
      status: "active",
    })

    const unsubscribe = setupGameListener(docId)
    setCurrentScreen("game")

    return () => unsubscribe()
  }

  const handleAnswer = async (isCorrect) => {
    if (!gameState || !roomId) return

    try {
      const gameRef = doc(db, "games", roomId)
      const snap = await getDoc(gameRef)

      if (snap.exists()) {
        const data = snap.data()
        const newQuestionIndex = data.currentQuestionIndex + 1

        const currentPlayerIdx = data.currentPlayerIndex || 0
        const totalPlayers = data.players?.length || 2
        const nextPlayerIdx = (currentPlayerIdx + 1) % totalPlayers

        const updates = {
          currentQuestionIndex: newQuestionIndex,
          currentPlayerIndex: nextPlayerIdx,
        }

        if (isCorrect && data.players && data.players.length > 0) {
          const updatedPlayers = [...data.players]
          updatedPlayers[currentPlayerIdx].score += 1
          updates.players = updatedPlayers
        } else if (isCorrect) {
          // Backward compatibility for 2-player format
          if (currentPlayerIdx === 0) {
            updates.player1Score = (data.player1Score || 0) + 1
          } else {
            updates.player2Score = (data.player2Score || 0) + 1
          }
        }

        if (newQuestionIndex >= quizData.length) {
          updates.status = "finished"
        }

        await updateDoc(gameRef, updates)
      }
    } catch (err) {
      console.error("Error updating game:", err)
    }
  }

  const handleTimeout = () => {
    handleAnswer(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {currentScreen === "start" && <StartScreen onStartGame={handleStartGame} />}

      {currentScreen === "game" && gameState && (
        <GameScreen
          gameState={gameState}
          handleAnswer={handleAnswer}
          handleTimeout={handleTimeout}
          questions={quizData}
          isHost={isHost}
          gameMode={gameMode}
          roomId={roomId}
          allPlayers={allPlayers}
        />
      )}

      {currentScreen === "end" && gameState && <EndScreen allPlayers={allPlayers} />}
    </main>
  )
}

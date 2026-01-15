"use client"
import { useState } from "react"
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../components/Firebase"

const MAX_PLAYERS = 6

const StartScreen = ({ onStartGame }) => {
  const [gameMode, setGameMode] = useState("online")
  const [roomIdInput, setRoomIdInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedId, setGeneratedId] = useState("")

  // 🔹 NEW: number of players decided by admin
  const [playerCount, setPlayerCount] = useState(1)

  // 🔹 Players array auto controlled by count
  const [players, setPlayers] = useState([{ id: 1, name: "" }])

  // 🔹 when count changes, regenerate players
  const handlePlayerCountChange = (count) => {
    const safeCount = Math.min(Math.max(1, count), MAX_PLAYERS)
    setPlayerCount(safeCount)

    const newPlayers = Array.from({ length: safeCount }, (_, i) => ({
      id: i + 1,
      name: players[i]?.name || "",
    }))

    setPlayers(newPlayers)
  }

  const updatePlayerName = (id, name) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p))
  }

  const copyRoomId = (id) => {
    navigator.clipboard.writeText(id)
    alert("Room ID Copied!")
  }

  const handleStart = async () => {
    const validPlayers = players.filter(p => p.name.trim())

    if (validPlayers.length !== playerCount) {
      alert("Please fill all player names!")
      return
    }

    try {
      setIsSubmitting(true)

      // 📴 LOCAL MODE
      if (gameMode === "local") {
        const docRef = await addDoc(collection(db, "games"), {
          players: validPlayers.map(p => ({ name: p.name, score: 0 })),
          currentQuestionIndex: 0,
          status: "active",
          mode: "local",
          createdAt: serverTimestamp(),
        })

        onStartGame(
          validPlayers[0].name,
          validPlayers[1]?.name || "Player 2",
          "Medium",
          docRef.id,
          "local",
          true,
          validPlayers
        )

      // 🌐 ONLINE MODE
      } else {
        // JOIN ROOM
        if (roomIdInput.trim()) {
          const roomRef = doc(db, "games", roomIdInput.trim())
          const snap = await getDoc(roomRef)

          if (!snap.exists()) {
            alert("Invalid Room ID")
            return
          }

          const data = snap.data()
          const updatedPlayers = [...(data.players || []), ...validPlayers.map(p => ({
            name: p.name,
            score: 0,
          }))]

          await updateDoc(roomRef, {
            players: updatedPlayers,
            status: "active",
          })

          onStartGame(
            data.players[0]?.name,
            validPlayers[0].name,
            "Medium",
            roomIdInput.trim(),
            "online",
            false,
            updatedPlayers
          )

        // CREATE ROOM (ADMIN)
        } else {
          const docRef = await addDoc(collection(db, "games"), {
            players: validPlayers.map(p => ({ name: p.name, score: 0 })),
            currentQuestionIndex: 0,
            status: "waiting",
            mode: "online",
            createdAt: serverTimestamp(),
            adminName: validPlayers[0].name,
            totalPlayers: playerCount,
          })

          setGeneratedId(docRef.id)

          onStartGame(
            validPlayers[0].name,
            validPlayers[1]?.name || "Waiting...",
            "Medium",
            docRef.id,
            "online",
            true,
            validPlayers
          )
        }
      }
    } catch (e) {
      console.error(e)
      alert("Something went wrong!")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="emerald-container">
      <h1 className="welcome-text">Quiz Battle</h1>

      {/* ROOM ID DISPLAY */}
      {generatedId && (
        <div className="copy-box">
          <p>Tap to Copy Room ID</p>
          <h2 onClick={() => copyRoomId(generatedId)}>
            {generatedId} 📋
          </h2>
        </div>
      )}

      {/* MODE */}
      <div className="mode-switcher">
        <button className={gameMode === "online" ? "active" : ""} onClick={() => setGameMode("online")}>ONLINE</button>
        <button className={gameMode === "local" ? "active" : ""} onClick={() => setGameMode("local")}>LOCAL</button>
      </div>

      {/* PLAYER COUNT (ADMIN) */}
      <div className="input-wrapper">
        <label>Total Players (1–6)</label>
        <input
          type="number"
          min="1"
          max={MAX_PLAYERS}
          value={playerCount}
          onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
          className="emerald-input"
        />
      </div>

      {/* PLAYER NAMES */}
      <div className="input-wrapper">
        {players.map((player, index) => (
          <input
            key={player.id}
            type="text"
            placeholder={`Player ${index + 1} Name`}
            value={player.name}
            onChange={(e) => updatePlayerName(player.id, e.target.value)}
            className="emerald-input"
          />
        ))}
      </div>

      {/* JOIN ROOM */}
      {gameMode === "online" && !generatedId && (
        <input
          placeholder="Paste Room ID to Join"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
          className="emerald-input"
        />
      )}

      <button onClick={handleStart} disabled={isSubmitting} className="login-btn">
        {isSubmitting ? "SYNCING..." : "START GAME"}
      </button>
    </div>
  )
}

export default StartScreen

"use client"
import { useState, useEffect, useRef } from "react"

const GameScreen = ({
  gameState,
  handleAnswer,
  handleTimeout,
  questions,
  isHost,
  gameMode,
  roomId,
  allPlayers,
  onNextQuestion,
}) => {
  const [time, setTime] = useState(15)
  const [selected, setSelected] = useState(null)
  const timerRef = useRef()

  const currentPlayerIndex = gameState.isYashsTurn ? 0 : 1
  const isMyTurn = gameMode === "local" ? true : currentPlayerIndex === 0

  const currentQuestion = questions[gameState.currentQuestionIndex]

  useEffect(() => {
    setTime(15)
    setSelected(null)

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleTimeout()

          // 🟢 LOCAL AUTO NEXT
          if (gameMode === "local") onNextQuestion()
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [gameState.currentQuestionIndex])

  const onSelect = (opt) => {
    if (selected || !isMyTurn) return
    setSelected(opt)

    const isCorrect = opt === currentQuestion.correctAnswer

    setTimeout(() => {
      handleAnswer(isCorrect)

      // 🟢 LOCAL AUTO NEXT
      if (gameMode === "local") onNextQuestion()
    }, 1200)
  }

  return (
    <div className="game-container">
      <div className="score-bar">
        {allPlayers.map((p, i) => (
          <div key={i} className={i === currentPlayerIndex ? "active" : ""}>
            {p.name}: {p.score}
          </div>
        ))}
      </div>

      {gameMode === "online" && isHost && (
        <button onClick={onNextQuestion}>Next Question</button>
      )}

      <h2>{currentQuestion.question}</h2>
      <p>Time: {time}</p>

      {currentQuestion.options.map((opt, i) => (
        <button key={i} disabled={!!selected} onClick={() => onSelect(opt)}>
          {opt}
        </button>
      ))}
    </div>
  )
}

export default GameScreen

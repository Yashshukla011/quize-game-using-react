import React, { useState, useEffect } from "react";

const quizData = [
  { question: "What is your name bro?", options: ["yash", "kuch bhi", "yashu", "your name"], correctAnswer: "yash" },
  { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correctAnswer: "Paris" },
  { question: "Which planet is known as the Red Planet?", options: ["Jupiter", "Mars", "Earth", "Venus"], correctAnswer: "Mars" },
  { question: "How many days are in a leap year?", options: ["365", "366", "364", "367"], correctAnswer: "366" },
  { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"], correctAnswer: "Da Vinci" },
];

export default function QuizGame({ player1, player2 }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const question = quizData[currentQuestionIndex];

 
  useEffect(() => {
    if (gameOver) return;

    setTimeRemaining(15);
    setDisabled(false);
    setSelectedOption("");

    const interval = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleTimeout();
        }
        return t - 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [currentQuestionIndex]);

  function handleTimeout() {
    moveToNextQuestion();
  }

  
  function handleAnswer(option) {
    if (disabled) return;
    setSelectedOption(option);
    setDisabled(true);

    const correct = question.correctAnswer;

    if (option === correct) {
      if (isPlayer1Turn) setPlayer1Score((s) => s + 1);
      else setPlayer2Score((s) => s + 1);
    }

    setTimeout(moveToNextQuestion, 600);
  }

 
  function moveToNextQuestion() {
    if (currentQuestionIndex + 1 >= quizData.length) {
      setGameOver(true);
      return;
    }

    setIsPlayer1Turn((t) => !t);
    setCurrentQuestionIndex((i) => i + 1);
  }

 
  if (gameOver) {
    let winner = "Tie!";
    if (player1Score > player2Score) winner = `${player1} 🏆 wins!`;
    else if (player2Score > player1Score) winner = `${player2} 🏆 wins!`;

    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-3xl font-bold">Game Over!</h2>
        <p className="text-2xl font-semibold">{winner}</p>

        <div className="text-lg">
          <p>{player1}: {player1Score}</p>
          <p>{player2}: {player2Score}</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 mt-4 rounded bg-gradient-to-r from-indigo-400 to-orange-400 text-white font-bold"
        >
          🔄 Play Again
        </button>
      </div>
    );
  }


  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{question.question}</h2>

      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          let style = "w-full p-4 border rounded-lg text-left font-medium";

          if (disabled) {
            if (opt === question.correctAnswer)
              style += " bg-green-200 border-green-600 text-green-800";
            else if (opt === selectedOption)
              style += " bg-red-200 border-red-600 text-red-800";
          }

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => handleAnswer(opt)}
              className={style}
            >
              {opt}
            </button>
          );
        })}
      </div>

     
      <div className="mt-4">
        <span className="font-semibold">{timeRemaining}s</span>
        <div className="h-2 bg-gray-300 mt-1">
          <div
            style={{ width: `${(timeRemaining / 15) * 100}%` }}
            className="h-2 bg-green-500"
          />
        </div>
      </div>

      <p className="mt-4 font-semibold text-indigo-700">
        Turn: {isPlayer1Turn ? player1 : player2}
      </p>

      <p>{player1} Score: {player1Score}</p>
      <p>{player2} Score: {player2Score}</p>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import StartScreen from "./components/startscreen";
import GameScreen from "./components/Game";
import EndScreen from "./components/end";
import { fetchQuizData } from "./components/quizData";
import "./App.css";

const GAME_STATE = {
  START: "start",
  PLAYING: "playing",
  ENDED: "ended",
};

function App() {
  const [quizData, setQuizData] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.START);

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [yashScore, setYashScore] = useState(0);
  const [shukalScore, setShukalScore] = useState(0);
  const [isYashsTurn, setIsYashsTurn] = useState(true);

  
  useEffect(() => {
    fetchQuizData().then((data) => {
      setQuizData(data);
    });
  }, []);

  const startGame = async (p1, p2, level) => {
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setDifficulty(level);

    setYashScore(0);
    setShukalScore(0);
    setCurrentQuestionIndex(0);
    setIsYashsTurn(true);

  
    const data = await fetchQuizData();
    setQuizData(data);

    setGameState(GAME_STATE.PLAYING);
  };

  const endQuiz = () => setGameState(GAME_STATE.ENDED);

  const moveToNextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= quizData.length) {
      endQuiz();
      return;
    }

    setIsYashsTurn((prev) => !prev);
    setCurrentQuestionIndex((prev) => prev + 1);
  }, [currentQuestionIndex, quizData.length]);

  const handleAnswer = useCallback(
    (isCorrect) => {
      if (isCorrect) {
        isYashsTurn
          ? setYashScore((s) => s + 1)
          : setShukalScore((s) => s + 1);
      }

      setTimeout(moveToNextQuestion, 1500);
    },
    [isYashsTurn, moveToNextQuestion]
  );

  const handleTimeout = useCallback(() => {
    moveToNextQuestion();
  }, [moveToNextQuestion]);

  const gameProps = {
    player1Name,
    player2Name,
    yashScore,
    shukalScore,
    quizData,
    currentQuestionIndex,
  };

  let content;

  switch (gameState) {
    case GAME_STATE.START:
      content = <StartScreen onStartGame={startGame} />;
      break;

    case GAME_STATE.PLAYING:
      if (quizData.length === 0) {
        content = <h2>Loading Questions...</h2>;
        break;
      }
      content = (
        <GameScreen
          gameState={{ currentQuestionIndex, isYashsTurn, yashScore, shukalScore }}
          handleAnswer={handleAnswer}
          handleTimeout={handleTimeout}
          player1Name={player1Name}
          player2Name={player2Name}
          questions={quizData}
        />
      );
      break;

    case GAME_STATE.ENDED:
      content = <EndScreen {...gameProps} />;
      break;

    default:
      content = <StartScreen onStartGame={startGame} />;
      break;
  }

  return (
    <div className="body-bg">
      <h3 className="header-title">ImaginXP Game Mania</h3>
      <p className="header-subtitle">CollegeDekho Quiz Battle</p>

      <div className="main-container">
        <div className="quiz-box">
          <h1 className="quiz-title">Quiz Battle</h1>
          <p className="quiz-description">Challenge your knowledge in a battle of wits!</p>

          {content}
        </div>
      </div>
    </div>
  );
}

export default App;

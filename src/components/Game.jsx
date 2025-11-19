import React, { useState, useEffect, useRef } from "react";

const TOTAL_TIME = 15;

const GameScreen = ({
  gameState,
  handleAnswer,
  handleTimeout,
  player1Name,
  player2Name,
  questions,
}) => {

  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [selectedOption, setSelectedOption] = useState(null);
  const timerRef = useRef(null);

  const { currentQuestionIndex, isYashsTurn, yashScore, shukalScore } = gameState;

 
  const questionsAvailable = Array.isArray(questions) && questions.length > 0;
  const currentQuestion = questionsAvailable ? questions[currentQuestionIndex] : null;
  const currentPlayerName = isYashsTurn ? player1Name : player2Name;
  const progressPercentage = (timeRemaining / TOTAL_TIME) * 100;

 
  useEffect(() => {

    if (!currentQuestion) return;

   
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }


    setTimeRemaining(TOTAL_TIME);
    setSelectedOption(null);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

  }, [currentQuestionIndex, currentQuestion, handleTimeout]);


  const onOptionClick = (option) => {
    if (selectedOption) return; 

    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correctAnswer;

  
    if (timerRef.current) clearInterval(timerRef.current);

    handleAnswer(isCorrect);
  };

  const getButtonClasses = (option) => {
    let classes = "option-button";
    if (!selectedOption) return classes;

    if (option === currentQuestion.correctAnswer) classes += " correct-answer";
    else if (option === selectedOption) classes += " wrong-answer";
    else classes += " disabled-option";

    return classes;
  };

  if (!questionsAvailable) {
    return <h2 style={{ color: "white", textAlign: "center" }}>Loading questions...</h2>;
  }

  if (!currentQuestion) {
 
    return <h2 style={{ color: "white", textAlign: "center" }}>Loading question...</h2>;
  }

 
  return (
    <div>
      <h2 className="question-text">{currentQuestion.question}</h2>

      <div className="options-container">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => onOptionClick(option)}
            disabled={!!selectedOption}
            className={getButtonClasses(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="timer-section">
        <div className="timer-info">
          <span className="timer-display">{timeRemaining}s</span>
          <span className="turn-indicator">{currentPlayerName}'s turn</span>
        </div>

        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="score-container">
        <div className="score-box-p1">
          <span>{player1Name}</span> Score: <span>{yashScore}</span>
        </div>
        <div className="score-box-p2">
          <span>{player2Name}</span> Score: <span>{shukalScore}</span>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;


import React, { useState, useEffect } from 'react';
import { quizData } from '../components/quize';

const TOTAL_TIME = 15;

const GameScreen = ({ gameState, handleAnswer, handleTimeout, player1Name, player2Name }) => {
  const { currentQuestionIndex, isYashsTurn, yashScore, shukalScore } = gameState;
  const currentQuestion = quizData[currentQuestionIndex];
  
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timerIntervalId, setTimerIntervalId] = useState(null);

  const currentPlayerName = isYashsTurn ? player1Name : player2Name;
  const progressPercentage = (timeRemaining / TOTAL_TIME) * 100;


  useEffect(() => {
 
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
    }
    

    setTimeRemaining(TOTAL_TIME);
    setSelectedOption(null);
    

    const id = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(id);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); 

    setTimerIntervalId(id);


    return () => clearInterval(id);
  }, [currentQuestionIndex, handleTimeout]); 

  const onOptionClick = (option) => {
    if (selectedOption) return; 

    setSelectedOption(option);
    
    const isCorrect = option === currentQuestion.correctAnswer;
    
    clearInterval(timerIntervalId);

    
    handleAnswer(isCorrect); 
  };

  const getButtonClasses = (option) => {
    let classes = 'option-button';

    if (!selectedOption) {
      return classes;
    }

    if (option === currentQuestion.correctAnswer) {
    
      classes += ' correct-answer';
    } else if (option === selectedOption) {

      classes += ' wrong-answer';
    } else {

      classes += ' disabled-option';
    }

    return classes;
  };
  
  return (
    <div>
      <h2 className="question-text">
        {currentQuestion.question}
      </h2>
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
        <div className='timer-info'>
            <span className="timer-display">
              {timeRemaining}s
            </span>
            <span className="turn-indicator">
                {currentPlayerName}'s turn
            </span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="score-container">
        <div className="score-box-p1">
          <span>{player1Name}</span> Score: 
          <span>{yashScore}</span>
        </div>
        <div className="score-box-p2">
          <span>{player2Name}</span> Score: 
          <span>{shukalScore}</span>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
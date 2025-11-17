
import React, { useState, useCallback } from 'react';
import StartScreen from './components/startscreen';
import GameScreen from './components/Game';
import EndScreen from './components/end';
import { quizData } from './components/quize';
import './App.css';



const GAME_STATE = {
  START: 'start',
  PLAYING: 'playing',
  ENDED: 'ended',
};


function App() {
  const [gameState, setGameState] = useState(GAME_STATE.START);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [difficulty, setDifficulty] = useState('Medium'); 

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [yashScore, setYashScore] = useState(0);
  const [shukalScore, setShukalScore] = useState(0);
  const [isYashsTurn, setIsYashsTurn] = useState(true);

  const startGame = (p1, p2, level) => {
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setDifficulty(level);
    setYashScore(0);
    setShukalScore(0);
    setCurrentQuestionIndex(0);
    setIsYashsTurn(true);
    setGameState(GAME_STATE.PLAYING);
  };

  const endQuiz = () => {
    setGameState(GAME_STATE.ENDED);
  };

  const moveToNextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= quizData.length) {
      endQuiz();
      return;
    }
    
    setIsYashsTurn(prev => !prev);
    setCurrentQuestionIndex(prev => prev + 1);
  }, [currentQuestionIndex]);
  
  const handleAnswer = useCallback((isCorrect) => {
    if (isCorrect) {
      if (isYashsTurn) {
        setYashScore(prev => prev + 1);
      } else {
        setShukalScore(prev => prev + 1);
      }
    }
    setTimeout(moveToNextQuestion, 1500); 
  }, [isYashsTurn, moveToNextQuestion]);
  
  const handleTimeout = useCallback(() => {
    moveToNextQuestion();
  }, [moveToNextQuestion]);

  let content;
  const gameProps = { player1Name, player2Name, yashScore, shukalScore };

  switch (gameState) {
    case GAME_STATE.START:
      content = <StartScreen onStartGame={startGame} />;
      break;
    case GAME_STATE.PLAYING:
      content = (
        <GameScreen
          gameState={{ currentQuestionIndex, isYashsTurn, yashScore, shukalScore }}
          handleAnswer={handleAnswer}
          handleTimeout={handleTimeout}
          {...gameProps}
        />
      );
      break;
    case GAME_STATE.ENDED:
      content = <EndScreen {...gameProps} />;
      break;
    default:
      content = <StartScreen onStartGame={startGame} />;
  }

  return (
    <div className="body-bg">
      <div className="login-button-container">
        
      </div>
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
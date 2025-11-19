

import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css'; 
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const quizData = [
    ];
    

    let currentQuestionIndex = 0;
    let timeRemaining = 15;

   
    const totalTime = 15;
    let timerInterval;

    let yashScore = 0;
    let shukalScore = 0;
    let isYashsTurn = true;

    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const timerDisplay = document.getElementById('timer-display');

    const progressBar = document.getElementById('progress-bar');
    const yashScoreDisplay = document.getElementById('yash-score');

    const shukalScoreDisplay = document.getElementById('shukal-score');
    const player1Input = document.getElementById('player1-input');
    const player2Input = document.getElementById('player2-input');
    const turnIndicator = document.getElementById('turn-indicator');

    const player1NameDisplay = document.getElementById('player1-name-display');
    const player2NameDisplay = document.getElementById('player2-name-display');


    function updateTurnDisplay() {
      turnIndicator.textContent = `${isYashsTurn ? player1Input.value || "Player 1" : player2Input.value || "Player 2"}'s turn`;
    }


    window.startGame = function () {
      const p1 = player1Input.value.trim();
      const p2 = player2Input.value.trim();

      if (p1 === "" || p2 === "") {
        alert(" Please enter both player names before starting!");
        return;
      }

      player1NameDisplay.textContent = p1;
      player2NameDisplay.textContent = p2;

      yashScore = 0;
      shukalScore = 0;
      currentQuestionIndex = 0;
      isYashsTurn = true;
      yashScoreDisplay.textContent = 0;
      shukalScoreDisplay.textContent = 0;

      startScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      loadQuestion();
    }

    function updateTimerDisplay() {
      timerDisplay.textContent = timeRemaining + 's';
      const progressPercentage = (timeRemaining / totalTime) * 100;
      progressBar.style.width = `${progressPercentage}%`;
    }

    function startTimer() {
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
          clearInterval(timerInterval);
          handleTimeout();
        }
      }, 500);
    }

    function handleTimeout() {
      questionText.textContent = `${isYashsTurn ? player1Input.value : player2Input.value}'s time ran out!`;
      moveToNextQuestion();
    }

    function loadQuestion() {
      if (currentQuestionIndex >= quizData.length) {
        endQuiz();
        return;
      }

      const currentQuestion = quizData[currentQuestionIndex];
      questionText.textContent = currentQuestion.question;
      optionsContainer.innerHTML = '';
      updateTurnDisplay();


      currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className =
          'w-full text-left p-4 border border-gray-300 rounded-lg text-lg font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 transition duration-150 ease-in-out';
        button.onclick = () => handleAnswer(option, currentQuestion.correctAnswer, button);
        optionsContainer.appendChild(button);
      });

      timeRemaining = totalTime;
      clearInterval(timerInterval);
      startTimer();
    }

    function handleAnswer(selectedOption, correctAnswer, button) {
      clearInterval(timerInterval);
      Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);

      if (selectedOption === correctAnswer) {
        button.classList.add('bg-green-100', 'border-green-500', 'text-green-700', 'font-bold');
        if (isYashsTurn) yashScore++;
        else shukalScore++;
      } else {
        button.classList.add('bg-red-100', 'border-red-500', 'text-red-700', 'font-bold'); 

        Array.from(optionsContainer.children).forEach(btn => {

          if (btn.textContent === correctAnswer) {
            btn.classList.add('bg-green-200', 'border-green-600', 'text-green-800');
          }
        });
      }

      yashScoreDisplay.textContent = yashScore;
      shukalScoreDisplay.textContent = shukalScore;
      setTimeout(moveToNextQuestion, 500);
      
    }

  function moveToNextQuestion() {
  isYashsTurn = !isYashsTurn;  
  currentQuestionIndex++;     
  loadQuestion();          
}


    const buttons = document.querySelectorAll(".difficulty-btn");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        
        buttons.forEach(b => {
          b.classList.remove("bg-gradient-to-r", "from-blue-500", "to-orange-500", "text-white", "shadow-md");
          b.classList.add("bg-gray-200", "text-gray-700");
        });

       
        btn.classList.remove("bg-gray-200", "text-gray-700");
        btn.classList.add("bg-gradient-to-r", "from-blue-500", "to-orange-500", "text-white", "shadow-md");

      
        const selectedLevel = btn.getAttribute("data-level");
        console.log("Selected Difficulty:", selectedLevel);
     
      });
    });
      function endQuiz() {
      clearInterval(timerInterval);

      let winnerText = "";
      const p1name = player1Input.value || "Player 1";
      const p2name = player2Input.value || "Player 2";

      if (yashScore > shukalScore) {
        winnerText = `${p1name} 🏆 wins!`;
      } else if (shukalScore > yashScore) {
        winnerText = `${p2name} 🏆 wins!`;
      } else {
        winnerText = "🤝 It's a tie!";
      }


      gameScreen.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center space-y-4">
          <h2 class="text-3xl font-bold">Game Over!</h2>
          <p class="text-2xl font-semibold">${winnerText}</p>
          <div class="text-lg">
            <p>${p1name}: ${yashScore}</p>
            <p>${p2name}: ${shukalScore}</p>
          </div>
          <div class="pt-4">
            <button onclick="location.reload()" class="px-6 py-2 rounded bg-gradient-to-r from-indigo-400 to-orange-400 text-white font-bold">🔄 Play Again</button>
          </div>
        </div>
      `;
    }

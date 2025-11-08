 const btn1 = document.getElementById('s');
  btn1.addEventListener('click', () => {
   
    setTimeout(() => {
      window.location.href = 'second.html';
    });
  });
  const quizData = [
            {
                question: "Who is the God Loki's son?",
                options: ["Hel", "Odin", "Fenrir", "Sigyn"],
                correctAnswer: "Fenrir"
            },
            {
                question: "What is the capital of France?",
                options: ["Berlin", "Madrid", "Paris", "Rome"],
                correctAnswer: "Paris"
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Jupiter", "Mars", "Earth", "Venus"],
                correctAnswer: "Mars"
            },
            {
                question: "How many days are in a leap year?",
                options: ["365", "366", "364", "367"],
                correctAnswer: "366"
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
                correctAnswer: "Da Vinci"
            }
        ];
        let currentQuestionIndex = 0;
        let timeRemaining = 15;
        const totalTime = 15; 

       
        const questionText = document.getElementById('question-text');

        const optionsContainer = document.getElementById('options-container');
        const timerDisplay = document.getElementById('timer-display');
        const progressBar = document.getElementById('progress-bar');
        const qNumber = document.getElementById('q-number');
        const yashScoreDisplay = document.getElementById('yash-score');
        const shukalScoreDisplay = document.getElementById('shukal-score');
        let yashScore = 0;
        let shukalScore = 0;
        let isYashsTurn = true; 


        function loadQuestion() {
            if (currentQuestionIndex >= quizData.length) {
                endQuiz();
                return;
            }

            const currentQuestion = quizData[currentQuestionIndex];
            
            
            questionText.textContent = currentQuestion.question;
            qNumber.textContent = currentQuestionIndex + 1;
            document.getElementById('turn-indicator').textContent = isYashsTurn ? "yash's turn" : "shukal's turn";

           
            optionsContainer.innerHTML = '';

  
            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.className = 'w-full text-left p-4 border border-gray-300 rounded-lg text-lg font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 transition duration-150 ease-in-out';
                button.onclick = () => handleAnswer(option, currentQuestion.correctAnswer, button);
                optionsContainer.appendChild(button);
            });

            timeRemaining = totalTime;
            clearInterval(timerInterval);
            startTimer();
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
            }, 1000);
        }

       
        function updateTimerDisplay() {
            timerDisplay.textContent = timeRemaining + 's';
            
            const progressPercentage = (timeRemaining / totalTime) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }

       
        function handleTimeout() {
            alert(`Time's up! The correct answer was: ${quizData[currentQuestionIndex].correctAnswer}`);
            moveToNextQuestion();
        }

     
        function handleAnswer(selectedOption, correctAnswer, button) {
            clearInterval(timerInterval); 

          
            Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);

            if (selectedOption === correctAnswer) {
              
                button.classList.remove('hover:bg-indigo-50', 'hover:border-indigo-400', 'border-gray-300', 'text-gray-700');
                button.classList.add('bg-green-100', 'border-green-500', 'text-green-700', 'font-bold');
                
               
                if (isYashsTurn) {
                    yashScore++;
                    yashScoreDisplay.textContent = yashScore;
                } else {
                    shukalScore++;
                    shukalScoreDisplay.textContent = shukalScore;
                }

            } else {
                
                button.classList.remove('hover:bg-indigo-50', 'hover:border-indigo-400', 'border-gray-300', 'text-gray-700');
                button.classList.add('bg-red-100', 'border-red-500', 'text-red-700', 'font-bold');

                
                Array.from(optionsContainer.children).forEach(btn => {
                    if (btn.textContent === correctAnswer) {
                        btn.classList.add('bg-green-200', 'border-green-600', 'text-green-800');
                    }
                });
            }

            setTimeout(moveToNextQuestion, 2000); 
        }

       
        function moveToNextQuestion() {
            
            isYashsTurn = !isYashsTurn;
            
          
            if (isYashsTurn) {
                 currentQuestionIndex++;
            }

            loadQuestion();
        }

        function endQuiz() {
            clearInterval(timerInterval);
            optionsContainer.innerHTML = '';
            let winner = '';
            if (yashScore > shukalScore) {
                winner = 'Yash';
            } else if (shukalScore > yashScore) {
                winner = 'Shukal';
            } else {
                winner = 'It\'s a Tie';
            }
            questionText.textContent = `Quiz Finished! ${winner} wins! Final Score: Yash ${yashScore}, Shukal ${shukalScore}`;
        }

        loadQuestion();
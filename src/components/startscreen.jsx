
import React, { useState } from 'react';


const StartScreen = ({ onStartGame }) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [difficulty, setDifficulty] = useState('Medium'); 
  const [active, setActive] = useState(null);
const handleClick = (id, level) => {
  setActive(id);
  setDifficulty(level);
};


  const handleStart = () => {
    const p1 = player1Name.trim();
    const p2 = player2Name.trim();

    if (p1 === "" || p2 === "") {
      alert("Please enter both player names before starting!");
      return;
    }

    onStartGame(p1, p2, difficulty);
  };

  return (
    <div className="start-screen-content">
      <div className='input-group'>
        <label className="input-label">Player 1 Name</label>
        <input
          type="text"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
          placeholder="Enter Player 1 Name"
          className="input-field input-field-p1"
        />
      </div>

      <div className='input-group'>
        <label className="input-label">Player 2 Name</label>
        <input
          type="text"
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
          placeholder="Enter Player 2 Name"
          className="input-field input-field-p2"
        />
      </div>
<div>
  <button  id='t'
    onClick={() => handleClick(1, "Easy")}
    className={active === 1 ? "active-btn" : ""}
  >
    Easy
  </button>

  <button id='t'
    onClick={() => handleClick(2, "Medium")}
    className={active === 2 ? "active-btn" : ""}
  >
    Medium
  </button>

  <button id='t'
    onClick={() => handleClick(3, "Hard")}
    className={active === 3 ? "active-btn" : ""
      
    }
  >
    Hard
  </button>
</div>
      <button
        type="button"
        onClick={handleStart}
        className="start-button"
      >
        Start Battle
      </button>
    </div>
  );
};

export default StartScreen;
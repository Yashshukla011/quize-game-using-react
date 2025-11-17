
import React, { useState, useCallback, useRef } from 'react';
import './MovingButton.css'; 

const MovingButton = () => {
  
    const [positionStyle, setPositionStyle] = useState({
       
        top: '50%',
        left: '50%',
        
        transform: 'translate(-50%, -50%)', 
    });

    const buttonRef = useRef(null);

    const moveButtonRandomly = useCallback(() => {
        if (!buttonRef.current) return;

        
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;

     
        const newX = Math.random() * (screenWidth - buttonWidth);
        const newY = Math.random() * (screenHeight - buttonHeight);

       
        setPositionStyle({
            left: `${newX}px`,
            top: `${newY}px`,
          
            transform: 'none', 
        });
    }, []);

    return (
        <button
            id="moveButton"
            ref={buttonRef} 
            onClick={moveButtonRandomly}
            style={positionStyle} 
        >
            Click Me to Move! 🔄
        </button>
    );
};

export default MovingButton;
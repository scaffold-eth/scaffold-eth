import './Timer.css';
import React, { useState, useEffect, useCallback } from 'react';
import { Button, SHAPE } from "baseui/Button";

// 10 min timer
function Timer({onIsOnlineChange, onIsRiderFoundChange}) {
  const [seconds, setSeconds] = useState(600);


  // Button click state handlers. Callback to parent
  const handleSetOfline = useCallback( () => {
    onIsOnlineChange(false)
  }, [onIsOnlineChange])

  const handleRiderFound = useCallback( () => {
    onIsRiderFoundChange(true)
  }, [onIsRiderFoundChange])

  // Timer control
  useEffect(() => {
    let interval = null;
    if (seconds > 0) {
      // Count down until 0 seconds
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else {
      // When time runs out, set offline
      handleSetOfline();
    }
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <div className="flex-container">
      <div className="time">
        {Math.floor(seconds/60)}:{String(seconds%60).padStart(2, "0")}s
        <br/>
        Searching for rider...
      </div>
        
      <Button className="offline-button"
        overrides={{BaseButton: {style: {width: '30%', marginRight: '5%'}}}}
        shape={SHAPE.pill}
        onClick={handleSetOfline} >
        Go Offline
      </Button>

      {/* TODO: Temp button for state change to rider found */}
      <Button className="offline-button"
        overrides={{BaseButton: {style: {width: '30%'}}}}
        shape={SHAPE.pill}
        onClick={handleRiderFound} >
        Rider Found
      </Button>

    </div>
  );
};

export default Timer;
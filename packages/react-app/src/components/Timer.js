import './Timer.css';
import React, { useState, useEffect, useCallback } from 'react';
import { Button, SHAPE } from "baseui/Button";

// 10 min timer
function Timer({onIsOnlineChange, onIsRiderFoundChange, RidesEvents, address}) {
  const [seconds, setSeconds] = useState(600);
  var listening = false;


  // Button click state handlers. Callback to parent
  const handleSetOffline = useCallback( () => {
    onIsOnlineChange(false)
  }, [onIsOnlineChange])

  // TODO: Confirm this
  const handleRiderFound = useCallback( (event) => {
    if (event.value.driver == address) {
      onIsRiderFoundChange(event.value)
    }
    else {
      onIsRiderFoundChange(null)
    }
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
      handleSetOffline();
    }

    // Add event Listener (only do this once)
    if (!listening) {
      window.addEventListener(RidesEvents, handleRiderFound);
      listening = true;
    }
    
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
        onClick={handleSetOffline} >
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
import React, { useCallback } from 'react';

import { Button, SHAPE } from "baseui/button";
import { Input } from "baseui/input";

// Select Destination Step
function SelectDest({onDestinationChange, onDestinationConfirm}) {

  // Button Click
  const handleConfirmDestination = useCallback( () => {
    onDestinationConfirm(true)
  }, [onDestinationConfirm])

  // Typing
  const handleDestinationChange = useCallback( (event) => {
    onDestinationChange(event.target.value)
  }, [onDestinationChange])

  return (
    <div>
      <Input
        onChange={handleDestinationChange}
        placeholder="Where would you like to go?"
      /> 

      <br/>

     {/* Submit button */}
      <Button 
        overrides={{BaseButton: {style: {width: '100%'}}}}
        shape={SHAPE.pill}
        onClick={handleConfirmDestination} >
        Set Destination
      </Button>
    </div>
  );
};

export default SelectDest;
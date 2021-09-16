import React, { useCallback } from 'react';

import { Button, SHAPE } from "baseui/button";
import { Input } from "baseui/input";

// Select PickUp Step
function SelectPickUp({onPickUpChange, onPickUpConfirm}) {

  // Button Click
  const handleConfirmPickUp = useCallback( () => {
    onPickUpConfirm(true)
  }, [onPickUpConfirm])

  // Typing
  const handlePickUpChange = useCallback( (event) => {
    onPickUpChange(event.target.value)
  }, [onPickUpChange])

  return (
    <div>
      <Input
        onChange={handlePickUpChange}
        placeholder="Where are you coming from?"
      /> 

      <br/>

     {/* Submit button */}
      <Button 
        overrides={{BaseButton: {style: {width: '100%'}}}}
        shape={SHAPE.pill}
        onClick={handleConfirmPickUp} >
        Set Pick Up
      </Button>
    </div>
  );
};

export default SelectPickUp;
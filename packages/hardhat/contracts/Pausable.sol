pragma solidity 0.8.0;
import "./Ownable.sol";

// SPDX-License-Identifier: UNLICENSED

contract Pausable is Ownable{
    
    event PauseEvent(string msg);

    bool paused;

    modifier Unpaused(){
        require(paused == false,'Method is paused.');
        _;
    }

    modifier Paused(){
        require(paused == true,'Method is unpaused.');
        _;
    }
    
    constructor () {
        paused = false;
    }

    function Pause() public onlyOwner {
        paused = true;
        emit PauseEvent('Paused.');
    }

    function Unpause() public onlyOwner {
        paused = false;
        emit PauseEvent('Unpaused.');
    }

    function isPaused() public view returns (bool) {
        return paused;
    }
}
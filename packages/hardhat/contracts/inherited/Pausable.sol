pragma solidity 0.8.0;
import "./Ownable.sol";

// SPDX-License-Identifier: UNLICENSED

contract Pausable is Ownable{
    
    event PauseEvent(string msg);

    modifier Unpaused(){
        require(_bool['paused'] == false,'Method is paused.');
        _;
    }

    modifier Paused(){
        require(_bool['paused'] == true,'Method is unpaused.');
        _;
    }
    
    constructor () {
        _bool['paused'] = false;
    }

    function Pause() public onlyOwner {
        _bool['paused'] = true;
        emit PauseEvent('Paused.');
    }

    function Unpause() public onlyOwner {
        _bool['paused'] = false;
        emit PauseEvent('Unpaused.');
    }

    function isPaused() public view returns (bool) {
        return _bool['paused'];
    }
}
pragma solidity 0.8.0;
import "./Ownable.sol";

// SPDX-License-Identifier: UNLICENSED

contract Pausable is Ownable{

    event PauseEvent(string msg);

    modifier Unpaused(){
        require(_bool['paused'] == false,
        'Method is not callable while contract is paused.');
        _;
    }

    modifier Paused(){
        require(_bool['paused'] == true,
        'Method is only callable while contract is paused.');
        _;
    }

    constructor () {
        _bool['paused'] = false;
    }

    function Pause() public onlyOwner Unpaused {
        _bool['paused'] = true;
        emit PauseEvent('Paused.');
    }

    function Unpause() public onlyOwner Paused {
        _bool['paused'] = false;
        emit PauseEvent('Unpaused.');
    }

    function isPaused() public view returns (bool) {
        return _bool['paused'];
     }
}

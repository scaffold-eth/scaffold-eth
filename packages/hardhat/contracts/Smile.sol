pragma solidity ^0.6.12;

import "./ContinuousToken.sol";


contract Smile is ContinuousToken {
    uint256 internal reserve;
  
    constructor() public payable ContinuousToken("Smile", "😃", 100 ether, 200000) {
        reserve = msg.value; 
    }

    fallback() external payable { mint(); }

    receive() external payable {}

    function mint() public payable {
        uint purchaseAmount = msg.value;
        _continuousMint(purchaseAmount);
        reserve = reserve.add(purchaseAmount);
    }

    function burn(uint _amount) public {
        uint refundAmount = _continuousBurn(_amount);
        reserve = reserve.sub(refundAmount);
        msg.sender.transfer(refundAmount);
    }

    function reserveBalance() override public view returns (uint) {
        return reserve;
    }    
}
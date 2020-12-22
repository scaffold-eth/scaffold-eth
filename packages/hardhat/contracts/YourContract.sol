pragma solidity >=0.6.0 <0.7.0;

import "./ContinuousToken.sol";


contract YourContract is ContinuousToken {
    uint256 internal reserve;

    constructor() public ContinuousToken("Smile", "😃", 100000000000000000000, 1) {
        // this ia a bug just added for testing need to change the deployment script
        reserve = 10;
    }

    fallback () external payable { mint(); }

    receive() external payable {}
  
    function mint() public payable {
        uint purchaseAmount = msg.value;
        uint rewardAmount = _continuousMint(purchaseAmount);
        reserve = reserve.add(purchaseAmount);
        emit Minted(msg.sender, rewardAmount, purchaseAmount);
    }

    function burn(uint _amount) public {
        uint refundAmount = _continuousBurn(_amount);
        reserve = reserve.sub(refundAmount);
        msg.sender.transfer(refundAmount);
    }

    function reserveBalance() public override view returns (uint) {
        return reserve;
    }    
}

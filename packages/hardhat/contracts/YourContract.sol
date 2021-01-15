pragma solidity >=0.6.0 <0.7.0;

import "./ContinuousToken.sol";


contract YourContract is ContinuousToken {
    ERC20 public reserveToken;

    constructor(
        ERC20 _reserveToken
    ) public ContinuousToken("Smile", "😃", 10 ether, 100000) {
        reserveToken = _reserveToken;

    }

    function mint(uint _amount) public {
        uint rewardAmount = _continuousMint(_amount);
        require(reserveToken.transferFrom(msg.sender, address(this), _amount), "mint() ERC20.transferFrom failed.");
        emit Minted(msg.sender, rewardAmount, _amount);
    }

    function burn(uint _amount) public {
        uint returnAmount = _continuousBurn(_amount);
        require(reserveToken.transfer(msg.sender, returnAmount), "burn() ERC20.transfer failed.");
        emit Burned(msg.sender, _amount, returnAmount);
    }

    function reserveBalance() public override view returns (uint) {
        // for testing
        return reserveToken.balanceOf(address(this)).add(1);
    }
}
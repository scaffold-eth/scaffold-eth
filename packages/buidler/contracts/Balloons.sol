pragma solidity ^0.6.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Balloons is ERC20 {
  constructor() ERC20("Balloons","🎈") public {
      _mint(msg.sender,1000*10**18);
  }
}

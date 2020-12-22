pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";


contract ValidGasPrice is Ownable {
    uint256 public maxGasPrice = 1 * 10**18;

    modifier validGasPrice() {
        require(tx.gasprice <= maxGasPrice, "Gas price must be <= maximum gas price to prevent front running attacks.");
        _;
    }

    function setMaxGasPrice(uint256 newPrice) public onlyOwner {
        maxGasPrice = newPrice;
    }
}
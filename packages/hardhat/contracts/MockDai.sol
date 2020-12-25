pragma solidity >=0.6.0 <0.7.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockDai is ERC20 {
    constructor() public ERC20("Dai", "DAI") {
        _mint(
            address(0x5608d061b8e79F17F8Aac0631E0E38fBC64FE1e8),
            1000000000000000000000000000000000000000000000
        );
    }
}
pragma solidity >=0.6.0 <0.7.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() public ERC20("Mock", "MOCK") {
        // for testing arbitrium token bridging
        _mint(
            address(0x174C4d0f2bc42901B02ebC3609005F41E86f8e41),
            1000000000000000000000000000000000000000000000
        );
    }
}
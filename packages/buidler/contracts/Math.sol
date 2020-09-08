pragma solidity >=0.6.6 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

library Math {
    function sqrt(uint256 x) internal pure returns (uint256) {
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}

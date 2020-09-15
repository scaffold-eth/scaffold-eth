pragma solidity >=0.6.6 <0.7.0;

interface IDonorManager {
    function canDonate() external view returns (bool);
}

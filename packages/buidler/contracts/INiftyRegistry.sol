pragma solidity >=0.6.0 <0.7.0;

interface INiftyRegistry {
    function inkAddress() external view returns (address);
    function tokenAddress() external view returns (address);
    function bridgeMediatorAddress() external view returns (address);
    function trustedForwarder() external view returns (address);
}

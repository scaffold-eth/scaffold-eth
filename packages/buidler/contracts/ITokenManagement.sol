pragma solidity >=0.6.0 <0.7.0;

interface ITokenManagement {

  function mint(address to, uint256 tokenId, string calldata inkUrl, string calldata jsonUrl) external returns (uint256);
  function fixFailedMessage(bytes32 _dataHash) external;

}

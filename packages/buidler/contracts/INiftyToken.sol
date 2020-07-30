pragma solidity >=0.6.0 <0.7.0;

interface INiftyToken {
    function inkTokenCount(string calldata) external view returns (uint256);
    function firstMint(address, string calldata, string calldata) external returns (uint256);
    function mint(address, string calldata) external returns (uint256);
    function buyInk(string calldata) external payable returns (uint256);
    function buyToken(uint256) external payable;
    function lock(uint256) external;
    function unlock(uint256, address) external;
    function ownerOf(uint256) external view returns (address);
    function tokenInk(uint) external view returns (string memory);
}

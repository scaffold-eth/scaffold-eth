pragma solidity >=0.6.0 <0.7.0;

interface INiftyInk {
    function artistTake() external view returns (uint);
    function inkInfoById(uint256) external view returns (uint256, address payable, string memory, bytes memory, uint256, uint256, string memory);
    function inkInfoByInkUrl(string calldata) external view returns (uint256, address payable, string memory, bytes memory, uint256, uint256, string memory);
    function inkIdByInkUrl(string calldata) external view returns (uint256);
}

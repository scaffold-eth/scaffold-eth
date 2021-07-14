pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

interface ERC721TokenReceiver {
    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes memory _data) external returns(bytes4);
}
interface ERC165 {
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}
contract ShouldntHoldNFT is ERC721TokenReceiver, ERC165{
    uint num = 69;
    function readNum() public view returns (uint) {
        return num;
    }

    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes memory _data) external override returns(bytes4) {
    }

    function supportsInterface(bytes4 interfaceID) external override view returns (bool) {
       return interfaceID == 0x80ac58cd ||
              interfaceID == 0x01ffc9a7;
    }
}

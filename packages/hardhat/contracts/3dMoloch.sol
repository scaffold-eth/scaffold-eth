pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

/*
 _      ____  _     ____  ____  _       ____  ____  _____  ____ 
/ \__/|/  _ \/ \   /  _ \/   _\/ \ /|  /  __\/  _ \/__ __\/ ___\
| |\/||| / \|| |   | / \||  /  | |_||  | | //| / \|  / \  |    \
| |  ||| \_/|| |_/\| \_/||  \__| | ||  | |_\\| \_/|  | |  \___ |
\_/  \|\____/\____/\____/\____/\_/ \|  \____/\____/  \_/  \____/
Collaboration Project for greatestlarp.com
Art by @mettahead inspired by @lahcen_kha
Audo by @AnnimusEdie
Contract by @Blind_nabler
Built with scaffold-eth!
*/

contract ConditionalMolochBot is ERC721  {

  address public constant ogNFT = 0x42dCbA5dA33CDDB8202CC182A443a3e7b299dADb;
  mapping(uint256 => bool) hasMinted;

  constructor() public ERC721("3dMoloch", "3dMOLC") {
  }

  function claim(uint256 _tokenId) public returns (uint256) {
      require(IERC721(ogNFT).ownerOf(_tokenId) == msg.sender, 'msg.sender not owner of this NFT');
      require(IERC721(ogNFT).ownerOf(_tokenId) != address(0), 'invalid tokenId');
      require(hasMinted[_tokenId] == false, 'nft already minted for this id!');
      hasMinted[_tokenId] = true;
      _mint(msg.sender, _tokenId);
  }

  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
          if (_i == 0) {
              return "0";
          }
          uint j = _i;
          uint len;
          while (j != 0) {
              len++;
              j /= 10;
          }
          bytes memory bstr = new bytes(len);
          uint k = len;
          while (_i != 0) {
              k = k-1;
              uint8 temp = (48 + uint8(_i - _i / 10 * 10));
              bytes1 b1 = bytes1(temp);
              bstr[k] = b1;
              _i /= 10;
          }
          return string(bstr);
      }


  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        string memory URI = _baseURI();
        return string(abi.encodePacked(URI,'/',uint2str(_tokenId),'.json'));
}

}

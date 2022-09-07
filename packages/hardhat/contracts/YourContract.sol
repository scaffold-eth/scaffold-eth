pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract YourContract is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
  using Counters for Counters.Counter;

      Counters.Counter private _tokenIdCounter;

      constructor() ERC721("KittyLicks", "PRRRR") {}

      function _baseURI() internal pure override returns (string memory) {
          return "https://ipfs.io/ipfs/";
      }

      uint256 public price = 0.05 ether;

      function mintItem() public payable returns (uint256) {
          require( msg.value >= price, "NOT ENOUGH!");

          price = price * 105 / 100;

          _tokenIdCounter.increment();
          uint256 tokenId = _tokenIdCounter.current();
          _safeMint(msg.sender, tokenId);
          //_setTokenURI(tokenId, uri);
          return tokenId;
      }

      function currentReward() public view returns (uint256) {
         if(totalSupply()<=0) return 0;
         return address(this).balance / totalSupply();
      }

      function burnItem() public {
        uint256 balance = balanceOf(msg.sender);
        require(balance>0,"YOU DONT HAVE ANY KITTIES");
        uint256 tokenId = tokenOfOwnerByIndex(msg.sender, balance-1);

        uint256 reward = currentReward();

        _burn(tokenId);

        (bool sent, ) = msg.sender.call{value: reward }("");
        require(sent, "Failed to send Ether");
      }



      event Withdraw( address indexed to, uint256 amount, string reason );

      address payable public toAddress = payable(0x7Ba8E1EC22617eCC19EDdA02356AFb145F7DcFCa);
      uint256 public cap = 0.1 ether;
      uint256 public frequency = 300 seconds;
      uint256 public last = (block.timestamp - frequency); // STARTS FULL

      function streamBalance() public view returns (uint256){
        if(block.timestamp-last > frequency){
          return cap;
        }
        return (cap * (block.timestamp-last)) / frequency;
      }

      function streamWithdraw(uint256 amount, string memory reason) public {
         require(msg.sender==toAddress,"this stream is not for you");
         uint256 totalAmountCanWithdraw = streamBalance();
         require(totalAmountCanWithdraw>=amount,"not enough in the stream");
         uint256 cappedLast = block.timestamp-frequency;
         if(last<cappedLast){
           last = cappedLast;
         }
         last = last + ((block.timestamp - last) * amount / totalAmountCanWithdraw);
         emit Withdraw( msg.sender, amount, reason );
         (bool sent, ) = toAddress.call{value: amount }("");
         require(sent, "Failed to send Ether");
      }

      // The following functions are overrides required by Solidity.

      function _beforeTokenTransfer(
          address from,
          address to,
          uint256 tokenId
      ) internal override(ERC721, ERC721Enumerable) {
          super._beforeTokenTransfer(from, to, tokenId);
      }

      function _burn(uint256 tokenId)
          internal
          override(ERC721, ERC721URIStorage)
      {
          super._burn(tokenId);
      }

      function tokenURI(uint256 tokenId)
          public
          pure
          override(ERC721, ERC721URIStorage)
          returns (string memory)
      {
          return "QmcQeF8wMtz3HJpwu6k8X4WeaKEwzVw4GrzR22HopJwT6u";
      }

      function supportsInterface(bytes4 interfaceId)
          public
          view
          override(ERC721, ERC721Enumerable)
          returns (bool)
      {
          return super.supportsInterface(interfaceId);
      }
}

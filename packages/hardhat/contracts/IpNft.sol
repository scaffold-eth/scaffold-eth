pragma solidity >=0.6.0 <0.8.4;
//SPDX-License-Identifier: MIT

/// @title NFT contract for licensening IP
/// @author elocremarc

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IpNft is ERC721, Ownable {

  address licensor = owner();
  uint256 licenseCost = 10000000000000000;
  string [] IP;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor(string memory IpName, string memory IpSymbol, string memory IpURI )
  

    }
    public ERC721(IpName, IpSymbol) {
    IP.push(IpURI);


  }
  //@dev Override base uri
  function _baseURI() internal pure override returns (string memory) {
        return "ifps://";

  ///@dev Mint Licensee a License
  function licenseIP()
      public payable
      returns (uint256)
  {
      require(msg.value == licenseCost);
      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);
      _setTokenURI(id, 
      IP[0]);

      return id;
  }
    /**
     * @dev Change the licensor and owner of the contract
     * @param newLicensor address of the new licensor 
     **/
  function changeLicensor(address newLicensor) public onlyOwner {
      transferOwnership(newLicensor);
  }
  /**  
    * @dev Change cost of License
    * @param newLicenseCost New price for license
  **/
  function changeLicenseCost(uint256 newLicenseCost) public onlyOwner returns (uint256) {
      licenseCost = newLicenseCost;
      return licenseCost;
  }
}

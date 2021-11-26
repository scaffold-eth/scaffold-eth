pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract YourContract is Ownable {
    uint256 mappingId;
    // mapping of Deed ID to equity holders to equity shares
    mapping(uint256 => mapping(address => uint256)) equityMap;
    address deedOwner;
    
    // address of rent payment contract
    address rentPaymentContract;
    
    constructor() {
      mappingId = 0;
      // TODO Replace with contract facilitating rent payment
      rentPaymentContract = 0x7c13f6F69D64119FfDEDcB04fFF559362942103c;

      // TODO add functions to set deed NFT token address
      // TODO add function to set rent payment contract address
    }

    function showEquity(address _addr, uint256 _deedId) public view returns (uint256) {
      return equityMap[_deedId][_addr];
    }

    function mintEquity(uint256 _deedId, uint256 _mortgageTermYears) public {
      // require that the user holds the erc721 deed token with token id = _deedId
      // check out OwnerOf or isOwnerOf from erc721 contract 
      deedOwner = msg.sender;
      equityMap[_deedId][msg.sender] = _mortgageTermYears * 20;
    }

    function rewardRenter(uint256 _deedId, address _addr) public {
      if (msg.sender == rentPaymentContract) {
        require(equityMap[_deedId][deedOwner] >= 1);
        equityMap[_deedId][deedOwner] -= 1;
        equityMap[_deedId][_addr] += 1;
      }
    }
  
    function allocateEquity(uint256 _deedId, address _addr, uint256 _equityAmount) public {
      // require that the user holds the erc721 deed token with token id = _deedId
      require(equityMap[_deedId][msg.sender] >= _equityAmount);
      equityMap[_deedId][msg.sender] -= _equityAmount;
      equityMap[_deedId][_addr] += _equityAmount;

    }

    function buyoutEquityHolders(uint256 _deedId) public {
      require(msg.sender == deedOwner);
      // can't buy out people during the vesting period -> will need to check
      // the block number? 5 10 or 15 years from now
      // send payment to others in PseudoStableCoin
      //delete equityMap[_deedId][##### EACH HOLDER #####]; // TODO
    }
}
pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT
import "./Interfaces.sol";

contract YourContract is ERC165, ERC721 {

//Points toward the NFT contract to coniditionally mint from
address public ogNFT;
mapping (uint => address) public owner;
mapping (address => mapping(address => bool)) public operatorList;
mapping (uint => address) public approved; 
mapping (address => uint) public balances;
mapping (uint => bool) hasMinted;
/*
constructor(address _ogNFT) {
  ogNFT = _ogNFT;
}
*/

function hasMintedNFT(uint _tokenId) public view returns(bool){
  return hasMinted[_tokenId];
}

function mintNFT(uint _tokenId) public {
require(ERC721(ogNFT).ownerOf(_tokenId) == msg.sender, "Msg.sender not owner of NFT!");
require(ERC721(ogNFT).ownerOf(_tokenId) != address(0), "Invalid tokenId");
require(hasMinted[_tokenId] == false, "NFT already minted for this ID!");
emit Transfer(address(0), msg.sender, _tokenId);
owner[_tokenId] = msg.sender;
balances[msg.sender]++;
hasMinted[_tokenId] = true;
}

function tokenURI(uint _tokenId) public pure returns(string memory) {
return string(abi.encodePacked("https://samplehostingservice/ConditonalNFT/"));
}
function isContract(address addr) public view returns(bool) {
uint size;
assembly { size := extcodesize(addr) }
return size > 0;
}

function balanceOf(address _owner) external override view returns (uint256) {
  return balances[_owner];
}

function ownerOf(uint256 _tokenId) external override view returns (address) {
  return owner[_tokenId];
}

function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data) external override payable {
require(msg.sender == owner[_tokenId] || approved[_tokenId] == msg.sender || operatorList[owner[_tokenId]][msg.sender] ==  true, "Msg.sender not allowed to transfer this NFT!");
require(_from == owner[_tokenId] && _from != address(0));
if(isContract(_to)) {
  if(ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, data) == 0x150b7a02) {
    emit Transfer(_from, _to, _tokenId);
    balances[_from]--;
    balances[_to]++;
    approved[_tokenId] = address(0);
    owner[_tokenId] = _to;
  } else {
    revert("receiving address unable to hold ERC721!");
  }
} else {
    emit Transfer(_from, _to, _tokenId);
    balances[_from]--;
    balances[_to]++;
    approved[_tokenId] = address(0);
    owner[_tokenId] = _to;
}
}

function safeTransferFrom(address _from, address _to, uint256 _tokenId) external override payable {
require(msg.sender == owner[_tokenId] || approved[_tokenId] == msg.sender || operatorList[owner[_tokenId]][msg.sender] ==  true, "Msg.sender not allowed to transfer this NFT!");
require(_from == owner[_tokenId] && _from != address(0));
if(isContract(_to)) {
  if(ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, "") == 0x150b7a02) {
    emit Transfer(_from, _to, _tokenId);
    balances[_from]--;
    balances[_to]++;
    approved[_tokenId] = address(0);
    owner[_tokenId] = _to;
  } else {
    revert("receiving address unable to hold ERC721!");
  }
} else {
    emit Transfer(_from, _to, _tokenId);
    balances[_from]--;
    balances[_to]++;
    approved[_tokenId] = address(0);
    owner[_tokenId] = _to;
}
}

function transferFrom(address _from, address _to, uint256 _tokenId) external override payable {
require(msg.sender == owner[_tokenId] || approved[_tokenId] == msg.sender || operatorList[owner[_tokenId]][msg.sender] ==  true, "Msg.sender not allowed to transfer this NFT!");
require(_from == owner[_tokenId] && _from != address(0));
emit Transfer(_from, _to, _tokenId);
balances[_from]--;
balances[_to]++;
approved[_tokenId] = address(0);
owner[_tokenId] = _to;
}

function approve(address _approved, uint256 _tokenId) external override payable {
require(msg.sender == owner[_tokenId] || approved[_tokenId] == msg.sender || operatorList[owner[_tokenId]][msg.sender] ==  true, "Msg.sender not allowed to approve this NFT!");
emit Approval(owner[_tokenId], _approved, _tokenId);
approved[_tokenId] = _approved;
}

function setApprovalForAll(address _operator, bool _approved) external override {
emit ApprovalForAll(msg.sender, _operator, _approved);
operatorList[msg.sender][_operator] = _approved;
}

function getApproved(uint256 _tokenId) external override view returns (address) {
  return approved[_tokenId];
}

function isApprovedForAll(address _owner, address _operator) external override view returns (bool) {
return operatorList[_owner][_operator];
}

function supportsInterface(bytes4 interfaceID) external override pure returns (bool) {
return interfaceID == 0x80ac58cd ||
       interfaceID == 0x01ffc9a7;
}

}

pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "./SignatureChecker.sol";

contract Liker is Ownable, BaseRelayRecipient, SignatureChecker {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;
  using EnumerableSet for EnumerableSet.UintSet;
  using SafeMath for uint256;

  Counters.Counter public totalLikes;

  event liked(uint256 LikeId, address targetContract, uint256 target, uint256 targetId, address liker, string fileUrl);
  event contractAdded(address targetContract, address contractOwner);
  event contractRemoved(address targetContract, address contractOwner);

  struct Like {
    uint256 id;
    address liker;
    string fileUrl;
    uint256 targetId;
    address contractAddress;
    uint256 target;
    bool exists;
  }

  EnumerableSet.UintSet private likeIds;
  mapping(address => bool) public registeredContracts;
  mapping(address => address) public contractOwner;
  mapping(uint256 => Like) private likeById;
  mapping(address => EnumerableSet.UintSet) private addressLikes;
  mapping(uint256 => EnumerableSet.UintSet) private targetLikes;
  mapping(address => EnumerableSet.UintSet) private contractLikes;

  function getTargetId(address contractAddress, uint256 target) public view returns (uint256) {
    return uint256(keccak256(
        abi.encodePacked(
            byte(0x19),
            byte(0),
            address(this),
            contractAddress,
            target
    )));
  }

  function _newLike(address contractAddress, uint256 target, address liker, string memory _fileUrl) internal returns (uint256) {
    require(registeredContracts[contractAddress],"this contract is not registered");
    uint256 targetId = getTargetId(contractAddress, target);
    uint256 likeId = uint256(keccak256(abi.encodePacked(byte(0x19),byte(0),address(this),contractAddress,target,liker)));
    require(!likeById[likeId].exists,"this like has already been liked");

    totalLikes.increment();

    Like memory _like = Like({
      id: likeId,
      liker: liker,
      fileUrl: _fileUrl,
      targetId: targetId,
      contractAddress: contractAddress,
      target: target,
      exists: true
    });

    likeIds.add(likeId);
    likeById[likeId] = _like;
    addressLikes[liker].add(likeId);
    targetLikes[targetId].add(likeId);
    contractLikes[contractAddress].add(likeId);

    emit liked(likeId, contractAddress, target, targetId, liker, _fileUrl);
  }

  function like(address contractAddress, uint256 target, string memory _fileUrl) public returns (uint256) {
    return _newLike(contractAddress, target, _msgSender(), _fileUrl);
  }

  function likeWithSignature(address contractAddress, uint256 target, address liker, string memory _fileUrl, bytes memory signature) public returns (uint256) {
    bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19),byte(0),address(this),contractAddress,target,liker));
    bool isArtistSignature = checkSignature(messageHash, signature, liker);
    require(isArtistSignature || !checkSignatureFlag, "Unable to verify the artist signature");
    return _newLike(contractAddress, target, liker, _fileUrl);
  }

  function checkLike(address contractAddress, uint256 target, address liker) public view returns (bool) {
    require(registeredContracts[contractAddress],"this contract is not registered");
    uint256 likeId = uint256(keccak256(abi.encodePacked(byte(0x19),byte(0),address(this),contractAddress,target,liker)));
    return likeById[likeId].exists;
  }

  function getLikeIdByIndex(uint256 index) public view returns (uint256) {
    return likeIds.at(index);
  }

  function getLikeInfoById(uint256 likeId) public view returns (uint256, address, uint256, address, uint256) {
    require(likeById[likeId].exists, 'like does not exist');
    Like storage _like = likeById[likeId];
    return (likeId, _like.liker, _like.targetId, _like.contractAddress, _like.target);
  }

  function getLikesByTargetId(uint256 targetId) public view returns (uint256) {
    return targetLikes[targetId].length();
  }

  function getLikesByTarget(address contractAddress, uint256 target) public view returns (uint256) {
    uint256 targetId = getTargetId(contractAddress, target);
    return targetLikes[targetId].length();
  }

  function getLikesByContract(address contractAddress) public view returns (uint256) {
    require(registeredContracts[contractAddress],"this contract is not registered");
    return contractLikes[contractAddress].length();
  }

  function getLikesByLiker(address liker) public view returns (uint256) {
    return addressLikes[liker].length();
  }

  function addContract(address contractAddress) public returns (bool) {
    require(!registeredContracts[contractAddress],"this contract is already registered");
    registeredContracts[contractAddress] = true;
    address _contractOwner = _msgSender();
    contractOwner[contractAddress] = _contractOwner;
    emit contractAdded(contractAddress, _contractOwner);
    return true;
  }

  function removeContract(address contractAddress) public returns (bool) {
    require(registeredContracts[contractAddress],"this contract is not registered");
    address _contractOwner = _msgSender();
    require(contractOwner[contractAddress] == _contractOwner, 'only the contract owner can remove');
    registeredContracts[contractAddress] = false;
    emit contractRemoved(contractAddress, _contractOwner);
    return false;
  }

  function versionRecipient() external virtual view override returns (string memory) {
    return "1.0";
  }

  function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
    trustedForwarder = _trustedForwarder;
  }

  function getTrustedForwarder() public view returns(address) {
    return trustedForwarder;
  }

  function _msgSender() internal override(BaseRelayRecipient, Context) view returns (address payable) {
      return BaseRelayRecipient._msgSender();
  }
}


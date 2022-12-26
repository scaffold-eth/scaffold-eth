//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import './EmotilonMetadata.sol';

abstract contract NFTContract {
  function renderTokenById(uint256 id) external virtual view returns (string memory);
  function transferFrom(address from, address to, uint256 id) external virtual;
}

abstract contract EmoticoinContract {
  function transferFrom(address from, address to, uint256 amount) external virtual returns (bool) ;
}

error NftAlreadyExists();

contract Emotilon is ERC721Enumerable, IERC721Receiver, Ownable, AccessControl {

  event UpdateCoins(uint256 indexed id, uint256 amount);
  event Killed(uint256 indexed killerId, uint256 indexed id);

  bytes32 public constant HEALTH_ROLE = keccak256("HEALTH_ROLE");
  bytes32 public constant COINS_ROLE = keccak256("COINS_ROLE");
  bytes32 public constant KILL_ROLE = keccak256("KILL_ROLE");

  uint256 public currentId;

  EmoticoinContract emoticoinContract;

  NFTContract[] public nftContracts;
  mapping(address => bool) nftContractsAvailables;
  mapping(address => mapping(uint256 => uint256)) nftById;

  uint256 public lifetime = 3000; // 300000

  mapping (uint256 => uint256) public batteryRecharged;

  mapping (uint256 => uint256) public healthTimestamp;

  mapping (uint256 => bytes32) public genes;

  mapping (uint256 => uint256) public breedingCount;

  mapping (uint256 => uint256) public coins;

  mapping (uint256 => bool) public dead;

  constructor(address emoticoin) ERC721("Emotilon", "EMON") {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    emoticoinContract = EmoticoinContract(emoticoin);
  }

  function contractURI() public pure returns (string memory) {
      return "https://www.roboto-svg.com/roboto-metadata.json";
  }

  function addNft(address nft) public onlyOwner {
    if (nftContractsAvailables[nft]) {
      revert NftAlreadyExists();
    }

    nftContractsAvailables[nft] = true;
    nftContracts.push(NFTContract(nft));
  }

  function nftContractsCount() public view returns (uint256) {
    return nftContracts.length;
  }

  function getContractsAddress() public view returns (address[] memory) {
    address[] memory addresses = new address[](nftContracts.length);
    for (uint i=0; i<nftContracts.length; i++) {
      addresses[i] = address(nftContracts[i]);
    }
    return addresses;
  }

  function mintItem() public returns (uint256) {
      currentId++;

      _mint(msg.sender, currentId);

      genes[currentId] = keccak256(abi.encodePacked( currentId, blockhash(block.number-1), msg.sender, address(this) ));
      healthTimestamp[currentId] = block.timestamp;

      return currentId;
  }

  function breeding(uint256 fatherId, uint256 motherId) public payable returns (uint256) {
      // TODO: check owner
      // TODO: check breedingCount
      // TODO: price?

      currentId++;

      _mint(msg.sender, currentId);

      genes[currentId] = EmotilonMetadata.breedingGenes(fatherId, motherId, genes[fatherId], genes[motherId]);
      healthTimestamp[currentId] = block.timestamp;

      return currentId;
  }

  function giveCoins(uint256 id, uint256 amount) public onlyRole(COINS_ROLE) {
    coins[id] += amount;

    emit UpdateCoins(id, coins[id]);
  }

  function kill(uint256 killerId, uint256 id) public onlyRole(KILL_ROLE) {
    dead[id] = true;

    emit Killed(killerId, id);
  }

  function rechargeHealth(uint256 id, uint256 amount) public onlyRole(HEALTH_ROLE) {
    if (healthStatus(id) == 0) {
      amount += (block.timestamp - (healthTimestamp[id] + lifetime));
    }
    healthTimestamp[id] += amount;
  }

  function decreaseHealth(uint256 id, uint256 amount) public onlyRole(HEALTH_ROLE) {
    healthTimestamp[id] -= amount;
  }

  function healthStatus(uint256 id) public view returns (uint256) {
    require(_exists(id), "not exist");

    // 300.000 seconds, about 3 1/2 days => health 0
    if (block.timestamp > (healthTimestamp[id] + lifetime)) {
      return 0;
    }

    return (healthTimestamp[id] + lifetime - block.timestamp);
  }

  function transferFrom(
      address from,
      address to,
      uint256 tokenId
  ) public virtual override(ERC721, IERC721) {
    require(_exists(tokenId), "not exist");

    if (healthStatus(tokenId) > 0) {
      //solhint-disable-next-line max-line-length
      require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
    }

    _transfer(from, to, tokenId);
  }

  function nftId(address nft, uint256 id) external view returns (uint256) {
    require(_exists(id), "not exist");

    return nftById[nft][id];
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      return EmotilonMetadata.tokenURI(id, genes[id], generateSVGofTokenById(id));
  }

  function statsById(uint256 id) public view returns (EmotilonMetadata.StatsStruct memory) {
      require(_exists(id), "not exist");
      return EmotilonMetadata.statsByGenes(genes[id]);
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  function renderEmotilonById(uint256 id) public view returns (string memory) {
    return EmotilonMetadata.renderEmotilonById(id, genes[id], healthStatus(id));
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  function renderTokenById(uint256 id) public view returns (string memory) {
    // TODO: z-index

    string memory render;

    render = string.concat(render, '<g transform="translate(29, 29)">', renderEmotilonById(id), '</g>');

    for (uint i=0; i<nftContracts.length; i++) {
      if (nftById[address(nftContracts[i])][id] > 0) {
        render = string.concat(render, nftContracts[i].renderTokenById(nftById[address(nftContracts[i])][id]));
      }
    }

    return render;
  }

  // https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol#L374
  function _toUint256(bytes memory _bytes) internal pure returns (uint256) {
        require(_bytes.length >= 32, "toUint256_outOfBounds");
        uint256 tempUint;

        assembly {
            tempUint := mload(add(_bytes, 0x20))
        }

        return tempUint;
  }

  // to receive ERC721 tokens
  function onERC721Received(
      address operator,
      address from,
      uint256 tokenId,
      bytes calldata emotilonIdData) external override returns (bytes4) {

      uint256 emotilonId = _toUint256(emotilonIdData);

      require(ownerOf(emotilonId) == from, "you can only add stuff to a emotilon you own.");
      require(nftContractsAvailables[msg.sender], "invalid accessory NFT");
      require(nftById[msg.sender][emotilonId] == 0, "the emotilon already have this kind of accessory!");

      nftById[msg.sender][emotilonId] = tokenId;

      return this.onERC721Received.selector;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

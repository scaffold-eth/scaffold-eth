pragma solidity ^0.8.17;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RLPReader.sol";
import './MandalaMetadata.sol';

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

error DoneMinting();
error MintNotEnough();
error CouldNotSend();
error CouldNotSendBuildGuidl();
error NotExists();
error AlreadyClaimed();
error NotClaimed();
error FutureBlockNotReached();
error MissedClaimWindow();
error ClaimWrongBlock();
error ClaimWrongBlockHeader();
error OnlyMintPostMerge();

contract MandalaMerge is ERC721Enumerable, Ownable {

  using RLPReader for RLPReader.RLPItem;
  using RLPReader for bytes;
  using Strings for uint256;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  event MandalaClaim(uint256 indexed tokenId);

  // 50% go to buidlguidl.eth
  address payable public constant buidlguidl =
    payable(0x97843608a00e2bbc75ab0C1911387E002565DEDE);
  address payable public constant recipient =
    payable(0x4762434888721F067F7d5BefA6eC1F8EE447a387);

  uint256 public constant limit = 1111;
  uint256 public constant step = 0.0001 ether;
  uint256 public price = 0.01 ether;

  uint256 public constant futureBlocks = 10;

  // tokenId -> mint block number
  mapping (uint256 => uint256) public blockNumbers;
  mapping (uint256 => bool) public claimed;
  mapping (uint256 => bytes32) public genes;

  constructor() ERC721("MandalaMerge", "MDLMGE") {
  }

  function mintItem()
      public
      payable
      returns (uint256)
  {
      if (!mergeHasOccured())
        revert OnlyMintPostMerge();

      if (_tokenIds.current() >= limit)
        revert DoneMinting();

      if (msg.value < price)
        revert MintNotEnough();

      price = price + step;

      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      blockNumbers[id] = block.number;
      genes[id] = keccak256(abi.encodePacked(id, blockhash(block.number-1), msg.sender, address(this)));

      uint256 half = msg.value / 2;

      (bool successBuildGuidl, ) = buidlguidl.call{value: half}("");
      if (!successBuildGuidl)
        revert CouldNotSendBuildGuidl();

      (bool success, ) = recipient.call{value: msg.value - half}("");
      if (!success)
        revert CouldNotSend();

      return id;
  }

  /**
   * @notice Determine whether we're running in Proof of Work or Proof of Stake
   * @dev Post-merge, the DIFFICULTY opcode gets renamed to PREVRANDAO,
   * and stores the prevRandao field from the beacon chain state if EIP-4399 is finalized.
   * If not, the difficulty number must be 0 according to EIP-3675, so both possibilities are
   * checked here.
   */
  function mergeHasOccured() public view returns (bool) {
      return block.difficulty > 2**64 || block.difficulty == 0;
  }

  function claim(uint256 id, bytes memory rlpBytes) external {
    if (!_exists(id))
      revert NotExists();

    if (claimed[id])
      revert AlreadyClaimed();

    if (block.number < blockNumbers[id] + futureBlocks)
      revert FutureBlockNotReached();

    if (block.number >= blockNumbers[id] + futureBlocks + 256)
      revert MissedClaimWindow();

    RLPReader.RLPItem[] memory ls = rlpBytes.toRlpItem().toList();

    // we have to use mixHash on PoS networks -> https://eips.ethereum.org/EIPS/eip-4399
    bytes memory mixHash = ls[13].toBytes();

    uint256 blockNumber = ls[8].toUint();

    if (blockNumber != blockNumbers[id] + futureBlocks)
      revert ClaimWrongBlock();

    if (blockhash(blockNumber) != keccak256(rlpBytes))
      revert ClaimWrongBlockHeader();

    genes[id] = keccak256(abi.encodePacked(id, mixHash, address(this), msg.sender));

    claimed[id] = true;

    emit MandalaClaim(id);
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
    if (!_exists(id))
      revert NotExists();

    if (claimed[id] || block.number >= blockNumbers[id] + futureBlocks + 256) {
      return MandalaMetadata.tokenURI(id, ownerOf(id), claimed[id], generateSVGofTokenById(id));
    }

    revert NotClaimed();
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  // See https://eips.ethereum.org/EIPS/eip-4883
  function renderTokenById(uint256 id) public view returns (string memory) {
    if (!_exists(id))
      revert NotExists();

    if (claimed[id]) {
      return MandalaMetadata.renderMandalaById(genes[id]);
    }

    if (block.number >= blockNumbers[id] + futureBlocks + 256) {
      return MandalaMetadata.renderUnclaimedMandalaById(genes[id]);
    }

    revert NotClaimed();
  }
}

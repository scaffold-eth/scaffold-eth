// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Merkler is Initializable, ReentrancyGuard {

    enum Asset { ETH, ERC20 }

    string public treeFile;
    bytes32 public root;
    Asset public assetType;
    IERC20 public token;
    address public dropper;
    uint256 public deadline;

    event Claimed(uint256 index, address account, uint256 amount);

    // This is a packed array of booleans.
    mapping(uint256 => uint256) public claimedBitMap;

    function isClaimed(uint256 index) public view returns (bool) {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        uint256 claimedWord = claimedBitMap[claimedWordIndex];
        uint256 mask = (1 << claimedBitIndex);
        return claimedWord & mask == mask;
    }

    function _setClaimed(uint256 index) private {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        claimedBitMap[claimedWordIndex] = claimedBitMap[claimedWordIndex] | (1 << claimedBitIndex);
    }

    function initializeEthMerkler(bytes32 _root, address _dropper, uint256 _deadline, string calldata _treefile) public initializer payable {
        require(msg.value > 0, 'Must drop ETH.');
        root = _root;
        assetType = Asset.ETH;
        dropper = _dropper;
        deadline = _deadline;
        treeFile = _treefile;
    }

    function initializeTokenMerkler(bytes32 _root, address _tokenAddress, uint256 _amount, address _dropper, uint256 _deadline, string calldata _treefile) public initializer {
        require(_amount > 0, 'Must drop tokens.');
        root = _root;
        assetType = Asset.ERC20;
        dropper = _dropper;
        deadline = _deadline;
        token = IERC20(_tokenAddress);
        token.transferFrom(msg.sender, address(this), _amount);
        treeFile = _treefile;
    }

    function redeem(uint256 index, address account, uint256 amount, bytes32[] calldata proof)
    public nonReentrant
    {
        require(!isClaimed(index), 'Already claimed.');
        require(_verify(_leaf(index, account, amount), proof), "Invalid merkle proof");

        _setClaimed(index);
        if(assetType == Asset.ETH) {
          (bool sent, bytes memory data) = account.call{value: amount}("");
          require(sent, "Failed to send Ether");
        } else if (assetType == Asset.ERC20) {
          token.transfer(account, amount);
        }

        emit Claimed(index, account, amount);
    }

    function _leaf(uint256 index, address account, uint256 amount)
    internal pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(index, account, amount));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof)
    internal view returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }

    function withdraw() external nonReentrant {
      require(block.timestamp > deadline, 'before deadline');

      if (assetType == Asset.ERC20 && token.balanceOf(address(this)) > 0) {
        token.transfer(dropper, token.balanceOf(address(this)));
      }

      if(address(this).balance > 0) {
        (bool sent, ) = dropper.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
      }
    }
}

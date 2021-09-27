// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Merkler is Initializable, ReentrancyGuard {
    string public treeFile;
    bytes32 public root;
    uint8 public assetType;
    IERC20 public token;
    address public dropper;
    uint256 public deadline;

    function initializeEthMerkler(bytes32 _root, address _dropper, uint256 _days, string _treefile) public initializer payable {
        root = _root;
        assetType = 1;
        dropper = _dropper;
        deadline = block.timestamp + _days * 1 days;
        treeFile = _treefile;
    }

    function initializeTokenMerkler(bytes32 _root, address tokenAddress, uint256 amount, address _dropper, uint256 _days, string _treefile) public initializer {
        root = _root;
        assetType = 2;
        dropper = _dropper;
        deadline = block.timestamp + _days * 1 days;
        token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), amount);
        treeFile = _treefile;
    }

    function redeem(address account, uint256 amount, bytes32[] calldata proof)
    external nonReentrant
    {
        require(_verify(_leaf(account, amount), proof), "Invalid merkle proof");

        if(assetType == 1) {
          (bool sent, bytes memory data) = account.call{value: amount}("");
          require(sent, "Failed to send Ether");
        } else if (assetType == 2) {
          token.transferFrom(address(this), account, amount);
        }
    }

    function _leaf(address account, uint256 amount)
    internal pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(account, amount));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof)
    internal view returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }

    function withdraw() external nonReentrant {
      require(block.timestamp > deadline, 'before deadline');
      if(assetType == 1) {
        (bool sent, bytes memory data) = dropper.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
      } else if (assetType == 2) }
        token.transferFrom(address(this), dropper, token.balanceOf(address(this)));
      }
    }
}

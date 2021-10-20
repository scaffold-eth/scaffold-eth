// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

interface IMerkler {
    // Returns the address of the token distributed by this contract.
    function token() external view returns (address);
    // Returns the merkle root of the merkle tree containing account balances available to claim.
    function merkleRoot() external view returns (bytes32);
    // Returns true if the index has been marked claimed.
    function isClaimed(uint256 index) external view returns (bool);
    // Claim the given amount of the token to the given address. Reverts if the inputs are invalid.
    function claim(uint256 index, address account, uint256 amount, bytes32[] calldata merkleProof) external;
    // Initialize the Merkler contract with ETH
    function initializeEthMerkler(bytes32 _root, address _dropper, uint256 _days, string calldata _treefile) external payable;
    // Initialize the Merkler contract with ERC20s
    function initializeTokenMerkler(bytes32 _root, address _tokenAddress, uint256 _amount, address _dropper, uint256 _days, string calldata _treefile) external;
}

contract MerkleDeployer {

  address public implementation;

  event Deployed(address indexed _address, uint256 _type, address indexed _dropper, uint256 _deadline, address indexed _token, uint256 _amount, uint256 _decimals, string _symbol);

  constructor(address _implementation) {
    implementation = _implementation;
  }

  function deployEthMerkler(bytes32 _root, address _dropper, uint256 _deadline, string calldata _treefile) public payable returns (address) {

    // clone deterministically
    address deployment = Clones.clone(implementation);

    IMerkler(deployment).initializeEthMerkler{value: msg.value}(_root, _dropper, _deadline, _treefile);

    emit Deployed(deployment, 1, _dropper, _deadline, address(0), msg.value, 18, 'ETH');

    return deployment;

  }

  function deployTokenMerkler(bytes32 _root, address _tokenAddress, uint256 _amount, address _dropper, uint256 _deadline, string calldata _treefile) public returns (address) {

    // clone deterministically
    address deployment = Clones.clone(implementation);

    IERC20Metadata token = IERC20Metadata(_tokenAddress);
    token.transferFrom(msg.sender, address(this), _amount);
    token.approve(deployment, _amount);
    string memory _symbol = token.symbol();
    uint256 _decimals = token.decimals();

    IMerkler(deployment).initializeTokenMerkler(_root, _tokenAddress, _amount, _dropper, _deadline, _treefile);

    emit Deployed(deployment, 2, _dropper, _deadline, _tokenAddress, _amount, _decimals, _symbol);

    return deployment;

  }
}

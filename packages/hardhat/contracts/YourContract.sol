pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

// pragma solidity ^0.8.11;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract YourContract is Ownable{

  // SPDX-License-Identifier: MIT


    bytes32 public roothash;

    address[] public allowedTokensAddresses;
    mapping(address => uint256) public contractTokenBalances;
    mapping(address => bool) public alreadyUser;
    mapping(address => bool) public tokenIsAllowed;

    event tokenAdded(address indexed userAddress, uint256 numberOfTokens);
    event contractTokenBalanceAdjusted(
        address indexed tokenAddress,
        uint256 tokenBalance
    );
    event Deposit(address indexed token, address indexed depositer, uint256 amountDeposited);
    event Withdraw(address indexed token, address indexed Withdrawer, uint256 amountWithdrawn);
    constructor(){
        roothash = 0x05333c1f0af3df88f0dc13897010a772c5cbca67b9a14f74928a6ffdaf6b6ae1;
    }
    
    receive() external payable{}
    fallback() external {}

    function setRootHash(bytes32 _hash) external onlyOwner {
    roothash = _hash;
    }  


    function balanceOfToken(address _tokenAddress)
        public
        view
        returns (uint256)

    {
        require(tokenIsAllowed[_tokenAddress], "token not allowed");
        return IERC20(_tokenAddress).balanceOf(msg.sender);
    }

    function deposit(address _token, uint256 _amount) public{
        require(_amount > 0, "Deposit an amount greater than 0");
        require(
            balanceOfToken(_token) >= _amount,
            "insufficient tokens available in your wallet"
        );
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        uint256 contractTokenBalance = contractTokenBalances[_token] += _amount;
        emit contractTokenBalanceAdjusted(_token, contractTokenBalance);
        emit Deposit(_token, msg.sender, _amount);
        
    }

    function addAllowedTokens(address _token) public onlyOwner {
        allowedTokensAddresses.push(_token);
        tokenIsAllowed[_token] = true;
    }
     function withdraw(
        address _withdrawAddress,
        address _token,
        uint256 _amount,
        bytes32[] calldata _proof
    ) public onlyOwner {
        bytes32 leaf = keccak256(abi.encodePacked((msg.sender)));
        require(MerkleProof.verify(_proof, roothash, leaf), "Address not in a user");
        require(_amount > 0, "Withdraw an amount greater than 0");
        require(
            balanceOfToken(_token) >= _amount,
            "insufficient tokens available in the contract"
        );
        IERC20(_token).transfer(_withdrawAddress, _amount);
        uint256 contractTokenBalance = contractTokenBalances[_token] -= _amount;
        emit contractTokenBalanceAdjusted(_token, contractTokenBalance);
        emit Withdraw(_token, msg.sender, _amount);
    }

}

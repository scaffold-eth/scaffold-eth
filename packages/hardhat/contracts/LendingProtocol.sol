// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the ERC20 interface from OpenZeppelin contracts to interact with the collateral token
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingProtocol {
    // Store the amount of collateral tokens held by the contract
    uint256 public liquidity;

    // The ratio of collateral tokens required per lending token borrowed
    uint256 public collateralRatio;

    // The address of the collateral token contract
    address public collateralToken;

    // The address of the owner of the contract
    address public owner;
    IERC20 token; //instantiates the imported contract
    mapping(address => uint256) borrow_amount;
    mapping(address => uint256) balance;
    event LiquidityAdded(address indexed depositor, uint256 amount);
    event Borrow(address indexed borrower, uint256 amount);
    event Repay(address indexed borrower, uint256 amount);
    event Withdrawal(address indexed owner, uint256 amount);

    // Constructor function, sets the collateral ratio and collateral token address
    constructor(uint256 _collateralRatio, address _collateralToken) {
        collateralRatio = _collateralRatio;
        collateralToken = _collateralToken;
        owner = msg.sender;
        token = IERC20(_collateralToken);
    }

    // Function to deposit collateral tokens into the contract
    function addLiquidity(uint256 _amount) public {
        require(_amount > 0, "must be greater then zero");

        // Transfer the collateral tokens from the user to the contract

        token.transferFrom(msg.sender, address(this), _amount);

        // Add the collateral tokens to the contract's liquidity
        liquidity += _amount;
        balance[msg.sender] += _amount;
        emit LiquidityAdded(msg.sender, _amount);
    }

    // Function to borrow lending tokens, using collateral tokens as collateral
    function borrow(uint256 _amount) public payable {
        require(_amount > 0, "must be greater then zero");

        // Calculate the required collateral amount based on the collateral ratio and lending token amount
        uint256 collateralAmount = collateralRatio * _amount;

        // Ensure the user has sent enough ETH to cover the collateral and fee
        require(msg.value >= collateralAmount, "collateral amount is lower");

        // Transfer the lending tokens to the user
        token.transfer(msg.sender, _amount);
        liquidity -= _amount;
        borrow_amount[msg.sender] += _amount;
        emit Borrow(msg.sender, _amount);
    }

    // Function to repay borrowed lending tokens and retrieve collateral tokens
    function repay(uint256 _amount) public {
        require(_amount > 0, "must be greater then zero");
        require(borrow_amount[msg.sender] >= _amount, "not enough balance");
        // Transfer the lending tokens from the user to the contract
        token.transferFrom(msg.sender, address(this), _amount);

        // Decrease the contract's liquidity by the amount of collateral tokens retrieved
        liquidity += _amount;
        payable(msg.sender).transfer(_amount * collateralRatio);
        borrow_amount[msg.sender] -= _amount;
        emit Repay(msg.sender, _amount);
    }

    // Function to withdraw collateral tokens from the contract
    function withdraw(uint256 _amount) public {
        require(_amount > 0, "must be greater then zero");
        require(_amount <= liquidity, "liquidity not available");
        require(balance[msg.sender] >= _amount, "not enough balance");
        // Transfer the collateral tokens from the contract to the owner
        token.transfer(msg.sender, _amount);

        // Decrease the contract's liquidity by the amount of collateral tokens withdrawn
        liquidity -= _amount;
        balance[msg.sender] -= _amount;
        emit Withdrawal(msg.sender, _amount);
    }

    // Function to get the contract's liquidity
    function getLiquidity() public view returns (uint256) {
        return liquidity;
    }

    // Function to get the contract's collateral ratio
    function getCollateralRatio() public view returns (uint256) {
        return collateralRatio;
    }

    // Function to get the contract's collateral token
    function getCollateralToken() public view returns (address) {
        return collateralToken;
    }

    // Function to get the contract's owner
    function getOwner() public view returns (address) {
        return owner;
    }

    //funcation to borrow amount of user
    function getBorrowAmount(address _user) public view returns (uint256) {
        return borrow_amount[_user];
    }

    //funcation to get balance of liquidity provider
    function getBalance(address _user) public view returns (uint256) {
        return balance[_user];
    }
}

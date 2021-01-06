pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; 
//https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract GridGame {
    // State variables
    address payable public owner;

    // Grid
    uint public rows = 256;
    uint public cols = 256;

    //GridSquare[][] public gridSquares;

    struct GridSqure {
        uint id;
        address payable owner;
        string color;
    }

    //mapping(address => GridSquare) gridSquareOwners;

    // Modifiers
    modifier onlyBy(address _account)
    {
        require(
            msg.sender == _account,
            "Sender not authorized."
        );
        // Do not forget the "_;"! It will
        // be replaced by the actual function
        // body when the modifier is used.
        _;
    }

    modifier onlyAfter(uint _time) {
        require(
            block.timestamp >= _time,
            "Function called too early."
        );
        _;
    }


    // Events
    event GridSquarePurchased(address owner, uint id);

    // Constructor will only ever run once on deploy
    constructor (address payable _owner) public {
        owner = _owner;
    }

    // Functions
    /// Make `_newOwner` the new owner of this
    /// contract.
    function changeOwner(address payable _newOwner)
        public
        onlyBy(owner)
    {
        owner = _newOwner;
    }

    function buySquare(uint _id, uint _amount)
        public
        payable
    {

    }

    function sellSquare(uint _id, uint _amount, address payable _to)
        public
        payable
    {

    }



}
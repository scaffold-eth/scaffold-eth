pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; 
//https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract GridGame {
    // State variables
    address payable public owner;

    // Grid
    uint256 rows = 8;
    uint256 cols = 8;    

    struct GridSquare {
        address payable owner;
        uint256 value;
        uint8 color;
    }

    GridSquare[64] public gridSquares;
    //mapping(uint256 => GridSquare) public gridSquares;

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

    modifier onlyAfter(uint256 _time) 
    {
        require(
            block.timestamp >= _time,
            "Function called too early."
        );
        _;
    }

    // Events
    event GridSquarePurchased(address owner, uint256 x, uint256 y, uint8 color, uint256 amount);
    event GridSquareTransferred(address owner, uint256 id, uint256 amount, address newOwner);

    // Constructor will only ever run once on deploy
    constructor (address payable _owner) 
        public 
    {
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

    function buySquare(uint256 _x, uint256 _y, uint8 _color)
        public
        payable
    {

        uint256 id = _x + _y * 8;
        //require(msg.value > 0, "Must send value for square");
        gridSquares[id] = GridSquare(
            msg.sender,
            msg.value,
            _color
        );

        emit GridSquarePurchased(msg.sender, _x, _y, _color, msg.value);
    }

    function sellSquare(uint256 _id, uint256 _amount, address payable _to)
        public
        payable
    {
        require(msg.value >= _amount, "not enough ether sent");

        emit GridSquareTransferred(msg.sender, _id, _amount, _to);
    }



}
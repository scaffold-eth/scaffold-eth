pragma solidity >=0.6.0 <0.7.0;

//import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; 
//https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract GridGame {
    // State variables
    //address payable public owner;

    // Grid
    //uint256 rows = 8;
    //uint256 cols = 8;    

    struct GridSquare {
        address payable owner;
        uint256 value;
        uint8 color;
        uint256 x;
        uint256 y;
    }

    GridSquare[64] public gridSquares;

    // Events
    event GridSquarePurchased(address owner, uint256 x, uint256 y, uint8 color, uint256 amount);

    // Constructor will only ever run once on deploy
    constructor () 
        public 
    {
        
    }

    function ownerOf(uint256 _x, uint256 _y)
        public
        view
        returns(address)
    {
        uint256 id = _x + _y * 8;
        return gridSquares[id].owner;
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
            _color,
            _x,
            _y
        );

        emit GridSquarePurchased(msg.sender, _x, _y, _color, msg.value);
    }

    function updateColor(uint256 _x, uint256 _y, uint8 _color)
        public
    {
        uint256 id = _x + _y * 8;
        require(gridSquares[id].owner == msg.sender, "not the owner");
        gridSquares[id].color = _color;

        emit GridSquarePurchased(msg.sender, _x, _y, _color, 0);
    }


    function sellSquare(uint256 _x, uint256 _y, uint8 _color, uint256 _amount, address payable _to)
        public
        payable
    {
        uint256 id = _x + _y * 8;
        require(msg.value >= _amount, "not enough ether sent");
        GridSquare memory square = gridSquares[id];
        square.owner = _to;
        square.value = _amount;
        square.color = _color;

        emit GridSquarePurchased(_to, _x, _y, _color, _amount);
    }




}
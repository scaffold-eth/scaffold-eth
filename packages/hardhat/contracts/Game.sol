// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GoldToken.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "./NFTAvatar.sol";

enum MoveDirection {
    Up,
    Down,
    Left,
    Right
}

contract Game is VRFConsumerBaseV2, Ownable  {
    event Register(address txOrigin, address msgSender, uint8 x, uint8 y);
    event Move(address txOrigin, uint8 x, uint8 y);
    event NFTMinted(address txOrigin, uint256 tokenId);
    event GameOver(address player);
    event CollectedTokens(address player, uint256 amount);
    event CollectedHealth(address player, uint256 amount);
    event NewDrop(bool isHealth, uint256 amount, uint8 x, uint8 y);

    struct Field {
        address player;
        uint256 tokenAmountToCollect;
        uint256 healthAmountToCollect;
    }

    struct Position {
        uint8 x;
        uint8 y;
    }

    address public keeper;
    bool public gameOn;
    GLDToken public gldToken;
    NFTAvatar public nftAvatar;
    uint public collectInterval;

    VRFCoordinatorV2Interface immutable coordinator;
    address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    uint64 immutable subscriptionId;
    bytes32 immutable keyHash;
    uint32 immutable callbackGasLimit;
    uint16 immutable requestConfirmations;
    uint32 immutable numWords;


    uint8 public constant width = 24;
    uint8 public constant height = 24;
    Field[width][height] public worldMatrix;

    mapping(address => address) public yourContract;
    mapping(address => Position) public yourPosition;
    mapping(address => uint256) public health;
    mapping(uint256 => address) public requestIds;
    mapping(address => uint256) public lastCollectAttempt;

    constructor(uint64 _subscriptionId, uint256 _collectInterval) VRFConsumerBaseV2(vrfCoordinator) {
        subscriptionId = _subscriptionId;
        collectInterval = _collectInterval;
        // params for Rinkeby
        coordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
        callbackGasLimit = 1000000;
        requestConfirmations = 3;
        numWords = 1;
    }

    function setKeeper(address _keeper) public onlyOwner {
        keeper = _keeper;
    }

    function setGldToken(address _gldToken) public onlyOwner {
        gldToken = GLDToken(_gldToken);
    }

    function setNftAvatar(address _nftAvatar) public onlyOwner {
        nftAvatar = NFTAvatar(_nftAvatar);
    }

    function setCollectInterval(uint256 _collectInterval) public onlyOwner {
        collectInterval = _collectInterval;
    }

    function start() public onlyOwner {
        gameOn = true;
    }

    function end() public onlyOwner {
        gameOn = false;
    }

    function update(address newContract) public {
      require(gameOn, "TOO LATE");
      health[tx.origin] = (health[tx.origin]*80)/100; //20% loss of health on contract update?!!? lol
      require(tx.origin == msg.sender, "MUST BE AN EOA");
      require(yourContract[tx.origin] != address(0), "MUST HAVE A CONTRACT");
      yourContract[tx.origin] = newContract;
    }


    bool public requireContract = false;

    function setRequireContract(bool newValue) public onlyOwner {
        requireContract = newValue;
    }

    function register() public {
        require(gameOn, "TOO LATE");
        if(requireContract) require(tx.origin != msg.sender, "NOT A CONTRACT");
        require(yourContract[tx.origin] == address(0), "NO MORE PLZ");

        yourContract[tx.origin] = msg.sender;
        health[tx.origin] = 500;
        //uint256 requestId = coordinator.requestRandomWords(keyHash, subscriptionId, requestConfirmations, callbackGasLimit, numWords);
        //requestIds[requestId] = tx.origin;

        randomlyPlace();

        emit Register(tx.origin, msg.sender, yourPosition[tx.origin].x, yourPosition[tx.origin].y);
    }

    function randomlyPlace() internal {
        bytes32 predictableRandom = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, tx.origin, address(this) ));

        uint8 index = 0;
        uint8 x  = uint8(predictableRandom[index++])%width;
        uint8 y  = uint8(predictableRandom[index++])%height;

        Field memory field = worldMatrix[x][y];

        while(field.player != address(0)){
            x  = uint8(predictableRandom[index++])%width;
            y  = uint8(predictableRandom[index++])%height;
            field = worldMatrix[x][y];
        }

        worldMatrix[x][y].player = tx.origin;
        worldMatrix[yourPosition[tx.origin].x][yourPosition[tx.origin].y].player = address(0);
        yourPosition[tx.origin] = Position(x, y);
        emit Move(tx.origin, x, y);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        nftAvatar.mint(randomWords[0], requestIds[requestId]);

        emit NFTMinted(requestIds[requestId], requestId);
    }

    function currentPosition() public view returns(Position memory) {
        return yourPosition[tx.origin];
    }

    function positionOf(address player) public view returns(Position memory) {
        return yourPosition[player];
    }

    function collectTokens() public {
        require(health[tx.origin] > 0, "YOU DED");
        require(block.timestamp - lastCollectAttempt[tx.origin] >= collectInterval, "TOO EARLY");
        lastCollectAttempt[tx.origin] = block.timestamp;

        Position memory position = yourPosition[tx.origin];
        Field memory field = worldMatrix[position.x][position.y];
        require(field.tokenAmountToCollect > 0, "NOTHING TO COLLECT");

        if(field.tokenAmountToCollect > 0) {
            // transfer tokens to tx.origin
            gldToken.transfer(tx.origin, field.tokenAmountToCollect);
            worldMatrix[position.x][position.y].tokenAmountToCollect = 0;
            emit CollectedTokens(tx.origin, field.tokenAmountToCollect);
        }

    }

    function collectHealth() public {
        require(health[tx.origin] > 0, "YOU DED");
        require(block.timestamp - lastCollectAttempt[tx.origin] >= collectInterval, "TOO EARLY");
        lastCollectAttempt[tx.origin] = block.timestamp;

        Position memory position = yourPosition[tx.origin];
        Field memory field = worldMatrix[position.x][position.y];
        require(field.healthAmountToCollect > 0, "NOTHING TO COLLECT");

        if(field.healthAmountToCollect > 0) {
            // increase health
            health[tx.origin] += field.healthAmountToCollect;
            worldMatrix[position.x][position.y].healthAmountToCollect = 0;
            emit CollectedHealth(tx.origin, field.healthAmountToCollect);
        }
    }

    uint8 public attritionDivider = 50;

    function setAttritionDivider(uint8 newDivider) public onlyOwner {
        attritionDivider = newDivider;
    }


    function move(MoveDirection direction) public {
        require(health[tx.origin] > 0, "YOU DED");
        if(requireContract) require(tx.origin != msg.sender, "NOT A CONTRACT");
        (uint8 x, uint8 y) = getCoordinates(direction, tx.origin);
        require(x <= width && y <= height, "OUT OF BOUNDS");

        Field memory field = worldMatrix[x][y];

        bytes32 predictableRandom = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this)));

        health[tx.origin] -= uint8(predictableRandom[0])/attritionDivider;

        if(field.player == address(0)) {
            // empty field
            worldMatrix[x][y].player = tx.origin;
            worldMatrix[yourPosition[tx.origin].x][yourPosition[tx.origin].y].player = address(0);
            yourPosition[tx.origin] = Position(x, y);
            emit Move(tx.origin, x, y);
        } else {
            // fight
            (/*uint attackerTokenId*/, uint attackerAttack, /*uint attackerDefence*/) = nftAvatar.getCharacterByOwner(tx.origin);
            (/*uint defenderTokenId*/, /*uint defenderAttack*/, uint defenderDefence) = nftAvatar.getCharacterByOwner(field.player);

            if(attackerAttack > defenderDefence) {
                health[field.player] -= (attackerAttack - defenderDefence);
            } else {
                health[tx.origin] -= (defenderDefence - attackerAttack);
            }

            if(health[field.player] <= 0) {
                // dead
                emit GameOver(field.player);
                worldMatrix[x][y].player = tx.origin;
                worldMatrix[yourPosition[tx.origin].x][yourPosition[tx.origin].y].player = address(0);
                yourPosition[tx.origin] = Position(x, y);
                emit Move(tx.origin, x, y);
            }
        }

        if(health[tx.origin] <= 0) {
            worldMatrix[yourPosition[tx.origin].x][yourPosition[tx.origin].y].player = address(0);
            emit GameOver(tx.origin);
        }
    }

    function getCoordinates(MoveDirection direction, address txOrigin) internal view returns(uint8 x, uint8 y) {
        //       x ----->
        //      _______________
        //  y  |____|____|_____
        //     |____|____|_____
        //     |____|____|_____
        //     |____|____|_____

        if (direction == MoveDirection.Up) {
            x = yourPosition[txOrigin].x;
            y = yourPosition[txOrigin].y - 1;
        }

        if (direction == MoveDirection.Down) {
            x = yourPosition[txOrigin].x;
            y = yourPosition[txOrigin].y + 1;
        }

        if (direction == MoveDirection.Left) {
            x = yourPosition[txOrigin].x - 1;
            y = yourPosition[txOrigin].y;
        }

        if (direction == MoveDirection.Right) {
            x = yourPosition[txOrigin].x + 1;
            y = yourPosition[txOrigin].y;
        }
    }

function shufflePrizes(uint256 firstRandomNumber, uint256 secondRandomNumber) public {
        require(msg.sender == keeper, "ONLY KEEPER CAN CALL");

        uint8 x;
        uint8 y;

        x = uint8(uint256(keccak256(abi.encode(firstRandomNumber, 1))) % width);
        y = uint8(uint256(keccak256(abi.encode(secondRandomNumber, 1))) % height);
        worldMatrix[x][y].tokenAmountToCollect += 100 ether;
        emit NewDrop(false, 100 ether, x, y);

        x = uint8(uint256(keccak256(abi.encode(firstRandomNumber, 2))) % width);
        y = uint8(uint256(keccak256(abi.encode(secondRandomNumber, 2))) % height);
        worldMatrix[x][y].tokenAmountToCollect += 50 ether;
        emit NewDrop(false, 50 ether, x, y);

        x = uint8(uint256(keccak256(abi.encode(firstRandomNumber, 3))) % width);
        y = uint8(uint256(keccak256(abi.encode(secondRandomNumber, 3))) % height);
        worldMatrix[x][y].healthAmountToCollect += 100;
        emit NewDrop(true, 100, x, y);

        x = uint8(uint256(keccak256(abi.encode(firstRandomNumber, 4))) % width);
        y = uint8(uint256(keccak256(abi.encode(secondRandomNumber, 4))) % height);
        worldMatrix[x][y].healthAmountToCollect += 50;
        emit NewDrop(true, 50, x, y);

    }

}

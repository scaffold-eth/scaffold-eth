pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract War {
    mapping(address => address[]) public pendingGames;
    mapping(address => address) public activeGames;
    address[] hosts; 
    
    event GameOpened(address playerOneAddress, address gameAddress);
    event GameJoined(address playerTwoAddress, address gameAddress);
    event GameStarted(address playerOneAddress, address playerTwoAddress);
    
    function getPendingGames(address _address) public view returns(address[] memory) { 
        return pendingGames[_address]; 
    }

    function joinGame(address gameAddress) public payable {
        setPendingGames(gameAddress);
    }
    
    function setPendingGames(address gameAddress) public payable returns(bool) {
        // TODO: ADD USERS NFT
         if(pendingGames[gameAddress].length == 0) {
            pendingGames[gameAddress] = [0x0000000000000000000000000000000000000000];
            hosts.push(msg.sender);
            emit GameOpened(0x0000000000000000000000000000000000000000, gameAddress);
        } else {
            require(gameAddress != msg.sender, "User cannot join their own game");
            // User can join the same game multiple times technically..but it costs, so it's dumb
            // TODO: ADD USERS NFT
            pendingGames[gameAddress] = [msg.sender];
            emit GameJoined(msg.sender, gameAddress);
        }
        return true;
    }
    
    function startGame(address playerOneAddress, address playerTwoAddress) public returns(bool) {
            require(pendingGames[playerOneAddress].length > 1, 'Player 1 must have a game open');
            require(playerOneAddress == msg.sender, 'Only player 1 can accept and start a game');
            // Emit game started
            emit GameStarted(playerOneAddress, playerTwoAddress);
            // Delete Pending Game
            delete pendingGames[playerOneAddress];
            // Commence game
            activeGames[playerOneAddress] = playerTwoAddress;
            return true;
    }
}

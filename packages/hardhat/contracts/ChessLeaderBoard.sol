pragma solidity ^0.6.2;

contract ChessLeaderBoard {
    /*
    Create a contract called ChessLeaderBoard
• It has a mapping address -> uint16 which stores the score of each player
• The score of each player is at the beginning 1500
• A function match(address player1, address player2, uint8 score) is called when a new match is
terminated and the scores must be updated.
• The match function changes the scores as follows
• If score is 0: player 1 lost 1 points and player2 gain 1 point (draw)
• If score is 1: player1 wins 3 points and player2 lost 2 points (win player2)
• If score is 2: player2 wins 4 points and player1 lost 2 points (win player2)
*/

    mapping(address => uint16) public scores;

    function getScore(address _address) public view returns (uint16) {
        return scores[_address];
    }

    function setInitScore(address _address) public {
        scores[_address] = 1500;
    }

    function chessMatch(address player1, address player2, uint8 score) public {
        if (score == 0) {
            scores[player1]--;
            scores[player2]++;
        } else if (score == 1) {
            scores[player1] += 3;
            scores[player2] -= 2;
        } else if (score == 2) {
            scores[player1] -= 2;
            scores[player2] += 4;
        }
    }
}

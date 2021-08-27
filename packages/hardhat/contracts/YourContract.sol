pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  string public purpose = "Hacker News for Ethereum";
  
  struct Post{
    uint data_hash;
    address poster;
  }

  Post[] public posts;

  mapping(uint => mapping(address => uint8)) public upvotes;

  function addPost(uint data) public {
    posts.push(Post({data_hash: data, poster: msg.sender}));
  }

  function upvote(uint data_hash) public {
    upvotes[data_hash][msg.sender] = 1;
  }

  function downvote(uint data_hash) public {
    upvotes[data_hash][msg.sender] = 2;
  }

  function undoVote(uint data_hash) public {
    upvotes[data_hash][msg.sender] = 0;
  }

}


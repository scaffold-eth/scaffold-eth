pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {
  event NewPost(uint data_hash, address poster);

  event NewComment(uint indexed post_hash, uint comment_hash, address commenter);

  string public purpose = "Hacker News for Ethereum";
  
  struct Post{
    address poster;
    uint upvoteCount;
  }

  mapping(uint => Post) public posts;

  function addPost(uint data_hash) public {
    posts[data_hash] = Post({poster: msg.sender, upvoteCount: 1});
    emit NewPost(data_hash, msg.sender);
  }

  function upvote(uint data_hash) public {
    posts[data_hash].upvoteCount += 1;
  }

  function comment(uint post_hash, uint comment_hash) public {
    emit NewComment(post_hash, comment_hash, msg.sender);
  }

}


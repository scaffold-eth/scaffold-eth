pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

//SPDX-License-Identifier: MIT

contract Storage {

  constructor(string[] memory hashes) public {
   for(uint256 i=0; i < hashes.length;i++){
      ArtWorkHashes[hashes[i]] = true;
    }
  }

  event HashSavedOnChain(string hash);

  mapping (string => bool) public ArtWorkHashes;

  function persist(string memory hash) public
      returns (uint256)
  {
      require(ArtWorkHashes[hash] == false, 'Artwork already present');
      ArtWorkHashes[hash] = true;
      emit HashSavedOnChain(hash);
  }
}

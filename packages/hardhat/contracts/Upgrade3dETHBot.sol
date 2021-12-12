pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

/*
\_____  \   __| _/ \_   _____//  |_|  |__   \______   \ _____/  |_  ______
  _(__  <  / __ |   |    __)_\   __\  |  \   |    |  _//  _ \   __\/  ___/
 /       \/ /_/ |   |        \|  | |   Y  \  |    |   (  <_> )  |  \___ \ 
/______  /\____ |  /_______  /|__| |___|  /  |______  /\____/|__| /____  >
       \/      \/          \/           \/          \/                 \/ 
Collaboration Project for greatestlarp.com
Art by @mettahead inspired by @lahcen_kha
Audo by @AnnimusEdie
Contract by @Blind_nabler and @ghostffcode
Built with scaffold-eth!
*/

contract UpgradedEthBot is ERC721 {
    IERC721 public ogNFT;

    constructor(IERC721 _oldContract) ERC721("3dEthBot", "3dth") {
        ogNFT = _oldContract;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return
            "https://bonez.mypinata.cloud/ipfs/QmYXZgrTBfNHszRiV8s8cp2RmmAFetN4Tyf49MfcU2nVSp/";
    }

    function claim(uint256 _tokenId) public returns (uint256) {
        require(
            ogNFT.ownerOf(_tokenId) == msg.sender,
            "msg.sender not owner of this kNFT"
        );
        require(
            _tokenId <= 200,
            "Only EthBots 1-200 are eligible for minting!"
        );
        require(
            ogNFT.isApprovedForAll(msg.sender, address(this)),
            "Must approve before minting"
        );
        ogNFT.transferFrom(msg.sender, address(this), _tokenId);
        _mint(msg.sender, _tokenId);

        return _tokenId;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return string(abi.encodePacked(super.tokenURI(_tokenId), ".json"));
    }
}

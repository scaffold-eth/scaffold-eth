//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
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
Contract by @ghostffcode
Built with scaffold-eth!
*/

contract DummyBot is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("DummyBot", "DBT") {}

    function _baseURI() internal override view virtual returns (string memory) {
        return "https://etherscan.io/address/0x807a1752402D21400D555e1CD7f175566088b955/";
    }

    function mint() public returns (uint256 id) {
        _tokenIds.increment();

        id = _tokenIds.current();
        _mint(msg.sender, id);

        return id;
    }
}

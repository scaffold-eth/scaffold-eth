// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import 'base64-sol/base64.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract BurnNFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("BurnyBoy", "BURN") {
    }

    function claimToken() public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        return newItemId;
    }


    function generateSVGofTokenById(uint256 _tokenId) public virtual view returns (string memory) {

        string memory svg = string(abi.encodePacked(
            "<svg width='300' height='300' xmlns='http://www.w3.org/2000/svg'>",
            string(abi.encodePacked("<circle cx='120' cy='150' r='60' style='fill: gold;'>",
            "<animate attributeName='r' from='2' to='80' begin='0' dur='3' repeatCount='indefinite' />",
            "</circle>",
            "<polyline points='120 30, 25 150, 290 150' stroke-width='4' stroke='brown' style='fill: none;' />",
            "<polygon points='210 100, 210 200, 270 150' style='fill: lawngreen;' /> ",
            "<text x='60' y='250' fill='blue'>",
            string(abi.encodePacked('Burny boy ',Strings.toString(_tokenId))),
            "</text>")),
            "</svg>"
        ));

        return svg;
    }

    function tokenURI(uint256 id) public view override returns (string memory) {

        require(_exists(id), "ERC721: token does not exist");

        string memory name = string(abi.encodePacked('Burny boy ',Strings.toString(id)));
        string memory description = 'An NFT to burnt ETH';
        string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));

        return
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name,
                                '", "description":"',
                                description,
                                '", "image": "',
                                'data:image/svg+xml;base64,',
                                image,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}

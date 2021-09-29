pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ToColor.sol";

interface ERC721TokenReceiver {
    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes memory _data) external returns(bytes4);
}

abstract contract Loogies {
    mapping (uint256 => bytes3) public color;
    mapping (uint256 => uint256) public chubbiness;
}

contract LoogieTank is ERC721TokenReceiver {

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    using Strings for uint256;
    using ToColor for bytes3;

    string public constant name = "Loogie Tank";
    string public constant symbol = "LOOGTANK";
    Loogies loogieContract = Loogies(0xE203cDC6011879CDe80c6a1DcF322489e4786eB3);

    uint constant tokenId = 1;
    address public owner;
    address public approved;

    uint256[] public loogies;

    constructor(address _owner) {
        owner = _owner;
        emit Transfer(address(0), _owner, tokenId);
    }
    // -----------

    function toUint256(bytes memory _bytes) internal pure returns (uint256) {
        require(_bytes.length >= 32, "toUint256_outOfBounds");
        uint256 tempUint;

        assembly {
            tempUint := mload(add(_bytes, 0x20))
        }

        return tempUint;
    }

    function onERC721Received(
            address operator,
            address from,
            uint256 loogieTokenId,
            bytes calldata data) external override returns (bytes4) {

        loogies.push(loogieTokenId);
        return this.onERC721Received.selector;
    } 

    function renderLoogie(bytes3 color, uint256 chubbiness, uint256 x, uint256 y) internal pure returns (string memory) {
        string memory loogieSVG = string(abi.encodePacked(
                    '<g transform="translate(', x.toString(), ' ', y.toString(), ')">'
                    '<g id="eye1">',
                    '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>',
                    '<ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>',
                    '</g>',
                    '<g id="head">',
                    '<ellipse fill="#',
                    color.toColor(),
                    '" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="',
                    chubbiness.toString(),
                    '" ry="51.80065" stroke="#000"/>',
                    '</g>',
                    '<g id="eye2">',
                    '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>',
                    '<ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>',
                    '</g>'
                    '</g>'
                    ));
        return loogieSVG;
    }

    function renderLoogies() internal view returns (string memory) {
        string memory loogieSVG = "";
        for (uint256 i=0; i < loogies.length; i++) {
            bytes3 color = loogieContract.color(loogies[i]);
            uint256 chubbiness = loogieContract.chubbiness(loogies[i]);
            loogieSVG = string(abi.encodePacked(loogieSVG, renderLoogie(color, chubbiness, i+20, i+20)));
        }

        return loogieSVG;
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory){
        require(_tokenId == tokenId, "URI query for nonexistent token");
        return string(abi.encodePacked(
                    '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
                    '<rect x="0" y="0" width="400" height="400" stroke="black" fill="#8FB9EB" stroke-width="5"/>',
                    renderLoogies(),
                    '</svg>'));
    }

    // -----------
    function totalSupply() public pure returns (uint256) {
        return 1;
    }


    function balanceOf(address _queryAddress) external view returns (uint) {
        if(_queryAddress == owner) {
            return 1;
        } else {
            return 0;
        }
    }

    function ownerOf(uint _tokenId) external view returns (address) {
        require(_tokenId == tokenId, "owner query for nonexistent token");
        return owner;
    }

    function safeTransferFrom(address _from, address _to, uint _tokenId, bytes memory data) public payable {
        require(msg.sender == owner || approved == msg.sender, "Msg.sender not allowed to transfer this NFT!");
        require(_from == owner && _from != address(0) && _tokenId == tokenId);
        emit Transfer(_from, _to, _tokenId);
        approved = address(0);
        owner = _to;
        if(isContract(_to)) {
            if(ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, data) != 0x150b7a02) {
                revert("receiving address unable to hold ERC721!");
            }
        }
    }

    // changed the first safeTransferFrom's visibility to make this more readable.
    function safeTransferFrom(address _from, address _to, uint _tokenId) external payable {
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    function transferFrom(address _from, address _to, uint _tokenId) external payable {
        require(msg.sender == owner || approved == msg.sender, "Msg.sender not allowed to transfer this NFT!");
        require(_from == owner && _from != address(0) && _tokenId == tokenId);
        emit Transfer(_from, _to, _tokenId);
        approved = address(0);
        owner = _to;
    }

    function approve(address _approved, uint256 _tokenId) external payable {
        require(msg.sender == owner, "Msg.sender not owner!");
        require(_tokenId == tokenId, "tokenId invald");
        emit Approval(owner, _approved, _tokenId);
        approved = _approved;
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        require(msg.sender == owner, "Msg.sender not owner!");
        if (_approved) {
            emit ApprovalForAll(owner, _operator, _approved);
            approved = _operator;
        } else {
            emit ApprovalForAll(owner, address(0), _approved);
            approved = address(0);
        }
    }

    function getApproved(uint _tokenId) external view returns (address) {
        require(_tokenId == tokenId, "approved query for nonexistent token");
        return approved;
    }

    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        if(_owner == owner){
            return approved == _operator;
        } else {
            return false;
        }
    }

    function isContract(address addr) public view returns(bool) {
        uint size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return interfaceID == 0x80ac58cd ||
            interfaceID == 0x01ffc9a7;
    }

}

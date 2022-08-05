//SPDX-License-Identifier: MIT
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import "./Square.sol";
import "./Text.sol";

contract Emoticon is ERC721Enumerable, IERC721Receiver {

	using Strings for uint256;
	using Strings for uint8;

	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	Square squareContract;
	Text textContract;

	uint256 public price = 0.01 ether;

	address payable public constant recipient = payable(0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93);

	mapping (uint256 => uint8) public radius;
	mapping (uint256 => uint256) public squareById;
	mapping (uint256 => uint256) public textById;

	constructor(address _square, address _text) ERC721("Emoticon", "EMO") {
		squareContract = Square(_square);
		textContract = Text(_text);
	}

	function mintItem() public payable returns (uint256) {
		require(msg.value >= price, "NOT ENOUGH");

		_tokenIds.increment();

		uint256 id = _tokenIds.current();
		_mint(msg.sender, id);

		bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));

		radius[id] = uint8(genes[0]);

		(bool success, ) = recipient.call{value: msg.value}("");
		require(success, "could not send funds to recipient");

		return id;
	}

	function tokenURI(uint256 id) public view override returns (string memory) {
		string memory name = string.concat('Emoticon #', id.toString());
		string memory image = Base64.encode(bytes(renderSvgById(id)));

		return string.concat(
			'data:application/json;base64,',
			Base64.encode(bytes(
				string.concat(
					'{"name":"', name,
					'", "attributes": [{"radius": ', radius[id].toString(),
					'}], "image": "data:image/svg+xml;base64,', image,'"}'
				)
			))
		);
	}

	function renderTokenById(uint256 id) public view returns (string memory) {

		string memory render = string.concat('<circle cx="300" cy="300" r="', radius[id].toString(), '" stroke="black" stroke-width="3" fill="red" />');

		if (squareById[id] > 0) {
			render = string.concat(render, squareContract.renderTokenById(squareById[id]));
		}

		if (textById[id] > 0) {
			render = string.concat(render, textContract.renderTokenById(textById[id]));
		}

		return render;
	}

	function renderSvgById(uint256 id) internal view returns (string memory) {
		string memory svg = string.concat(
			'<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">',
				renderTokenById(id),
			'</svg>'
		);
		return svg;
	}

	// https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol#L374
	function _toUint256(bytes memory _bytes) internal pure returns (uint256) {
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
		uint256 tokenId,
		bytes calldata emoticonIdData) external override returns (bytes4) {

		uint256 emoticonId = _toUint256(emoticonIdData);

		require(ownerOf(emoticonId) == from, "NO OWNER");
		require(msg.sender == address(squareContract) || msg.sender == address(textContract), "NO SQUARE OR TEXT");

		if (msg.sender == address(squareContract)) {
			require(squareById[emoticonId] == 0, "SQUARE EXISTS");
			squareById[emoticonId] = tokenId;
		} else {
			require(textById[emoticonId] == 0, "TEXT EXISTS");
			textById[emoticonId] = tokenId;
		}

		return this.onERC721Received.selector;
	}
}
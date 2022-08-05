//SPDX-License-Identifier: MIT
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';

contract Text is ERC721Enumerable {

	using Strings for uint256;
	using Strings for uint8;

	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	uint256 public price = 0.01 ether;

	address payable public constant recipient = payable(0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93);

	mapping (uint256 => string) public texts;

	constructor() ERC721("Text", "TXT") {
	}

	function mintItem(string memory text) public payable returns (uint256) {
		require(msg.value >= price, "NOT ENOUGH");

		_tokenIds.increment();

		uint256 id = _tokenIds.current();
		_mint(msg.sender, id);

		texts[id] = text;

		(bool success, ) = recipient.call{value: msg.value}("");
		require(success, "could not send funds to recipient");

		return id;
	}

	function tokenURI(uint256 id) public view override returns (string memory) {
		string memory name = string.concat('Text #', id.toString());
		string memory image = Base64.encode(bytes(renderSvgById(id)));

		return string.concat(
			'data:application/json;base64,',
			Base64.encode(bytes(
				string.concat(
					'{"name":"', name,
					'", "attributes": [{"text": ', texts[id],
					'}], "image": "data:image/svg+xml;base64,', image,'"}'
				)
			))
		);
	}

	function renderTokenById(uint256 id) public view returns (string memory) {
		return string.concat('<text x="0" y="15" fill="red">', texts[id], '</text>');
	}

	function renderSvgById(uint256 id) internal view returns (string memory) {
		string memory svg = string.concat(
			'<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">',
				renderTokenById(id),
			'</svg>'
		);
		return svg;
	}
}
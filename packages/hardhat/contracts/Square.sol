//SPDX-License-Identifier: MIT
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';

contract Square is ERC721Enumerable {

	using Strings for uint256;
	using Strings for uint8;

	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	uint256 public price = 0.01 ether;

	address payable public constant recipient = payable(0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93);

	mapping (uint256 => uint8) public sizes;

	constructor() ERC721("Square", "SQ") {
	}

	function mintItem() public payable returns (uint256) {
		require(msg.value >= price, "NOT ENOUGH");

		_tokenIds.increment();

		uint256 id = _tokenIds.current();
		_mint(msg.sender, id);

		bytes32 genes = keccak256(abi.encodePacked( id, blockhash(block.number-1), msg.sender, address(this) ));

		sizes[id] = uint8(genes[0]);

		(bool success, ) = recipient.call{value: msg.value}("");
		require(success, "could not send funds to recipient");

		return id;
	}

	function tokenURI(uint256 id) public view override returns (string memory) {
		string memory name = string.concat('Square #', id.toString());
		string memory image = Base64.encode(bytes(renderSvgById(id)));

		return string.concat(
			'data:application/json;base64,',
			Base64.encode(bytes(
				string.concat(
					'{"name":"', name,
					'", "attributes": [{"size": ', sizes[id].toString(),
					'}], "image": "data:image/svg+xml;base64,', image,'"}'
				)
			))
		);
	}

	function renderTokenById(uint256 id) public view returns (string memory) {
		return string.concat('<rect x="300" y="300" width="', sizes[id].toString(), '" height="', sizes[id].toString(), '" style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.5;stroke-opacity:0.9" />');
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
pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AMBMediator.sol";
import "./ITokenManagement.sol";
import "./IAMB.sol";

contract NiftyMain is ERC721, Ownable, AMBMediator {

    constructor() ERC721("🎨 Nifty.Ink", "🎨") public {
      _setBaseURI('ipfs://ipfs/');
    }

    event mintedInk(uint256 id, string inkUrl, string jsonUrl, address to, bytes32 msgId);

    mapping (string => EnumerableSet.UintSet) private _inkTokens;
    mapping (uint256 => string) public tokenInk;

    function mint(address to, uint256 tokenId, string calldata inkUrl, string calldata jsonUrl) external returns (uint256) {
      require(msg.sender == address(bridgeContract()));
      require(bridgeContract().messageSender() == mediatorContractOnOtherSide());

      _inkTokens[inkUrl].add(tokenId);
      tokenInk[tokenId] = inkUrl;
      _safeMint(to, tokenId);
      _setTokenURI(tokenId, jsonUrl);
      bytes32 msgId = messageId();

      emit mintedInk(tokenId, inkUrl, jsonUrl, to, msgId);

      return tokenId;
    }

    function inkTokenCount(string memory _inkUrl) public view returns(uint256) {
      uint256 _inkTokenCount = _inkTokens[_inkUrl].length();
      return _inkTokenCount;
    }

    function inkTokenByIndex(string memory inkUrl, uint256 index) public view returns (uint256) {
      return _inkTokens[inkUrl].at(index);
    }

}

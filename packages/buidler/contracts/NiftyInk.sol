pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./SignatureChecker.sol";
import "./INiftyToken.sol";
import "./INiftyRegistry.sol";

contract NiftyInk is BaseRelayRecipient, Ownable, SignatureChecker {

    constructor() public {
      setCheckSignatureFlag(true);
      setArtistTake(1);
    }

    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    Counters.Counter public totalInks;

    uint public artistTake;

    function setArtistTake(uint _take) public onlyOwner {
      require(_take < 100, 'take is more than 99 percent');
      artistTake = _take;
    }

    address public niftyRegistry;

    function setNiftyRegistry(address _address) public onlyOwner {
      niftyRegistry = _address;
    }

    function niftyToken() private view returns (INiftyToken) {
      return INiftyToken(INiftyRegistry(niftyRegistry).tokenAddress());
    }

    event newInk(uint256 id, address indexed artist, string inkUrl, string jsonUrl, uint256 limit);

    struct Ink {
      uint256 id;
      address payable artist;
      string jsonUrl;
      string inkUrl;
      uint256 limit;
      bytes signature;
      uint256 price;
      Counters.Counter priceNonce;
    }

    mapping (string => uint256) public inkIdByInkUrl;
    mapping (uint256 => Ink) private _inkById;
    mapping (address => EnumerableSet.UintSet) private _artistInks;

    function _createInk(string memory inkUrl, string memory jsonUrl, uint256 limit, address payable artist) internal returns (uint256) {

      totalInks.increment();
      uint256 _inkId = totalInks.current();

      Ink storage _ink = _inkById[_inkId];

      _ink.id = _inkId;
      _ink.artist = artist;
      _ink.inkUrl = inkUrl;
      _ink.jsonUrl = jsonUrl;
      _ink.limit = limit;

      inkIdByInkUrl[inkUrl] = _inkId;
      _artistInks[artist].add(_inkId);

      emit newInk(_ink.id, _ink.artist, _ink.inkUrl, _ink.jsonUrl, _ink.limit);

      return _ink.id;
    }

    function createInk(string memory inkUrl, string memory jsonUrl, uint256 limit) public returns (uint256) {
      require(!(inkIdByInkUrl[inkUrl] > 0), "this ink already exists!");

      uint256 inkId = _createInk(inkUrl, jsonUrl, limit, _msgSender());

      niftyToken().firstMint(_msgSender(), inkUrl, jsonUrl);

      return inkId;
    }

    function createInkFromSignature(string memory inkUrl, string memory jsonUrl, uint256 limit, address payable artist, bytes memory signature) public returns (uint256) {
      require(!(inkIdByInkUrl[inkUrl] > 0), "this ink already exists!");

      require(artist!=address(0), "Artist must be specified.");
      bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19), byte(0), address(this), artist, inkUrl, jsonUrl, limit));
      bool isArtistSignature = checkSignature(messageHash, signature, artist);
      require(isArtistSignature || !checkSignatureFlag, "Artist did not sign this ink");

      uint256 inkId = _createInk(inkUrl, jsonUrl, limit, artist);

      _inkById[inkId].signature = signature;

      niftyToken().firstMint(artist, inkUrl, jsonUrl);

      return inkId;
    }

    function _setPrice(uint256 _inkId, uint256 price) private returns (uint256) {

      _inkById[_inkId].price = price;
      _inkById[_inkId].priceNonce.increment();

      return price;
    }

    function setPrice(string memory inkUrl, uint256 price) public returns (uint256) {
      uint256 _inkId = inkIdByInkUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      require(_ink.artist == _msgSender(), "only the artist can set the price!");

      return _setPrice(_ink.id, price);
    }

    function setPriceFromSignature(string memory inkUrl, uint256 price, bytes memory signature) public returns (uint256) {
      uint256 _inkId = inkIdByInkUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19), byte(0), address(this), inkUrl, price, _ink.priceNonce.current()));
      bool isArtistSignature = checkSignature(messageHash, signature, _ink.artist);
      require(isArtistSignature || !checkSignatureFlag, "Artist did not sign this price");

      return _setPrice(_ink.id, price);
    }


    function inkInfoById(uint256 id) public view returns (uint256, address, string memory, bytes memory, uint256, uint256, string memory, uint256) {
      require(id > 0 && id <= totalInks.current(), "this ink does not exist!");
      Ink storage _ink = _inkById[id];

      return (id, _ink.artist, _ink.jsonUrl, _ink.signature, _ink.price, _ink.limit, _ink.inkUrl, _ink.priceNonce.current());
    }

    function inkInfoByInkUrl(string memory inkUrl) public view returns (uint256, address, string memory, bytes memory, uint256, uint256, string memory, uint256) {
      uint256 _inkId = inkIdByInkUrl[inkUrl];

      return inkInfoById(_inkId);
    }

    function inksCreatedBy(address artist) public view returns (uint256) {
      return _artistInks[artist].length();
    }

    function inkOfArtistByIndex(address artist, uint256 index) public view returns (uint256) {
        return _artistInks[artist].at(index);
    }

    function versionRecipient() external virtual view override returns (string memory) {
  		return "1.0";
  	}

    function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
      trustedForwarder = _trustedForwarder;
    }

    function getTrustedForwarder() public view returns(address) {
      return trustedForwarder;
    }

    function _msgSender() internal override(BaseRelayRecipient, Context) view returns (address payable) {
        return BaseRelayRecipient._msgSender();
    }

}

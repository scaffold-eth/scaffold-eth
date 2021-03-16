pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./SignatureChecker.sol";

contract NFTINK is BaseRelayRecipient, ERC721, Ownable, SignatureChecker {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter public totalInks;
    using SafeMath for uint256;

    uint artistTake;

    function setArtistTake(uint _take) public onlyOwner {
      artistTake = _take;
    }

    constructor() ERC721("🎨 Nifty.Ink", "🎨") public {
      _setBaseURI('ipfs://ipfs/');
      setCheckSignatureFlag(true);
      setArtistTake(1);
    }

    event newInk(uint256 id, address indexed artist, string inkUrl, string jsonUrl, uint256 limit);
    event mintedInk(uint256 id, string inkUrl, address to);
    event boughtInk(uint256 id, string inkUrl, address buyer, uint256 price);

    struct Ink {
      uint256 id;
      address payable artist;
      address patron;
      string jsonUrl;
      string inkUrl;
      uint256 limit;
      uint256 count;
      bool exists;
      uint256 price;
    }

    mapping (string => uint256) private _inkIdByUrl;
    mapping (uint256 => Ink) private _inkById;
    mapping (string => EnumerableSet.UintSet) private _inkTokens;
    mapping (address => EnumerableSet.UintSet) private _artistInks;
    mapping (string => bytes) private _inkSignatureByUrl;
    mapping (uint256 => uint256) private _inkIdByTokenId;

    mapping (uint256 => uint256) public tokenPrice;

    mapping (bytes32 => uint256) private msgTokenId;
    mapping (bytes32 => address) private msgRecipient;

    function _createInk(string memory inkUrl, string memory jsonUrl, uint256 limit, address payable artist, address patron) internal returns (uint256) {

      totalInks.increment();

      Ink memory _ink = Ink({
        id: totalInks.current(),
        artist: artist,
        patron: patron,
        inkUrl: inkUrl,
        jsonUrl: jsonUrl,
        limit: limit,
        count: 0,
        exists: true,
        price: 0
        });

        _inkIdByUrl[inkUrl] = _ink.id;
        _inkById[_ink.id] = _ink;
        _artistInks[artist].add(_ink.id);

        emit newInk(_ink.id, _ink.artist, _ink.inkUrl, _ink.jsonUrl, _ink.limit);

        return _ink.id;
    }

    function createInk(string memory inkUrl, string memory jsonUrl, uint256 limit) public returns (uint256) {
      require(!(_inkIdByUrl[inkUrl] > 0), "this ink already exists!");

      uint256 inkId = _createInk(inkUrl, jsonUrl, limit, _msgSender(), _msgSender());

      _mintInkToken(_msgSender(), inkId, inkUrl, jsonUrl);

      return inkId;
    }

    function _mintInkToken(address to, uint256 inkId, string memory inkUrl, string memory jsonUrl) internal returns (uint256) {
      _inkById[inkId].count += 1;

      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _inkTokens[inkUrl].add(id);
      _inkIdByTokenId[id] = inkId;

      _mint(to, id);
      _setTokenURI(id, jsonUrl);

      emit mintedInk(id, inkUrl, to);

      return id;
    }

    function mint(address to, string memory inkUrl) public returns (uint256) {
        uint256 _inkId = _inkIdByUrl[inkUrl];
        require(_inkId > 0, "this ink does not exist!");
        Ink storage _ink = _inkById[_inkId];
        require(_ink.artist == _msgSender(), "only the artist can mint!");
        require(_ink.count < _ink.limit || _ink.limit == 0, "this ink is over the limit!");

        uint256 tokenId = _mintInkToken(to, _inkId, _ink.inkUrl, _ink.jsonUrl);

        return tokenId;
    }


    function setPrice(string memory inkUrl, uint256 price) public returns (uint256) {
      uint256 _inkId = _inkIdByUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      require(_ink.artist == _msgSender(), "only the artist can set the price!");
      require(_ink.count < _ink.limit || _ink.limit == 0, "this ink is over the limit!");

      _inkById[_inkId].price = price;

      return price;
    }

    function buyInk(string memory inkUrl) public payable returns (uint256) {
      uint256 _inkId = _inkIdByUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      require(_ink.count < _ink.limit || _ink.limit == 0, "this ink is over the limit!");
      require(_ink.price > 0, "this ink does not have a price set");
      require(msg.value >= _ink.price, "Amount of Ether sent too small");
      address buyer = _msgSender();
      uint256 tokenId = _mintInkToken(buyer, _inkId, inkUrl, _ink.jsonUrl);
      //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment
      _ink.artist.transfer(msg.value);
      emit boughtInk(tokenId, inkUrl, buyer, msg.value);
      return tokenId;
    }


    function setTokenPrice(uint256 _tokenId, uint256 _price) public returns (uint256) {
      require(_exists(_tokenId), "this token does not exist!");
      require(ownerOf(_tokenId) == _msgSender(), "only the owner can set the price!");

      tokenPrice[_tokenId] = _price;

      return _price;
    }

    function buyToken(uint256 _tokenId) public payable {
      uint256 _price = tokenPrice[_tokenId];
      require(_price > 0, "this token is not for sale");
      require(msg.value >= _price, "Amount of Ether sent too small");
      address _buyer = _msgSender();
      address payable _seller = address(uint160(ownerOf(_tokenId)));
      _transfer(_seller, _buyer, _tokenId);
      //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment

      uint256 _artistTake = artistTake.mul(msg.value).div(100);
      uint256 _sellerTake = msg.value.sub(_artistTake);

      Ink storage _ink = _inkById[_inkIdByTokenId[_tokenId]];

      _ink.artist.transfer(_artistTake);
      _seller.transfer(_sellerTake);
      delete tokenPrice[_tokenId];
      emit boughtInk(_tokenId, _ink.inkUrl, _buyer, msg.value);
    }

    function createInkFromSignature(string memory inkUrl, string memory jsonUrl, uint256 limit, address payable artist, bytes memory signature) public returns (uint256) {
      require(!(_inkIdByUrl[inkUrl] > 0), "this ink already exists!");

      require(artist!=address(0), "Artist must be specified.");
      bytes32 messageHash = getHash(artist,inkUrl,jsonUrl,limit);
      bool isArtistSignature = checkSignature(messageHash, signature, artist);
      require(isArtistSignature, "Unable to verify the artist signature");

      uint256 inkId = _createInk(inkUrl, jsonUrl, limit, artist, _msgSender());

      _mintInkToken(_msgSender(), inkId, inkUrl, jsonUrl);

      _inkSignatureByUrl[inkUrl] = signature;

      return inkId;
    }

    function getHash(address artist, string memory inkUrl, string memory jsonUrl, uint256 limit) public view returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                byte(0x19),
                byte(0),
                address(this),
                artist,
                inkUrl,
                jsonUrl,
                limit
        ));
    }

    function inkTokenByIndex(string memory inkUrl, uint256 index) public view returns (uint256) {
      uint256 _inkId = _inkIdByUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      require(_ink.count >= index + 1, "this token index does not exist!");
      return _inkTokens[inkUrl].at(index);
    }

    function inkInfoByInkUrl(string memory inkUrl) public view returns (uint256, address, uint256, string memory, bytes memory, uint256) {
      uint256 _inkId = _inkIdByUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      bytes memory signature = _inkSignatureByUrl[inkUrl];

      return (_inkId, _ink.artist, _ink.count, _ink.jsonUrl, signature, _ink.price);
    }

    function inkIdByUrl(string memory inkUrl) public view returns (uint256) {
      return _inkIdByUrl[inkUrl];
    }

    function inksCreatedBy(address artist) public view returns (uint256) {
      return _artistInks[artist].length();
    }

    function inkOfArtistByIndex(address artist, uint256 index) public view returns (uint256) {
        return _artistInks[artist].at(index);
    }

    function inkInfoById(uint256 id) public view returns (string memory, address, uint256, string memory, bytes memory, uint256) {
      require(_inkById[id].exists, "this ink does not exist!");
      Ink storage _ink = _inkById[id];
      bytes memory signature = _inkSignatureByUrl[_ink.inkUrl];

      return (_ink.jsonUrl, _ink.artist, _ink.count, _ink.inkUrl, signature, _ink.price);
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

    function _msgData() internal override(BaseRelayRecipient, Context) view returns (bytes memory ret) {
        return BaseRelayRecipient._msgData();
    }
}

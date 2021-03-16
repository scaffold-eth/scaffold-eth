pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./INiftyRegistry.sol";
import "./INiftyInk.sol";
import "./SignatureChecker.sol";

contract NiftyToken is BaseRelayRecipient, ERC721, SignatureChecker {

    constructor() ERC721("🎨 Nifty.Ink", "🎨") public {
      _setBaseURI('ipfs://ipfs/');
      setCheckSignatureFlag(true);
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using SafeMath for uint256;

    address public niftyRegistry;

    function setNiftyRegistry(address _address) public onlyOwner {
      niftyRegistry = _address;
    }

    function niftyInk() private view returns (INiftyInk) {
      return INiftyInk(INiftyRegistry(niftyRegistry).inkAddress());
    }

    event mintedInk(uint256 id, string inkUrl, address to);
    event boughtInk(uint256 id, string inkUrl, address buyer, uint256 price);
    event boughtToken(uint256 id, string inkUrl, address buyer, uint256 price);
    event lockedInk(uint256 id, address recipient);
    event unlockedInk(uint256 id, address recipient);
    event newTokenPrice(uint256 id, uint256 price);

    mapping (string => EnumerableSet.UintSet) private _inkTokens;
    mapping (uint256 => string) public tokenInk;

    mapping (uint256 => uint256) public tokenPrice;

    function inkTokenCount(string memory _inkUrl) public view returns(uint256) {
      uint256 _inkTokenCount = _inkTokens[_inkUrl].length();
      return _inkTokenCount;
    }

    function _mintInkToken(address to, string memory inkUrl, string memory jsonUrl) internal returns (uint256) {

      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _inkTokens[inkUrl].add(id);
      tokenInk[id] = inkUrl;

      _mint(to, id);
      _setTokenURI(id, jsonUrl);

      emit mintedInk(id, inkUrl, to);

      return id;
    }

    function firstMint(address to, string calldata inkUrl, string calldata jsonUrl) external returns (uint256) {
      require(_msgSender() == INiftyRegistry(niftyRegistry).inkAddress());
      _mintInkToken(to, inkUrl, jsonUrl);
    }

    function mint(address to, string memory _inkUrl) public returns (uint256) {
        uint256 _inkId = niftyInk().inkIdByInkUrl(_inkUrl);
        require(_inkId > 0, "this ink does not exist!");
        (, address _artist, string memory _jsonUrl, , , uint256 _limit, ) = niftyInk().inkInfoById(_inkId);

        require(_artist == _msgSender(), "only the artist can mint!");

        require(inkTokenCount(_inkUrl) < _limit || _limit == 0, "this ink is over the limit!");

        uint256 tokenId = _mintInkToken(to, _inkUrl, _jsonUrl);

        return tokenId;
    }

    function mintFromSignature(address to, string memory _inkUrl, bytes memory signature) public returns (uint256) {
        uint256 _inkId = niftyInk().inkIdByInkUrl(_inkUrl);
        require(_inkId > 0, "this ink does not exist!");

        uint256 _count = inkTokenCount(_inkUrl);
        (, address _artist, string memory _jsonUrl, , , uint256 _limit, ) = niftyInk().inkInfoById(_inkId);
        require(_count < _limit || _limit == 0, "this ink is over the limit!");

        bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19), byte(0), address(this), to, _inkUrl, _count));
        bool isArtistSignature = checkSignature(messageHash, signature, _artist);
        require(isArtistSignature || !checkSignatureFlag, "only the artist can mint!");

        uint256 tokenId = _mintInkToken(to, _inkUrl, _jsonUrl);

        return tokenId;
    }

    function lock(uint256 _tokenId) external {
      address _bridgeMediatorAddress = INiftyRegistry(niftyRegistry).bridgeMediatorAddress();
      require(_bridgeMediatorAddress == _msgSender(), 'only the bridgeMediator can lock');
      address from = ownerOf(_tokenId);
      _transfer(from, _msgSender(), _tokenId);
    }

    function unlock(uint256 _tokenId, address _recipient) external {
      require(_msgSender() == INiftyRegistry(niftyRegistry).bridgeMediatorAddress(), 'only the bridgeMediator can unlock');
      require(_msgSender() == ownerOf(_tokenId), 'the bridgeMediator does not hold this token');
      safeTransferFrom(_msgSender(), _recipient, _tokenId);
    }

    function buyInk(string memory _inkUrl) public payable returns (uint256) {
      uint256 _inkId = niftyInk().inkIdByInkUrl(_inkUrl);
      require(_inkId > 0, "this ink does not exist!");
      (, address payable _artist, string memory _jsonUrl, , uint256 _price, uint256 _limit, ) = niftyInk().inkInfoById(_inkId);
      require(inkTokenCount(_inkUrl) < _limit || _limit == 0, "this ink is over the limit!");
      require(_price > 0, "this ink does not have a price set");
      require(msg.value >= _price, "Amount sent too small");
      address _buyer = _msgSender();
      uint256 _tokenId = _mintInkToken(_buyer, _inkUrl, _jsonUrl);
      //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment
      _artist.transfer(msg.value);
      emit boughtInk(_tokenId, _inkUrl, _buyer, msg.value);
      return _tokenId;
    }

    function setTokenPrice(uint256 _tokenId, uint256 _price) public returns (uint256) {
      require(_exists(_tokenId), "this token does not exist!");
      require(ownerOf(_tokenId) == _msgSender(), "only the owner can set the price!");

      tokenPrice[_tokenId] = _price;
      emit newTokenPrice(_tokenId, _price);
      return _price;
    }

    function buyToken(uint256 _tokenId) public payable {
      uint256 _price = tokenPrice[_tokenId];
      require(_price > 0, "this token is not for sale");
      require(msg.value >= _price, "Amount sent too small");
      address _buyer = _msgSender();
      address payable _seller = address(uint160(ownerOf(_tokenId)));
      _transfer(_seller, _buyer, _tokenId);
      //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment

      uint256 _artistTake = niftyInk().artistTake().mul(msg.value).div(100);
      uint256 _sellerTake = msg.value.sub(_artistTake);
      string memory _inkUrl = tokenInk[_tokenId];

      (, address payable _artist, , , , , ) = niftyInk().inkInfoByInkUrl(_inkUrl);

      _artist.transfer(_artistTake);
      _seller.transfer(_sellerTake);

      emit boughtInk(_tokenId, _inkUrl, _buyer, msg.value);
    }

    function _transfer(address from, address to, uint256 tokenId) internal override(ERC721) {
        delete tokenPrice[tokenId];
        ERC721._transfer(from, to, tokenId);
    }

    function inkTokenByIndex(string memory inkUrl, uint256 index) public view returns (uint256) {
      return _inkTokens[inkUrl].at(index);
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

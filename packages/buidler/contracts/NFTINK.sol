pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";

contract NFTINK is BaseRelayRecipient, ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter public totalInks;

    constructor() ERC721("Nifty Ink", "NFTINK") public {
      _setBaseURI('ipfs://ipfs/');
    }

    event newInk(uint256 id, address indexed artist, string inkUrl, string jsonUrl, uint256 limit);
    event mintedInk(uint256 id, string inkUrl, address to);

    struct Ink {
    uint256 id;
    address artist;
    string jsonUrl;
    string inkUrl;
    uint256 limit;
    uint256 count;
    bool exists;
    }

    mapping (string => uint256) private _inkIdByUrl;
    mapping (uint256 => Ink) private _inkById;
    mapping (string => EnumerableSet.UintSet) private _inkTokens;
    mapping (address => EnumerableSet.UintSet) private _artistInks;

    function createInk(string memory inkUrl, string memory jsonUrl, uint256 limit) public returns (uint256) {
      require(!(_inkIdByUrl[inkUrl] > 0), "this ink already exists!");

      totalInks.increment();

      Ink memory _ink = Ink({
        id: totalInks.current(),
        artist: _msgSender(),
        inkUrl: inkUrl,
        jsonUrl: jsonUrl,
        limit: limit,
        count: 0,
        exists: true
        });

        _inkIdByUrl[inkUrl] = _ink.id;
        _inkById[_ink.id] = _ink;
        _artistInks[_msgSender()].add(_ink.id);

        emit newInk(_ink.id, _ink.artist, _ink.inkUrl, _ink.jsonUrl, _ink.limit);

        return _ink.id;
    }

    function mint(address to, string memory inkUrl) public returns (uint256) {
        uint256 _inkId = _inkIdByUrl[inkUrl];
        require(_inkId > 0, "this ink does not exist!");
        Ink storage _ink = _inkById[_inkId];
        require(_ink.artist == _msgSender(), "only the artist can mint!");
        require(_ink.count < _ink.limit || _ink.limit == 0, "this ink is over the limit!");

        _inkById[_ink.id].count += 1;

        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _inkTokens[inkUrl].add(id);

        _mint(to, id);
        _setTokenURI(id, _ink.jsonUrl);

        emit mintedInk(id, _ink.inkUrl, to);

        return id;
    }

    function inkTokenByIndex(string memory inkUrl, uint256 index) public view returns (uint256) {
      uint256 _inkId = _inkIdByUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];
      require(_ink.count >= index + 1, "this token index does not exist!");
      return _inkTokens[inkUrl].at(index);
    }

    function inkInfoByInkUrl(string memory inkUrl) public view returns (uint256, address, uint256, string memory) {
      uint256 _inkId = _inkIdByUrl[inkUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink storage _ink = _inkById[_inkId];

      return (_inkId, _ink.artist, _ink.count, _ink.jsonUrl);
    }

    function inksCreatedBy(address artist) public view returns (uint256) {
      return _artistInks[artist].length();
    }

    function inkOfArtistByIndex(address artist, uint256 index) public view returns (uint256) {
        return _artistInks[artist].at(index);
    }

    function inkInfoById(uint256 id) public view returns (string memory, address, uint256, string memory) {
      require(_inkById[id].exists, "this ink does not exist!");
      Ink storage _ink = _inkById[id];

      return (_ink.jsonUrl, _ink.artist, _ink.count, _ink.inkUrl);
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
        if (msg.data.length >= 24 && isTrustedForwarder(msg.sender)) {
            // At this point we know that the sender is a trusted forwarder,
            // so we trust that the last bytes of msg.data are the verified sender address.
            // extract sender address from the end of msg.data
            return address(uint160(LibBytesV06.readAddress(msg.data, msg.data.length - 20)));
        }
        return msg.sender;
    }

}

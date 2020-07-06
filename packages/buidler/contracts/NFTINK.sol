pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTINK is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter public totalInks;

    constructor() ERC721("Nifty Ink", "NFTINK") public {
      _setBaseURI('ipfs://ipfs/');
    }

    event newInk(uint256 id, address indexed artist, string jsonUrl, uint256 limit);
    event mintedInk(uint256 id, string jsonUrl, address to);

    struct Ink {
    uint256 id;
    address artist;
    string jsonUrl;
    uint256 limit;
    uint256 count;
    bool exists;
    }

    mapping (string => uint256) private _inkIdByUrl;
    mapping (uint256 => Ink) private _inkById;
    mapping (string => EnumerableSet.UintSet) private _inkTokens;
    mapping (address => EnumerableSet.UintSet) private _artistInks;

    function createInk(string memory jsonUrl, uint256 limit) public returns (uint256) {
      require(!(_inkIdByUrl[jsonUrl] > 0), "this ink already exists!");

      totalInks.increment();

      Ink memory _ink = Ink({
        id: totalInks.current(),
        artist: msg.sender,
        jsonUrl: jsonUrl,
        limit: limit,
        count: 0,
        exists: true
        });

        _inkIdByUrl[jsonUrl] = _ink.id;
        _inkById[_ink.id] = _ink;
        _artistInks[msg.sender].add(_ink.id);

        emit newInk(_ink.id, _ink.artist, _ink.jsonUrl, _ink.limit);

        return _ink.id;
    }

    function mint(address to, string memory jsonUrl) public returns (uint256) {
        uint256 _inkId = _inkIdByUrl[jsonUrl];
        require(_inkId > 0, "this ink does not exist!");
        Ink memory _ink = _inkById[_inkId];
        require(_ink.artist == msg.sender, "only the artist can mint!");
        require(_ink.count < _ink.limit || _ink.limit == 0, "this ink is over the limit!");

        _inkById[_ink.id].count += 1;

        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _inkTokens[jsonUrl].add(id);

        _mint(to, id);
        _setTokenURI(id, jsonUrl);

        emit mintedInk(id, jsonUrl, to);

        return id;
    }

    function inkTokenByIndex(string memory jsonUrl, uint256 index) public view returns (uint256) {
      uint256 _inkId = _inkIdByUrl[jsonUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink memory _ink = _inkById[_inkId];
      require(_ink.count >= index + 1, "this token index does not exist!");
      return _inkTokens[jsonUrl].at(index);
    }

    function inkInfoByJsonUrl(string memory jsonUrl) public view returns (uint256, address, uint256) {
      uint256 _inkId = _inkIdByUrl[jsonUrl];
      require(_inkId > 0, "this ink does not exist!");
      Ink memory _ink = _inkById[_inkId];

      address _inkArtist = _ink.artist;
      uint256 _inkCount = _ink.count;

      return (_inkId, _inkArtist, _inkCount);
    }

    function inksCreatedBy(address artist) public view returns (uint256) {
      return _artistInks[artist].length();
    }

    function inkOfArtistByIndex(address artist, uint256 index) public view returns (uint256) {
        return _artistInks[artist].at(index);
    }

    function inkInfoById(uint256 id) public view returns (string memory, address, uint256) {
      require(_inkById[id].exists, "this ink does not exist!");
      Ink memory _ink = _inkById[id];

      string memory _jsonUrl = _ink.jsonUrl;
      address _inkArtist = _ink.artist;
      uint256 _inkCount = _ink.count;


      return (_jsonUrl, _inkArtist, _inkCount);
    }
}

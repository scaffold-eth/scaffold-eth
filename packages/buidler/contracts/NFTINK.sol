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

    mapping (string => Ink) private _inkByUrl;
    mapping (string => EnumerableSet.UintSet) private _inkTokens;

    function createInk(string memory jsonUrl, uint256 limit) public returns (uint256) {
      require(!_inkByUrl[jsonUrl].exists, "this ink already exists!");

      totalInks.increment();

      Ink memory _ink = Ink({
        id: totalInks.current(),
        artist: msg.sender,
        jsonUrl: jsonUrl,
        limit: limit,
        count: 0,
        exists: true
        });

        _inkByUrl[jsonUrl] = _ink;

        emit newInk(_ink.id, _ink.artist, _ink.jsonUrl, _ink.limit);

        return _ink.id;
    }

    function mint(address to, string memory jsonUrl) public returns (uint256) {

        require(_inkByUrl[jsonUrl].exists, "this ink does not exist!");
        Ink memory _ink = _inkByUrl[jsonUrl];
        require(_inkByUrl[jsonUrl].artist == msg.sender, "only the artist can mint!");
        require(_ink.count < _ink.limit, "this ink is over the limit!");

        _inkByUrl[jsonUrl].count += 1;

        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _inkTokens[jsonUrl].add(id);

        _mint(to, id);
        _setTokenURI(id, jsonUrl);

        emit mintedInk(id, jsonUrl, to);

        return id;
    }

    function inkTokenByIndex(string memory jsonUrl, uint256 index) public view returns (uint256) {
      require(_inkByUrl[jsonUrl].exists, "this ink does not exist!");
      return _inkTokens[jsonUrl].at(index);
    }

    function inkInfoByJsonUrl(string memory jsonUrl) public view returns (uint256, address, uint256) {
      require(_inkByUrl[jsonUrl].exists, "this ink does not exist!");
      Ink memory _ink = _inkByUrl[jsonUrl];

      uint256 _inkId = _ink.id;
      address _inkArtist = _ink.artist;
      uint256 _inkCount = _ink.count;

      return (_inkId, _inkArtist, _inkCount);
    }
}

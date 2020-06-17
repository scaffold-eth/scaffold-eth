pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTINK is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _inkIds;

    constructor() ERC721("Nifty Ink", "NFTINK") public {
      _setBaseURI('ipfs://ipfs/')
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

    mapping (string => Ink) inkByUrl;

    function createInk(string memory jsonUrl, uint256 limit) public returns (uint256) {
      require(!inkByUrl[jsonUrl].exists, "this ink already exists!");

      _inkIds.increment();

      Ink memory _ink = Ink({
        id: _inkIds.current(),
        artist: msg.sender,
        jsonUrl: jsonUrl,
        limit: limit,
        count: 0,
        exists: true
        });

        inkByUrl[jsonUrl] = _ink;

        emit newInk(_ink.id, _ink.artist, _ink.jsonUrl, _ink.limit);

        return _ink.id;
    }

    function mint(address to, string memory jsonUrl) public returns (uint256) {

        require(inkByUrl[jsonUrl].exists, "this ink does not exist!");
        Ink memory _ink = inkByUrl[jsonUrl];
        require(inkByUrl[jsonUrl].artist == msg.sender, "only the artist can mint!");
        require(_ink.count < _ink.limit, "this ink is over the limit!");

        inkByUrl[jsonUrl].count += 1;

        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _mint(to, id);
        _setTokenURI(id, jsonUrl);

        emit mintedInk(id, jsonUrl, to);

        return id;
    }
}

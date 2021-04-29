pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract Auction is IERC721Receiver {
    struct tokenDetails {
        address seller;
        uint128 price;
        uint256 duration;
        bool isActive;
    }

    mapping(address => mapping(uint256 => tokenDetails)) public tokenToAuction;
    // users who want to buy art work first stake eth before bidding
    mapping(address => uint256) public stakeInfo;
    
    /**
       Seller puts the item on auction
    */
    function createTokenAuction(
        address _nft,
        uint256 _tokenId,
        uint128 _price,
        uint256 _duration
    ) external {
        require(msg.sender != address(0));
        require(_nft != address(0));
        require(_price > 0);
        require(_duration > 0);
        tokenDetails memory _auction = tokenDetails({
            seller: msg.sender,
            price: uint128(_price),
            duration: _duration,
            isActive: true
        });
        address owner = msg.sender;
        ERC721(_nft).safeTransferFrom(owner, address(this), _tokenId);
        tokenToAuction[_nft][_tokenId] = _auction;
    }

    /**
      Before making off-chain bids potential bidders need to stake eth and either they will get it back when the auction ends or they can withdraw it any anytime.
    */
    function stake() payable external {
        require(msg.sender != address(0));
        stakeInfo[msg.sender] += msg.value;
    }

    /**
       Called by the seller when the auction duration, since all bids are made offchain so the seller needs to pick the highest bid infoirmation and pass it on-chain ito this function
    */
    function executeSale(address _nft, uint256 _tokenId, address _winner, uint256 _maxBid, address[] memory _nonWinners) external {
        require(_winner != address(0));
        require(_maxBid > 0);
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(auction.duration <= block.timestamp, "Deadline did not pass yet");
        require(auction.seller == msg.sender);
        require(auction.isActive);
        auction.isActive = false;
        ERC721(_nft).safeTransferFrom(
                address(this),
                _winner,
                _tokenId
            );
        (bool success, ) = auction.seller.call{value: _maxBid}("");
        require(success);
        for(uint i = 0; i < _nonWinners.length; i++){
        require(stakeInfo[_nonWinners[i]] > 0);
        (success, ) = _nonWinners[i].call{value: stakeInfo[_nonWinners[i]]}("");
        require(success);
        }
    }

    function withdrawStake() external {
        require(msg.sender != address(0));
        require(stakeInfo[msg.sender] > 0); 
        uint amount = stakeInfo[msg.sender];
        delete stakeInfo[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
    }

    // /**
    //    Called by the seller if they want to cancel the auction for their nft so the bidders get back the locked eeth and the seller get's back the nft and the seller needs to do this tx by passing all bid info received off-chain
    // */
    function cancelAution(address _nft, uint256 _tokenId, address[] memory _bidders) external {
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(auction.seller == msg.sender);
        require(auction.isActive);
        auction.isActive = false;
        bool success;
        for (uint256 i = 0; i < _bidders.length; i++) {
        require(stakeInfo[_bidders[i]] > 0);
        (success, ) = _bidders[i].call{value: stakeInfo[_bidders[i]]}("");        
        require(success);
        }
        ERC721(_nft).safeTransferFrom(address(this), auction.seller, _tokenId);
    }

    function getTokenAuctionDetails(address _nft, uint256 _tokenId) public view returns (tokenDetails memory) {
        tokenDetails memory auction = tokenToAuction[_nft][_tokenId];
        return auction;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }

    receive() external payable {}
}

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol";
import "./SignatureChecker.sol";

contract Auction is IERC721Receiver, SignatureChecker {
    // users who want to buy art work first stake eth before bidding
    struct tokenDetails {
        address seller;
        uint128 price;
        uint256 duration;
        bool isActive;
    }

    mapping(address => mapping(uint256 => tokenDetails)) public tokenToAuction;

    mapping(address => mapping(uint256 => mapping(address => uint256))) public bids;

    constructor() {
      setCheckSignatureFlag(true);
    }

    function getStakeInfo(address _nft, uint256 _tokenId, address addr) public view returns (uint256) {
        return bids[_nft][_tokenId][addr];
    }
    
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
    function stake(address _nft, uint256 _tokenId) payable external {
        require(msg.sender != address(0));
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(msg.value >= auction.price);
        require(auction.duration > block.timestamp, "Auction for this nft has ended");
        bids[_nft][_tokenId][msg.sender] += msg.value;
    }

    /**
       Called by the seller when the auction duration, since all bids are made offchain so the seller needs to pick the highest bid infoirmation and pass it on-chain ito this function
    */
    function executeSale(address _nft, uint256 _tokenId, address bidder, uint256 amount, bytes memory sig) external {
        require(bidder != address(0));
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(bidder != auction.seller);
        require(amount <=  bids[_nft][_tokenId][bidder]);
        require(amount >= auction.price);
        require(auction.duration <= block.timestamp, "Auction hasn't ended yet");
        require(auction.seller == msg.sender);
        require(auction.isActive);
        auction.isActive = false;
        bytes32 messageHash = keccak256(abi.encodePacked(_tokenId, _nft, bidder, amount));
        bool isBidder = checkSignature(messageHash, sig, bidder);
        require(isBidder, "Invalid Bidder"); 
        // since this is individualized hence okay to delete
        delete bids[_nft][_tokenId][bidder];
        ERC721(_nft).safeTransferFrom(
                address(this),
                bidder,
                _tokenId
            );
        (bool success, ) = auction.seller.call{value: amount}("");
        require(success);
    }

    function withdrawStake(address _nft, uint256 _tokenId) external {
        require(msg.sender != address(0));
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(bids[_nft][_tokenId][msg.sender] > 0); 
        require(auction.duration <= block.timestamp, "Auction hasn't ended yet");
        uint amount = bids[_nft][_tokenId][msg.sender];
        delete bids[_nft][_tokenId][msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
    }

    // /**
    //    Called by the seller if they want to cancel the auction for their nft so the bidders get back the locked eeth and the seller get's back the nft and the seller needs to do this tx by passing all bid info received off-chain
    // */
    function cancelAuction(address _nft, uint256 _tokenId, address[] memory _bidders) external {
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(auction.seller == msg.sender);
        require(auction.isActive);
        auction.isActive = false;
        bool success;
        for (uint256 i = 0; i < _bidders.length; i++) {
        require(bids[_nft][_tokenId][_bidders[i]] > 0);
        uint amount = bids[_nft][_tokenId][_bidders[i]];
        delete bids[_nft][_tokenId][_bidders[i]];
        (success, ) = _bidders[i].call{value: amount}("");        
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

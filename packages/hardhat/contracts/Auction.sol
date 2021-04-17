pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract Auction is IERC721Receiver {
    struct tokenDetails {
        address seller;
        uint128 price;
        uint256 duration;
        uint256 maxBid;
        address maxBidUser;
        bool isActive;
        uint256[] bidAmounts;
        address[] users;
    }

    mapping(address => mapping(uint256 => tokenDetails)) public tokenToAuction;

    mapping(address => mapping(uint256 => mapping(address => uint256))) public bids;
    
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
            maxBid: 0,
            maxBidUser: address(0),
            isActive: true,
            bidAmounts: new uint256[](0),
            users: new address[](0)
        });
        address owner = msg.sender;
        ERC721(_nft).safeTransferFrom(owner, address(this), _tokenId);
        tokenToAuction[_nft][_tokenId] = _auction;
    }
    /**
       Users bid for a particular nft, the max bid is compared and set if the current bid id highest
    */
    function bid(address _nft, uint256 _tokenId) external payable {
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(msg.value >= auction.price);
        require(auction.isActive);
        require(auction.duration > block.timestamp, "Deadline already passed");
        if (bids[_nft][_tokenId][msg.sender] > 0) {
            (bool success, ) = msg.sender.call{value: bids[_nft][_tokenId][msg.sender]}("");
            require(success);
        }
        bids[_nft][_tokenId][msg.sender] = msg.value;
        if (auction.bidAmounts.length == 0) {
            auction.maxBid = msg.value;
            auction.maxBidUser = msg.sender;
        } else {
            uint256 lastIndex = auction.bidAmounts.length - 1;
            require(auction.bidAmounts[lastIndex] < msg.value, "Current max bid is higher than your bid");
            auction.maxBid = msg.value;
            auction.maxBidUser = msg.sender;
        }
        auction.users.push(msg.sender);
        auction.bidAmounts.push(msg.value);
    }
    /**
       Called by the seller when the auction duration is over the hightest bid user get's the nft and other bidders get eth back
    */
    function executeSale(address _nft, uint256 _tokenId) external {
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(auction.duration <= block.timestamp, "Deadline did not pass yet");
        require(auction.seller == msg.sender);
        require(auction.isActive);
        auction.isActive = false;
        if (auction.bidAmounts.length == 0) {
            ERC721(_nft).safeTransferFrom(
                address(this),
                auction.seller,
                _tokenId
            );
        } else {
            (bool success, ) = auction.seller.call{value: auction.maxBid}("");
            require(success);
            for (uint256 i = 0; i < auction.users.length; i++) {
                if (auction.users[i] != auction.maxBidUser) {
                    (success, ) = auction.users[i].call{
                        value: bids[_nft][_tokenId][auction.users[i]]
                    }("");
                    require(success);
                }
            }
            ERC721(_nft).safeTransferFrom(
                address(this),
                auction.maxBidUser,
                _tokenId
            );
        }
    }

    /**
       Called by the seller if they want to cancel the auction for their nft so the bidders get back the locked eeth and the seller get's back the nft
    */
    function cancelAution(address _nft, uint256 _tokenId) external {
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(auction.seller == msg.sender);
        require(auction.isActive);
        auction.isActive = false;
        bool success;
        for (uint256 i = 0; i < auction.users.length; i++) {
        (success, ) = auction.users[i].call{value: bids[_nft][_tokenId][auction.users[i]]}("");        
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
    )external override returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }

    receive() external payable {}
}

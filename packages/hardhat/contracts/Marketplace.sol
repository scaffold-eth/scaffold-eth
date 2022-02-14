//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC721Royalty.sol";

//import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    // * Utils
    using Counters for Counters.Counter;
    Counters.Counter private listingIds;

    // * State
    mapping(uint256 => Listing) public listings;
    uint256 currentPrice;

    // * Structs
    struct Listing {
        address nftContract;
        uint256 nftId;
        address payable seller;
        address payable royaltyPaidTo;
        uint256 royaltyBaseAmount;
        uint256 price;
        uint256 bid;
        bool isAuction;
        uint256 date;
        address highestBidder;
    }

    // * Events
    event ListingCreated(
        address indexed nftContract,
        uint256 indexed nftId,
        address seller,
        address royaltyPaidTo,
        uint256 royaltyAmount,
        uint256 price,
        uint256 bid,
        bool isAuction,
        uint256 date,
        address highestBidder
    );

    event Purchase(uint256 indexed itemId, address buyer, uint256 price);
    event updatedPrice(uint256 indexed itemId, address owner, uint256 price);
    event newBid(address buyer, Listing listing, uint256 bid);

    // * Owner modifier
    modifier Owned(uint256 listingId) {
        Listing memory item = listings[listingId];
        address ownerOfToken = IERC721(item.nftContract).ownerOf(item.nftId);

        require(ownerOfToken == msg.sender, "You don't own this NFT!");
        _;
    }

    constructor() {}

    // * Create Listing
    function createListing(
        address nftContract,
        uint256 nftId,
        uint256 price,
        bool isAuction,
        uint256 biddingTime
    ) public nonReentrant {
        address nftOwner = IERC721(nftContract).ownerOf(nftId);
        (address to, uint256 baseAmount) = IERC721Royalty(nftContract)
            .royaltyInfo(nftId, 1 * 10**18);
        //console.log(to, baseAmount);

        require(price > 0, "Price must be greater than 0.");
        require(nftOwner == msg.sender, "You can't sell an NFT you don't own!");
        if (isAuction)
            require(biddingTime > 0, "Auctions must have a valid date");

        listingIds.increment();
        uint256 itemId = listingIds.current();
        uint256 auctionDate = block.timestamp + biddingTime;
        uint256 startingBid = isAuction ? price : 0;

        listings[itemId] = Listing(
            nftContract,
            nftId,
            payable(msg.sender),
            payable(to),
            baseAmount / 10**14, // .05 ETH --> 500
            price,
            startingBid,
            isAuction,
            auctionDate,
            payable(address(0))
        );
        emit ListingCreated(
            nftContract,
            nftId,
            msg.sender,
            to,
            baseAmount,
            price,
            startingBid,
            isAuction,
            auctionDate,
            address(0)
        );
    }

    // eMax or ETH buy function
    function buy(uint256 listingId) public payable nonReentrant {
        Listing memory item = listings[listingId];
        address contractAddress = item.nftContract;
        address nftSeller = item.seller;
        uint256 nftId = item.nftId;
        uint256 price = item.price;
        uint256 baseRoyalty = item.royaltyBaseAmount;
        address royaltyReciever = item.royaltyPaidTo;
        // validate amount sent is enough to buy NFT
        require(
            msg.value >= price,
            "Please submit asking price in order to complete purchase"
        );

        //console.log((price * baseRoyalty) / 10000); //just royalty amount
        payable(nftSeller).transfer(price - ((price * baseRoyalty) / 10000)); // price - royalty
        payable(royaltyReciever).transfer((price * baseRoyalty) / 10000); //just royalty

        // seller must call approve on the marketplace contract for transfer
        IERC721(contractAddress).transferFrom(nftSeller, msg.sender, nftId);

        emit Purchase(listingId, msg.sender, price);
    }

    function getPrice(uint256 listingId) public view returns (uint256) {
        return listings[listingId].price;
    }

    function updatePrice(uint256 listingId, uint256 newPrice)
        public
        Owned(listingId)
    {
        listings[listingId].price = newPrice;
        emit updatedPrice(listingId, msg.sender, newPrice);
    }

    // * Add new bid and return funds to previous bidder.
    function bid(uint256 listingId) public payable nonReentrant {
        Listing storage listing = listings[listingId];

        require(listing.isAuction, "This listing is not an auction");
        require(block.timestamp < listing.date, "Auction has already ended");
        require(
            msg.value > listing.bid,
            "Bid must be greater than previous bid."
        );
        // if listing accepts EMAX send bid to marketplace contract
        // else require the msg.value to be greater than currentbid

        // transfer current bid back to previous bidder if not empty address.
        if (listing.highestBidder != address(0))
            payable(listing.highestBidder).transfer(listing.bid);
        //update current bid values
        listing.highestBidder = msg.sender;
        listing.bid = msg.value;

        emit newBid(msg.sender, listing, msg.value);
    }

    // * Get current bid
    function getCurrentBid(uint256 listingId) public view returns (uint256) {
        return listings[listingId].bid;
    }

    // * Transfer current bid to seller and NFT to winner
    function withdraw(uint256 listingId) public nonReentrant {
        Listing storage listing = listings[listingId];
        address nftContract = listing.nftContract;
        uint256 nftId = listing.nftId;
        address nftSeller = listing.seller;
        address highestBidder = listing.highestBidder;
        uint256 endBid = listing.bid;
        uint256 baseRoyalty = listing.royaltyBaseAmount;
        address royaltyPaidTo = listing.royaltyPaidTo;

        require(nftSeller == msg.sender, "You do not own this listing.");
        require(block.timestamp < listing.date, "Auction isn't over yet.");

        payable(nftSeller).transfer(endBid - ((endBid * baseRoyalty) / 10000));
        payable(royaltyPaidTo).transfer((endBid * baseRoyalty) / 10000);

        IERC721(nftContract).transferFrom(nftSeller, highestBidder, nftId);

        listing.isAuction = false;

        emit Purchase(listingId, highestBidder, endBid);
    }

    // * Manual early cancellation by seller
    function auctionCancel(uint256 listingId) public nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "You do not own this listing.");
        require(block.timestamp < listing.date, "Auction has already ended");

        if (listing.highestBidder != address(0))
            payable(listing.highestBidder).transfer(listing.bid);
        delete listings[listingId];
    }

    // * Manually remove a listing if you are the owner and the auction is set to false.
    function removeListing(uint256 listingId) public {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "You do not own this listing.");
        require(
            listing.isAuction == false,
            "You cannot remove an active auction"
        );

        delete listings[listingId];
    }

    // * Get ERC721Royalty compliance from external contract
    // Checks to see if the contract being interacted with supports royaltyInfo function
    function supportERC721Royalty(address _nftContract)
        public
        view
        returns (bool)
    {
        // check first NFT is minted.
        IERC721(_nftContract).ownerOf(1);
        // call interface to double check
        (address _to, uint256 _amount) = IERC721Royalty(_nftContract)
            .royaltyInfo(1, 1 * 10**18);
        //console.log(_to, _amount);

        if (_amount > 0) {
            return true;
        } else {
            return false;
        }
    }
}

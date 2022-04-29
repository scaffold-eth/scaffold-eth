//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// * * * TESTING ONLY * * *
//import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    // * Utils
    using Counters for Counters.Counter;
    Counters.Counter private listingIds;

    // * State
    mapping(uint256 => Listing) public listings;
    mapping(address => Royalties) public royalties; // royalty information by collection address.

    uint256 private constant BPS = 10000;

    // * Structs
    // Single NFT listing
    struct Listing {
        address nftContract;
        uint256 nftId;
        address payable seller;
        uint256 price;
        address payableCurrency;
        bool isAuction;
        uint256 date;
        address highestBidder;
    }
    // Royalty Info
    struct Royalties {
        address _nftContract;
        address payoutAccount;
        uint256 royaltyAmount;
        bool exists;
    }

    // * Events
    event ListingCreated(
        uint256 listingId,
        address indexed nftContract,
        uint256 indexed nftId,
        address seller,
        uint256 price,
        address payableCurrency,
        bool isAuction,
        uint256 date,
        address highestBidder
    );
    event Purchase(uint256 indexed itemId, address buyer, uint256 price);
    event UpdatedPrice(uint256 indexed itemId, address owner, uint256 price);
    event NewBid(address buyer, Listing listing, uint256 newBid);

    // * Modifiers
    modifier Owned(uint256 listingId) {
        Listing memory item = listings[listingId];
        address ownerOfToken = IERC721(item.nftContract).ownerOf(item.nftId);

        require(ownerOfToken == msg.sender, "You don't own this NFT!");
        _;
    }

    // * Constructor
    constructor() {}

    // * Create Listing
    function createListing(
        address nftContract,
        uint256 nftId,
        uint256 price,
        address payableCurrency,
        bool isAuction,
        uint256 biddingTime
    ) public nonReentrant {
        require(price > 0, "Price must be greater than 0.");
        address nftOwner = IERC721(nftContract).ownerOf(nftId);
        require(nftOwner == msg.sender, "You can't sell an NFT you don't own!");
        if (isAuction) {
            require(biddingTime > 0, "Auctions must have a valid date");
        }

        listingIds.increment();
        uint256 itemId = listingIds.current();
        uint256 auctionDate = block.timestamp + biddingTime;

        listings[itemId] = Listing(
            nftContract,
            nftId,
            payable(msg.sender),
            price,
            payableCurrency,
            isAuction,
            auctionDate,
            payable(address(0))
        );
        emit ListingCreated(
            itemId,
            nftContract,
            nftId,
            msg.sender,
            price,
            payableCurrency,
            isAuction,
            auctionDate,
            address(0)
        );
    }

    // IERC20 buy function
    // Buy a listing using an ERC20 accepted by the marketplace.
    function buy(uint256 listingId) public payable nonReentrant {
        Listing memory item = listings[listingId];
        address contractAddress = item.nftContract;
        address nftSeller = item.seller;
        uint256 nftId = item.nftId;
        uint256 price = item.price;
        address payableCurrency = item.payableCurrency;
        uint256 baseRoyalty = royalties[contractAddress].royaltyAmount;
        address royaltyReceiver = royalties[contractAddress].payoutAccount;
        require(msg.sender != nftSeller, "You cannot buy and NFT you are selling.");
        require(contractAddress != address(0), "Listing does not exist.");
        require(item.isAuction == false, "This listing is designated for auction.");

        // validate amount sent is enough to buy NFT
        require(
            msg.value >= price,
            "Please submit asking price in order to complete purchase"
        );

        // transfer NFT to the buyer
        IERC721(contractAddress).safeTransferFrom(nftSeller, msg.sender, nftId);
        // transfer sale proceeds to seller
        IERC20(payableCurrency).transferFrom(msg.sender, nftSeller, price - ((price * baseRoyalty) / BPS)); // price - royalty
        // transfer royalty proceeds to the royalty receiver
        IERC20(payableCurrency).transferFrom(msg.sender, royaltyReceiver, (price * baseRoyalty) / BPS); //just royalty

        emit Purchase(listingId, msg.sender, price);
    }

    // * Get current listing price
    function getPrice(uint256 listingId) public view returns (uint256) {
        return listings[listingId].price;
    }

    // * Update listing price, listing cannot be on auction.
    function updatePrice(uint256 listingId, uint256 newPrice)
        public
        Owned(listingId)
    {
        require(listings[listingId].isAuction == false, "Auction starting prices cannot be updated");

        // set new price
        listings[listingId].price = newPrice;

        emit UpdatedPrice(listingId, msg.sender, newPrice);
    }

    // * New bid and return funds to previous bidder
    function bid(uint256 listingId, uint256 amount) public payable nonReentrant {
        Listing storage listing = listings[listingId];
        uint256 currentBid = listing.price;
        address highestBidder = listing.highestBidder;
        address payableCurrency = listing.payableCurrency;
        require(msg.sender != listing.seller, "You cannot buy and NFT you are selling.");
        require(listing.isAuction, "This listing is not an auction");
        require(block.timestamp < listing.date, "Auction has already ended");
        require(
            amount > listing.price,
            "Bid must be greater than previous bid."
        );

        // ESCROW payment in the marketplace contract
        IERC20(payableCurrency).transferFrom(msg.sender, address(this), amount);
        // transfer current bid back to previous bidder if not empty address.
        if (listing.highestBidder != address(0))
            IERC20(payableCurrency).transferFrom(address(this), highestBidder, currentBid);
        // update to new bid values
        listing.highestBidder = msg.sender;
        listing.price = amount;

        emit NewBid(msg.sender, listing, amount);
    }

    // * Withdraw
    // After Auction has ended, NFT seller or highest bidder can call this function to
    // initiate the distribution of funds to seller and royalty receiver.
    function withdraw(uint256 listingId) public nonReentrant {
        Listing storage listing = listings[listingId];
        address contractAddress = listing.nftContract;
        uint256 nftId = listing.nftId;
        address nftSeller = listing.seller;
        address highestBidder = listing.highestBidder;
        uint256 endBid = listing.price;
        uint256 baseRoyalty = royalties[contractAddress].royaltyAmount;
        address royaltyReceiver = royalties[contractAddress].payoutAccount;
        address payableCurrency = listing.payableCurrency;
        uint256 sellerAmount = endBid - ((endBid * baseRoyalty) / BPS);
        uint256 royaltyRecAmount = (endBid * baseRoyalty) / BPS;
        require(msg.sender == nftSeller || msg.sender == highestBidder, "Only the seller or highest bidder can withdraw.");

        IERC721(contractAddress).safeTransferFrom(
            nftSeller,
            highestBidder,
            nftId
        );
        IERC20(payableCurrency).transfer(nftSeller, sellerAmount);
        IERC20(payableCurrency).transfer(royaltyReceiver, royaltyRecAmount);

        // update listing status
        listing.isAuction = false;

        emit Purchase(listingId, highestBidder, endBid);
    }

    // * Auction Cancel
    // Manual cancel the auction early, only callable by NFT Owner
    // This assumes the NFT owner is also the account which created the listing
    function auctionCancel(uint256 listingId)
        public
        Owned(listingId)
        nonReentrant
    {
        Listing storage listing = listings[listingId];
        require(block.timestamp < listing.date, "Auction has already ended");
        // if there is a highestBidder, transfer them back their bid.
        if (listing.highestBidder != address(0))
            payable(listing.highestBidder).transfer(listing.price);

        delete listings[listingId];
    }

    // * Remove Listing
    // Manually remove a listing if you are the owner and not surrently on auction
    function removeListing(uint256 listingId) public Owned(listingId) {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "You do not own this listing.");
        require(
            listing.isAuction == false,
            "You cannot remove an active auction"
        );

        delete listings[listingId];
    }

    // ============ UTILITIES ==============

    // * Set Royalty info
    // NFT collections deployer account to be the caller
    // The payoutAccount given will be where royalties are sent
    function setNFTCollectionRoyalty(
        address contractAddress,
        address payoutAccount,
        uint256 royaltyAmount
    ) public returns (bool) {
        require(
            !royalties[contractAddress].exists,
            "Collection already has royalty info set."
        );
        require(
            royaltyAmount > 0 && royaltyAmount <= 5000,
            "Please set a royalty amount between 0.01% and 50%"
        );
        require(payoutAccount  != address(0), "Royalties should not be burned.");
        // set royalties
        royalties[contractAddress] = Royalties(
            contractAddress,
            payoutAccount,
            royaltyAmount,
            true
        );

        return true;
    }

    // * Remove ERC20 from contract
    // Manually remove an ERC20 that gets sent to marketplace
    // contract which is not the main payment token.
    // Only callable by the contract owner.
    function removeERC20Stuck(
        address to,
        IERC20 currency,
        uint256 amount
    ) public onlyOwner {
        IERC20(currency).transferFrom(address(this), to, amount);
    }

    // ========= Receive =============
    // Needed for contract to receive funds
    receive() external payable {}
}

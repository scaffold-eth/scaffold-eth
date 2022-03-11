//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

//reentrancy add to buy and bid
//    ERC721 transferFrom first before erc20 transfer - DONE
//    require owner of NFT is the lister
//    use safeTransferFrom, ERC721 - DONE
//Collection royalties
//    only contract owner can set struct.
//    Since there is no way to determine a NFT contract owner for all contracts with different access controlls.
//    struct has collection owner address, and royalty amount - DONE
//    marketplace royalty for all transfers, similar to OpenSea service fee
//EIP712 signing messages for bidding
//refund additional amount if too much is sent in the buy tx - DONE
//remove stuck ERC20s - DONE
//change to IERC20/ WETH not ETH/msg.value

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    // * Utils
    using Counters for Counters.Counter;
    Counters.Counter private listingIds;

    // * State
    mapping(uint256 => Listing) public listings; // listingId to listing state
    mapping(address => Collection) public collections; // NFt contract address to collection state
    uint256 marketplaceFee; // optional: set a marketplace fee which is subtracted everytime a NFT trades hands
    uint256 royaltyDenominator = 10000; // enables two decimals for setting sales royalty percentage.

    // * Structs
    // Single NFT listing
    struct Listing {
        address nftContract;
        uint256 nftId;
        address payable seller;
        uint256 price;
        uint256 bid;
        bool isAuction;
        uint256 date;
        address highestBidder;
    }
    // NFT collection
    struct Collection {
        address payable royaltyPaidTo;
        uint256 royaltyPercent;
    }

    // * Events
    event ListingCreated(
        address indexed nftContract,
        uint256 indexed nftId,
        address seller,
        uint256 price,
        uint256 bid,
        bool isAuction,
        uint256 date,
        address highestBidder
    );
    event Purchase(uint256 indexed itemId, address buyer, uint256 price);
    event updatedPrice(uint256 indexed itemId, address owner, uint256 price);
    event newBid(address buyer, Listing listing, uint256 bid);

    // * Listing owner modifier
    modifier Owned(uint256 listingId) {
      Listing memory item = listings[listingId];
      address ownerOfToken = IERC721(item.nftContract).ownerOf(item.nftId);

      require(ownerOfToken == msg.sender, "You don't own this NFT!");
      _;
    }

    // * Constructor
    constructor() {}

    // ============ CORE MARKETPLACE ==============

    // * Create NFT collection based on contract address. Only collection owner can call.
    // 2.50% = 250
    function createCollection(address nftContract, uint256 _royaltyPercent) public onlyOwner returns(bool) {
      // only collection owner
      require(_royaltyPercent > 0, "Royalty amount must be greater than 0");
      // update collection state
      collections[nftContract] = Collection(
          payable(msg.sender),
          _royaltyPercent
      );
      return true;
    }

    // * Get NFT collection details
    function getCollectionProperties(address nftContract) public view returns(address, uint256) {
      Collection storage collection = collections[nftContract];
      require(collection.royaltyPercent > 0, "This ERC721 NFT collection has not been set up yet.");

      return(collection.royaltyPaidTo, collection.royaltyPercent);
    }

    // * Create Listing
    function createListing(
      address nftContract,
      uint256 nftId,
      uint256 price,
      bool isAuction,
      uint256 biddingTime
    ) public nonReentrant returns(bool){
      require(price > 0, "Price must be greater than 0.");
      // Require owner of NFT to be the msg.sender of tx
      address nftOwner = IERC721(nftContract).ownerOf(nftId);
      require(nftOwner == msg.sender, "You cannot sell an NFT you do not own!");
      // validate auction bidding time if applicable
      if (isAuction)
          require(biddingTime > 0, "Auctions must have a valid date");

      // Get next listingId
      listingIds.increment();
      uint256 itemId = listingIds.current();
      uint256 auctionDate = block.timestamp + biddingTime;
      uint256 startingBid = isAuction ? price : 0;
      // update listing state
      listings[itemId] = Listing(
          nftContract,
          nftId,
          payable(msg.sender),
          price,
          startingBid,
          isAuction,
          auctionDate,
          payable(address(0))
      );
      //emit event with listing and royalty info
      emit ListingCreated(
          nftContract,
          nftId,
          msg.sender,
          price,
          startingBid,
          isAuction,
          auctionDate,
          address(0)
      );

      return true;
    }

    // * Get current listing price
    function getPrice(uint256 listingId) public view returns (uint256) {
        return listings[listingId].price;
    }

    // * only listing creator can update listing price
    function updatePrice(uint256 listingId, uint256 newPrice) public Owned(listingId) {
      listings[listingId].price = newPrice;
      emit updatedPrice(listingId, msg.sender, newPrice);
    }

    // * Buy listing function
    function buy(uint256 listingId) public payable nonReentrant {
      // load listing properties if listing exists
      require(listings[listingId].nftId > 0, "ListingId does not exist.");
      Listing memory item = listings[listingId];
      address contractAddress = item.nftContract;
      address nftSeller = item.seller;
      uint256 nftId = item.nftId;
      uint256 price = item.price;

      // Get collection roylaty info if applicable
      (address royaltyPaidTo, uint256 royaltyPercent) = getCollectionProperties(contractAddress);

      // validate amount sent is enough to buy NFT
      require(
          msg.value >= price,
          "Please submit asking price in order to complete purchase"
      );

      if(royaltyPercent > 0) {
        // seller must call approve on the marketplace contract first for transfer
        IERC721(contractAddress).safeTransferFrom(nftSeller, msg.sender, nftId);
        //console.log((price * baseRoyalty) / 10000); //just royalty amount
        payable(nftSeller).transfer(price - ((price * royaltyPercent) / 10000)); // price - royalty
        payable(royaltyPaidTo).transfer((price * royaltyPercent) / 10000); //just royalty
      } else {
        // seller must call approve on the marketplace contract first for transfer
        IERC721(contractAddress).safeTransferFrom(nftSeller, msg.sender, nftId);

        payable(nftSeller).transfer(price); // price only
      }

      // refund ETH if more sent than the listing price.
      refundIfOver(price);

      emit Purchase(listingId, msg.sender, price);
    }

    // * Add new bid and return funds to previous bidder.
    function bid(uint256 listingId) public payable nonReentrant {
      Listing storage listing = listings[listingId];
      //ensure auction listing
      require(listing.isAuction, "This listing is not an auction");
      // ensure auction not over
      require(block.timestamp < listing.date, "Auction has already ended");
      //require new bid to be greater than the previous bid held in state
      require(msg.value > listing.bid, "Bid must be greater than previous bid.");

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
      address contractAddress = listing.nftContract;
      uint256 nftId = listing.nftId;
      address nftSeller = listing.seller;
      address highestBidder = listing.highestBidder;
      uint256 endBid = listing.bid;

      Collection storage collection = collections[contractAddress];
      uint256 royaltyPercent = collection.royaltyPercent;
      address royaltyPaidTo = collection.royaltyPaidTo;

      require(nftSeller == msg.sender, "You do not own this listing.");
      require(block.timestamp < listing.date, "Auction isn't over yet.");

      if(royaltyPercent > 0) {
        // seller must call approve on the marketplace contract first for transfer
        IERC721(contractAddress).safeTransferFrom(nftSeller, highestBidder, nftId);
        //console.log((price * baseRoyalty) / 10000); //just royalty amount
        payable(nftSeller).transfer(endBid - ((endBid * royaltyPercent) / 10000)); // price - royalty
        payable(royaltyPaidTo).transfer((endBid * royaltyPercent) / 10000); //just royalty
      } else {
        // seller must call approve on the marketplace contract first for transfer
        IERC721(contractAddress).safeTransferFrom(nftSeller, highestBidder, nftId);

        payable(nftSeller).transfer(endBid); // price only
      }

      //update listing status
      listing.isAuction = false;

      emit Purchase(listingId, highestBidder, endBid);
    }

    // * Manual early cancellation by seller
    function auctionCancel(uint256 listingId) public nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "You do not own this listing.");
        require(block.timestamp < listing.date, "Auction has already ended");
        // if there is a highestBidder, transfer them back their bid.
        if (listing.highestBidder != address(0))
            payable(listing.highestBidder).transfer(listing.bid);

        delete listings[listingId];
    }

    // * Manually remove a listing if you are the owner and the auction is set to false.
    function removeListing(uint256 listingId) public {
      Listing storage listing = listings[listingId];
      require(listing.seller == msg.sender, "You do not own this listing.");
      require(listing.isAuction == false, "You cannot remove an active auction");

      delete listings[listingId];
    }

    // ============ UTILITIES ==============

    // * If msg.value is greater than listing price in ETH, refund the difference
    function refundIfOver(uint256 price) private {
      require(msg.value >= price, "Need to send more ETH.");
      if (msg.value > price) {
        payable(msg.sender).transfer(msg.value - price);
      }
    }

    // * Remove tokens sent to the contract erroneously.
    function inCaseERC20GetsStuck(
        address to,
        IERC20 currency,
        uint256 amount
    ) public onlyOwner {
        IERC20(currency).transferFrom(address(this), to, amount);
    }
}

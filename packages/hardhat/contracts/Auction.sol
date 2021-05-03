pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ECRecovery {

    /**
    * @dev Recover signer address from a message by using their signature
    * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
    * @param sig bytes signature, the signature is generated using web3.eth.sign()
    */
    function recover(bytes32 hash, bytes memory sig) internal pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        //Check the signature length
        if (sig.length != 65) {
            return (address(0));
        }

        // Divide the signature in r, s and v variables
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            return ecrecover(hash, v, r, s);
        }
    }
}

contract Auction is IERC721Receiver, ECRecovery {
    struct tokenDetails {
        address seller;
        uint128 price;
        uint256 duration;
        bool isActive;
    }

    struct Bid { 
        uint256 id;
        address nft;
        address bidder;
        uint256 amount;
    }

    struct SignedBid {
        Bid bid;
        bytes sig;
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
    function executeSale(address _nft, uint256 _tokenId, SignedBid calldata signedBid) external {
        require(signedBid.bid.bidder != address(0));
        require(signedBid.bid.amount > 0);
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(auction.duration <= block.timestamp, "Deadline did not pass yet");
        require(auction.seller == msg.sender);
        require(auction.isActive);
        auction.isActive = false;
        verifyBidSignature(_tokenId, _nft, signedBid.bid.bidder, signedBid.bid.amount, signedBid.sig);
        ERC721(_nft).safeTransferFrom(
                address(this),
                signedBid.bid.bidder,
                _tokenId
            );
        (bool success, ) = auction.seller.call{value: signedBid.bid.amount}("");
        require(success);
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

    bytes32 constant PACKET_TYPEHASH = keccak256(
    "Bid(uint256 id, address nft, address bidder,uint256 amount)"
    );
        
    function getPacketTypehash()  external pure returns (bytes32) {
        return PACKET_TYPEHASH;
    }

    function getPacketHash(uint256 id, address nft, address bidderAddress,uint256 amount) public pure returns (bytes32) {
        return keccak256(abi.encode(
            PACKET_TYPEHASH,
            id,
            nft,
            bidderAddress,
            amount
        ));
    }

    function getTypedDataHash(uint256 id, address nft, address bidderAddress,uint256 amount) public pure returns (bytes32) {
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            getPacketHash(id,nft,bidderAddress,amount)
        ));
        return digest;
    }

    function verifyBidSignature(uint256 id, address nft, address bidderAddress,uint256 amount, bytes memory offchainSignature) public pure returns (bool) {
        bytes32 sigHash = getTypedDataHash(id, nft,bidderAddress,amount);
        address recoveredSignatureSigner = recover(sigHash,offchainSignature);
        require(bidderAddress == recoveredSignatureSigner, 'Invalid signature');
        return true;
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

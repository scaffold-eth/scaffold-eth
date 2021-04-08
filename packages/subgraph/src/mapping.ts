import { Bytes, ByteArray, Address, Value, JSONValue, ipfs, log, json, TypedMap, ethereum, BigInt } from "@graphprotocol/graph-ts"

import {
    GoodToken,
    ArtworkMinted,
    Transfer as TransferEvent
} from '../generated/GoodToken/GoodToken'

import {
    FundCreated
} from '../generated/GoodTokenFund/GoodTokenFund';

import {
    FeedDataUpdated,
    FeedRegistered
} from '../generated/GoodDataFeed/GoodDataFeed';


import {
    Contract,
    Artist,
    Artwork,
    Fund,
    Feed,
    Transfer,
} from "../generated/schema"


function setContractAdrress(event: ethereum.Event): void {
    // get contract address
    let contractAddress = event.address
    
    // check if contract is stored already
    let contract = Contract.load('CONTRACT')

    // store address singleton
    if(contract == null) {
        let contract = new Contract('CONTRACT') 
        contract.address = contractAddress
        contract.save()
    }
        
}

function getContractAddress(): (Bytes | null) {
    let contract = Contract.load('CONTRACT')

    if(contract == null) {
        return null
    }

    return contract.address
}


export function handleArtworkMinted(event: ArtworkMinted): void {
    setContractAdrress(event)
    
    // fetch artwork data
    log.info('Fetching IPFS CID {}', [event.params.artworkCid]);
    let artworkPayload = ipfs.cat('/ipfs/' + event.params.artworkCid.toString());  
    let artworkMetadata:TypedMap<string, JSONValue>
    artworkMetadata = json.fromBytes(artworkPayload as Bytes).toObject()

    // get artist address and create entity if needed
    let artistAddress = event.params.artist.toHexString()
    
    let artist = Artist.load(artistAddress)

    if (artist == null) {
      artist = new Artist(artistAddress)
      artist.address = event.params.artist
      artist.createdAt = event.block.timestamp
      
      artist.name = artworkMetadata.get('artistName').toString()

      artist.save()
    }
 
    // load or create fund entity
    let beneficiaryAddress = event.params.targetTokenAddress.toHexString()
    let targetFundTokenId = event.params.targetTokenId.toString()

    // create new artwork entity
    let artworkId = event.params.artwork
    let artwork = new Artwork(artworkId.toString())
    artwork.tokenId = artworkId
    artwork.artist = artistAddress
    artwork.fund = targetFundTokenId
    artwork.price = event.params.price
    artwork.revoked = false
    artwork.artworkCid = event.params.artworkCid
    artwork.artworkRevokedCid = event.params.artworkRevokedCid
    artwork.createdAt = event.block.timestamp
    artwork.owner = event.params.artist
    artwork.ownershipModel = event.params.ownershipModel
    artwork.balanceRequirement = event.params.balanceRequirement
    artwork.balanceDurationInSeconds = event.params.balanceDurationInSeconds

    if(artworkPayload != null) {
        artwork.name = artworkMetadata.get('name').toString()
        artwork.desc = artworkMetadata.get('description').toString()
        artwork.artworkImageUrl = artworkMetadata.get('image').toString()


    }
    
    let artworkRevokedPayload = ipfs.cat('/ipfs/' + event.params.artworkRevokedCid.toString())
    let artworkRevokedMetadata:TypedMap<string, JSONValue>
    
    if(artworkRevokedPayload != null) {
        artworkRevokedMetadata = json.fromBytes(artworkRevokedPayload as Bytes).toObject()
        artwork.artworkRevokedImageUrl = artworkRevokedMetadata.get('image').toString()
    }

    artwork.save()

}

export function handleTransfer(event: TransferEvent): void {
    setContractAdrress(event)
    
    // creata new transfer record
    let transfer = new Transfer(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
    transfer.createdAt = event.block.timestamp
    transfer.artwork = event.params.tokenId.toString()
    transfer.to = event.params.to
    transfer.from = event.params.from

    transfer.save()

    let artwork = Artwork.load(transfer.artwork)

    if(artwork == null) return
    
    artwork.revoked = false
    artwork.owner = event.params.to
    artwork.save()
}

export function handleBlock(block: ethereum.Block): void {
    let contractAddress = getContractAddress()

    if(contractAddress == null) {
        return
    }

    // bind entity to contract state
    let goodToken = GoodToken.bind(contractAddress as Address)

    let tokenSupply = goodToken.totalSupply().toI32()

    
    for (let token = 0; token < tokenSupply; token++) {
        let revoked = goodToken.canRevoke(BigInt.fromI32(token)) || 
            goodToken.isRevoked(BigInt.fromI32(token))
        
        let artwork = new Artwork(token.toString())
        artwork.revoked = revoked
        artwork.save()
    }
}

export function handleFundCreated(event: FundCreated): void {

    let tokenId = event.params.tokenId
    let fundId = tokenId.toString()
    let fund = Fund.load(fundId)
    
    if(fund == null) {
        fund = new Fund(fundId);
        fund.tokenId = tokenId;
        fund.createdAt = event.block.timestamp
        fund.beneficiary = event.params.beneficiary
    }
    
    // add in additional data via ipfs
    let fundPayload = ipfs.cat('/ipfs/' + event.params.metadataCid.toString());  
    if(fundPayload != null) {
        let fundMetadata:TypedMap<string, JSONValue>
        fundMetadata = json.fromBytes(fundPayload as Bytes).toObject();
        fund.symbol = fundMetadata.get('symbol').toString();
        fund.name = fundMetadata.get('name').toString();
        fund.description = fundMetadata.get('description').toString();
        fund.feed = fundMetadata.get('targetFeedId').toString();
        fund.image = fundMetadata.get('image').toString();
        fund.rangeMin = fundMetadata.get('rangeMin').toBigInt();
        fund.rangeMax = fundMetadata.get('rangeMax').toBigInt();
    }

    fund.save();
}

export function handleFeedRegistered(event: FeedRegistered): void {

    let feedId = event.params.feedId;

    let feed = Feed.load(feedId);
    if(feed == null) {
        feed = new Feed(feedId);
        feed.name = event.params.name;
        feed.description = event.params.description;
        feed.url = event.params.apiBaseUrl
        feed.yearOffset = event.params.yearOffset    
        feed.createdAt = event.block.timestamp
        if(event.params.yearOffset.equals(BigInt.fromI32(2))){
            feed.value = BigInt.fromI32(90)
        }
        else if(event.params.yearOffset.equals(BigInt.fromI32(3))){
            feed.value = BigInt.fromI32(10)
        }
        else {
            feed.value = BigInt.fromI32(8)
        }
    }

    feed.save();
}

export function handleFeedDataUpdated(event: FeedDataUpdated): void {

    let feedId = event.params.feedId;

    let feed = Feed.load(feedId);
    if(feed == null) 
        return
    
    let latestData = event.params.latestFeedData

    // let feedRecord = new FeedRecord()
    feed.value = latestData //feedRecord

    feed.save();
}
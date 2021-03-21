import { BigInt, Bytes, Address, Value, JSONValue, ipfs, log, json, TypedMap, ethereum } from "@graphprotocol/graph-ts"

import {
    GoodToken,
    ArtworkMinted,
    ArtworkRevoked,
    Transfer as TransferEvent
} from '../generated/GoodToken/GoodToken'

import {
    Contract,
    Artist,
    Artwork,
    Beneficiary,
    Transfer,
    Revocation
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

    // get artist address and create entity if needed
    let artistAddress = event.params.artist.toHexString()

    let artist = Artist.load(artistAddress)

    if (artist == null) {
      artist = new Artist(artistAddress)
      artist.address = event.params.artist
      artist.createdAt = event.block.timestamp

      artist.save()
    }
 
    // load or create fund entity
    let beneficiaryAddress = event.params.beneficiaryAddress.toHexString()

    let beneficiary = Beneficiary.load(beneficiaryAddress)
  
    if (beneficiary == null) {
        beneficiary = new Beneficiary(beneficiaryAddress)
        beneficiary.address = event.params.beneficiaryAddress
        beneficiary.createdAt = event.block.timestamp
        beneficiary.name = event.params.beneficiaryName
        beneficiary.symbol = event.params.beneficiarySymbol

        beneficiary.save()
    }

    // create new artwork entity
    let artworkId = event.params.artwork
    let artwork = new Artwork(artworkId.toString())
    artwork.tokenId = artworkId
    artwork.artist = artistAddress
    artwork.beneficiary = beneficiaryAddress
    artwork.price = event.params.price
    artwork.revoked = false
    artwork.artworkCid = event.params.artworkCid
    artwork.artworkRevokedCid = event.params.artworkRevokedCid
    artwork.createdAt = event.block.timestamp

    // fetch artwork data
    log.info('Fetching IPFS CID {}', [event.params.artworkCid]);
    let artworkPayload = ipfs.cat('/ipfs/' + event.params.artworkCid.toString());  
    let artworkMetadata:TypedMap<string, JSONValue>

    if(artworkPayload != null) {
        artworkMetadata = json.fromBytes(artworkPayload as Bytes).toObject()
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

export function handleArtworkRevoked(event: ArtworkRevoked): void {
    setContractAdrress(event)

    // creata new revocation record
    let revocation = new Revocation(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
    revocation.createdAt = event.block.timestamp
    revocation.artwork = event.params.tokenId.toString()
    revocation.owner = event.params.revokedFrom

    revocation.save()
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
        let revoked = goodToken.isRevoked(BigInt.fromI32(token))
        
        let artwork = new Artwork(token.toString())
        artwork.revoked = revoked
        artwork.save()
    }
}
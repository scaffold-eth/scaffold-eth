import { BigInt, Bytes, Address, Value, JSONValue, ipfs, log, json } from "@graphprotocol/graph-ts"

import {
    GoodToken,
    ArtworkMinted,
    ArtworkRevoked,
    Transfer as TransferEvent
} from '../generated/GoodToken/GoodToken'

import {
    Artist,
    Artwork,
    Beneficiary,
    Transfer,
    Revocation
} from "../generated/schema"

export function handleArtworkMinted(event: ArtworkMinted): void {

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

    // fetch artwork data
    log.info('Fetching IPFS CID {}', [event.params.artworkUrl]);
    const artworkMetadata = ipfs.cat(event.params.artworkUrl.toString());
    if(artworkMetadata != null)
        log.info('IPFS Data: {}', [artworkMetadata.toString()]);

    
    // // fetch revoked artwork data
    log.info('Fetching IPFS CID {}', [event.params.artworkRevokedUrl]);
    const revokedkMetadata = ipfs.cat(event.params.artworkUrl.toString());
    if(revokedkMetadata != null)
        log.info('IPFS Data: {}', [revokedkMetadata.toString()]);


    let artwork = new Artwork(artworkId.toString())
    artwork.tokenId = artworkId
    artwork.artist = artistAddress
    artwork.beneficiary = beneficiaryAddress
    artwork.price = event.params.price
    artwork.artworkUrl = event.params.artworkUrl
    artwork.revokedurl = event.params.artworkRevokedUrl
    artwork.createdAt = event.block.timestamp
    artwork.save()

}

export function handleArtworkMetadata(value: JSONValue, artwork: Value): void {
    log.info('IPFS Data: {}', [value.toString()]);
}

export function handleArtworkRevoked(event: ArtworkRevoked): void {
    // creata new revocation record
    let revocation = new Revocation(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
    revocation.createdAt = event.block.timestamp
    revocation.artwork = event.params.tokenId.toString()
    revocation.owner = event.params.revokedFrom

    revocation.save()
}

export function handleTransfer(event: TransferEvent): void {
    // creata new transfer record
    let transfer = new Transfer(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
    transfer.createdAt = event.block.timestamp
    transfer.artwork = event.params.tokenId.toString()
    transfer.to = event.params.to
    transfer.from = event.params.from

    transfer.save()
}
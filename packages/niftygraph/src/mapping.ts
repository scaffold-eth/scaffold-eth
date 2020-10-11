import { BigInt, Address, ipfs, json, JSONValueKind, log } from "@graphprotocol/graph-ts"
import {
  NiftyInk,
  newInk,
  SetPriceCall,
  SetPriceFromSignatureCall,
  newInkPrice
} from "../generated/NiftyInk/NiftyInk"
import {
  NiftyToken,
  mintedInk,
  Transfer,
  SetTokenPriceCall,
  boughtInk,
  newTokenPrice
} from "../generated/NiftyToken/NiftyToken"
import {
  NiftyMediator,
  newPrice,
  tokenSentViaBridge
} from "../generated/NiftyMediator/NiftyMediator"
import { Ink, Artist, Token, TokenTransfer, Sale, RelayPrice, Total, MetaData } from "../generated/schema"


 function updateMetaData(metric: String, value: String): void {
   let metaData = new MetaData(metric)
   metaData.value = value
   metaData.save()
 }

 function incrementTotal(metric: String, timestamp: BigInt): void {

    let stats = Total.load("latest")
    let day = (timestamp / BigInt.fromI32(86400)) * BigInt.fromI32(86400)

    if (stats == null) {
      stats = new Total("latest")
    } else {
      if (stats.day !== day) {
        let yesterdayStats = stats
        yesterdayStats.id = stats.day.toString()
        yesterdayStats.save()
        stats.id = "latest"
      }
    }

    stats.day = day

    if(metric == 'inks') {
      stats.inks = stats.inks + BigInt.fromI32(1)
    }
    else if (metric == 'tokens') {
      stats.tokens = stats.tokens + BigInt.fromI32(1)
    }
    else if (metric == 'upgrades') {
      stats.upgrades = stats.upgrades + BigInt.fromI32(1)
    }
    else if (metric == 'sales') {
      stats.sales = stats.sales + BigInt.fromI32(1)
    }
    else if (metric == 'artists') {
      stats.artists = stats.artists + BigInt.fromI32(1)
    }

    stats.save()
  }

export function handlenewInk(event: newInk): void {

  let artist = Artist.load(event.params.artist.toHexString())

  if (artist == null) {
    artist = new Artist(event.params.artist.toHexString())
    artist.address = event.params.artist
    artist.inkCount = BigInt.fromI32(1)
    incrementTotal('artists',event.block.timestamp)
  }
  else {
    artist.inkCount = artist.inkCount.plus(BigInt.fromI32(1))
  }

  let ink = Ink.load(event.params.inkUrl)

  if (ink == null) {
    ink = new Ink(event.params.inkUrl)
  }

//  let jsonBytes = ipfs.cat(event.params.jsonUrl)
//  if (jsonBytes !== null) {
//    let data = json.fromBytes(jsonBytes!);
//    if (data !== null) {
//      if (data.kind !== JSONValueKind.OBJECT) {
//        log.debug('[mapping] [loadIpfs] JSON data from IPFS is not an OBJECT', [
//        ]);
//    } else {
//        let obj = data.toObject();
//        ink.name = obj.get("name").toString();
//        ink.image = obj.get("image").toString();
//        ink.description = obj.get("description").toString();
//      }
//  }
//  }

  ink.inkNumber = event.params.id
  ink.artist = artist.id
  ink.limit = event.params.limit
  ink.jsonUrl = event.params.jsonUrl
  ink.createdAt = event.block.timestamp

  ink.save()
  artist.save()

  incrementTotal('inks',event.block.timestamp)
  updateMetaData('blockNumber',event.block.number.toString())
}

function _handleSetPrice(inkUrl: String, price: BigInt, timestamp: BigInt): void {

  let ink = Ink.load(inkUrl)

  ink.mintPrice = price
  ink.mintPriceSetAt = timestamp
  ink.mintPriceNonce = ink.mintPriceNonce + BigInt.fromI32(1)

  ink.save()
}

export function handleSetPriceFromSignature(call: SetPriceFromSignatureCall): void {
  _handleSetPrice(call.inputs.inkUrl, call.inputs.price, call.block.timestamp)
  updateMetaData('blockNumber',call.block.number.toString())
}

export function handleSetPrice(call: SetPriceCall): void {
  _handleSetPrice(call.inputs.inkUrl, call.inputs.price, call.block.timestamp)
  updateMetaData('blockNumber',call.block.number.toString())
}

export function handleNewInkPrice(event: newInkPrice): void {

  let ink = Ink.load(event.params.inkUrl)

  ink.mintPrice = event.params.price
  ink.mintPriceSetAt = event.block.timestamp
  ink.mintPriceNonce = ink.mintPriceNonce + BigInt.fromI32(1)

  ink.save()
  updateMetaData('blockNumber',event.block.number.toString())
}

export function handleNewTokenPrice(event: newTokenPrice): void {

  let token = Token.load(event.params.id.toString())

  token.price = event.params.price
  token.priceSetAt = event.block.timestamp

  token.save()
  updateMetaData('blockNumber',event.block.number.toString())
}

export function handleSetTokenPrice(call: SetTokenPriceCall): void {

  let token = Token.load(call.inputs._tokenId.toString())

  token.price = call.inputs._price
  token.priceSetAt = call.block.timestamp

  token.save()
  updateMetaData('blockNumber',call.block.number.toString())
}

export function handleMintedInk(event: mintedInk): void {

  let ink = Ink.load(event.params.inkUrl)

  if (ink == null) {
    ink = new Ink(event.params.inkUrl)
  }

  ink.count = ink.count.plus(BigInt.fromI32(1))

  let token = new Token(event.params.id.toString())

  token.ink = event.params.inkUrl
  token.owner = event.params.to
  token.createdAt = event.block.timestamp
  token.network = "xdai"

  ink.save()
  token.save()

  incrementTotal('tokens',event.block.timestamp)
  updateMetaData('blockNumber',event.block.number.toString())
}

export function handleTransfer(event: Transfer): void {

  let tokenId = event.params.tokenId.toString()

  let token = Token.load(tokenId)

  if (token !== null) {
    token.owner = event.params.to
    token.price = null
    token.priceSetAt = null
    token.save()
    updateMetaData('blockNumber',event.block.number.toString())
  }

  let transfer = new TokenTransfer(event.transaction.hash.toHex())

  transfer.token = tokenId
  transfer.to = event.params.to
  transfer.from = event.params.from
  transfer.createdAt = event.block.timestamp

  if(event.address == Address.fromString("0xCF964c89f509a8c0Ac36391c5460dF94B91daba5")) {
    transfer.network = 'xdai'
  }
  if(event.address == Address.fromString("0xc02697c417DdAcfbe5EdbF23eDad956BC883F4fb")) {
    transfer.network = 'mainnet'
  } else {
    transfer.network = 'local'
  }

  transfer.save()
  updateMetaData('blockNumber',event.block.number.toString())
}

export function handleBoughtInk(event: boughtInk): void {

  let sale = new Sale(event.transaction.hash.toHex() + "-" + event.logIndex.toString())

  let tokenId = event.params.id.toString()

  let token = Token.load(tokenId)
  let ink = Ink.load(event.params.inkUrl)
  let artist = Artist.load(ink.artist)
  let transfer = TokenTransfer.load(event.transaction.hash.toHex())

  //let contract = NiftyInk.bind(Address.fromString("0x49dE55fbA08af88f55EB797a456fdf76B151c8b0"))
  //let artistTake = contract.artistTake()

  if (transfer !== null) {
    if (transfer.from == Address.fromString("0x0000000000000000000000000000000000000000") || transfer.from == artist.address) {
      sale.saleType = "primary"
      sale.artistTake = event.transaction.value
      sale.seller = artist.address
    } else {
      sale.saleType = "secondary"
      sale.artistTake = (((event.transaction.value).times(BigInt.fromI32(1))) / BigInt.fromI32(100))
      sale.seller = transfer.from
    }
  }

  if (token !== null) {
    token.price = BigInt.fromI32(0)
    token.save()
  }

  sale.token = tokenId
  sale.price = event.transaction.value
  sale.buyer = event.transaction.from
  sale.artist = ink.artist
  sale.ink = event.params.inkUrl
  sale.createdAt = event.block.timestamp
  sale.transfer = event.transaction.hash.toHex()

  sale.save()

  incrementTotal('sales',event.block.timestamp)
  updateMetaData('blockNumber',event.block.number.toString())
}

export function handleMintedOnMain (event: mintedInk): void {

  let token = Token.load(event.params.id.toString())

  token.network = "mainnet"
  token.upgradeTransfer = event.transaction.hash.toHex()

  token.save()
  updateMetaData('blockNumber',event.block.number.toString())
}

export function handleTokenSentViaBridge (event: tokenSentViaBridge): void {

  let token = Token.load(event.params._tokenId.toString())

  token.network = "mainnet"
  token.upgradeTransfer = event.transaction.hash.toHex()

  token.save()

  incrementTotal('upgrades',event.block.timestamp)
  updateMetaData('blockNumber',event.block.number.toString())
}

export function handleNewRelayPrice (event: newPrice): void {

  let currentPrice = RelayPrice.load("current")

  if (currentPrice !== null) {
    currentPrice.id = currentPrice.createdAt.toString()
    currentPrice.save()
  }

  let updatedPrice = new RelayPrice("current")
  updatedPrice.price = event.params.price
  updatedPrice.createdAt = event.block.timestamp
  updatedPrice.save()
  updateMetaData('blockNumber',event.block.number.toString())
}

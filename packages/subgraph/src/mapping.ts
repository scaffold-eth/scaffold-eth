import { BigInt, Address } from "@graphprotocol/graph-ts";
import { NataNFT, Transfer, NewToken } from "../generated/NataNFT/NataNFT";
import { Nata, Minter, TokenTransfer } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  let nata = Nata.load(event.params.tokenId.toString());

  if (nata !== null) {
    nata.owner = event.params.to;
    nata.save();
  }

  let transfer = new TokenTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.nata = event.params.tokenId.toString();
  transfer.save();
}

export function handleNewToken(event: NewToken): void {
  let nataId = event.params._tokenId.toString();

  let nata = new Nata(nataId);

  nata.ipfsHash = event.params._ipfsHash;
  nata.owner = event.params._minter;
  nata.minter = event.params._minter.toHexString();
  nata.createdAt = event.block.timestamp;
  nata.block = event.block.hash.toHexString();
  nata.save();

  let minter = Minter.load(event.params._minter.toHexString());

  if (minter !== null) {
    minter.nataCount = minter.nataCount + BigInt.fromI32(1);
  } else {
    minter = new Minter(event.params._minter.toHexString());
    minter.nataCount = BigInt.fromI32(1);
  }

  minter.save();
}

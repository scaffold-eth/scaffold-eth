import { BigInt, Address } from "@graphprotocol/graph-ts";
import { BurnNFT, Transfer, NewToken } from "../generated/BurnyBoys/BurnNFT";
import { BurnyBoy, Minter, Block } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  let burny = BurnyBoy.load(event.params.tokenId.toString());

  if (burny !== null) {
    burny.owner = event.params.to;
    burny.save();
  }
}

export function handleNewToken(event: NewToken): void {
  let burnyId = event.params._tokenId.toString();

  let burny = new BurnyBoy(burnyId);

  burny.baseFee = event.params._baseFee;
  burny.owner = event.params._minter;
  burny.minter = event.params._minter.toHexString();
  burny.createdAt = event.block.timestamp;
  burny.block = event.block.hash.toHexString();
  burny.save();

  let latest = Block.load("latest");

  if (latest !== null) {
    latest.burnyBoyTotal = latest.burnyBoyTotal + BigInt.fromI32(1);

    if (burny.baseFee > latest.maxBaseFee) {
      latest.maxBaseFee = burny.baseFee;
      latest.maxBaseFeeBurnyBoy = burnyId;
    }
    if (burny.baseFee < latest.minBaseFee) {
      latest.minBaseFee = burny.baseFee;
      latest.minBaseFeeBurnyBoy = burnyId;
    }

    if (latest.number !== event.block.number) {
      latest.burnyBoyCount = BigInt.fromI32(1);
    } else {
      latest.burnyBoyCount = latest.burnyBoyCount + BigInt.fromI32(1);
    }
  } else {
    latest = new Block("latest");
    latest.burnyBoyTotal = BigInt.fromI32(1);
    latest.burnyBoyCount = BigInt.fromI32(1);
    latest.minterTotal = BigInt.fromI32(1);
    latest.minBaseFee = event.params._baseFee;
    latest.maxBaseFee = event.params._baseFee;
    latest.minBaseFeeBurnyBoy = burnyId;
    latest.maxBaseFeeBurnyBoy = burnyId;
  }

  latest.timestamp = event.block.timestamp;
  latest.number = event.block.number;
  latest.baseFee = event.params._baseFee;

  let minter = Minter.load(event.params._minter.toHexString());

  if (minter !== null) {
    minter.burnyBoyCount = minter.burnyBoyCount + BigInt.fromI32(1);

    if (burny.baseFee > minter.maxBaseFee) {
      minter.maxBaseFee = burny.baseFee;
      minter.maxBaseFeeBurnyBoy = burnyId;
    }
    if (burny.baseFee < minter.minBaseFee) {
      minter.minBaseFee = burny.baseFee;
      minter.minBaseFeeBurnyBoy = burnyId;
    }
  } else {
    minter = new Minter(event.params._minter.toHexString());
    minter.burnyBoyCount = BigInt.fromI32(1);
    minter.minBaseFee = event.params._baseFee;
    minter.maxBaseFee = event.params._baseFee;
    minter.minBaseFeeBurnyBoy = burnyId;
    minter.maxBaseFeeBurnyBoy = burnyId;

    latest.minterTotal = latest.minterTotal + BigInt.fromI32(1);
  }

  minter.save();
  latest.save();

  let block = latest;
  block.id = event.block.hash.toHexString();

  block.save();
}

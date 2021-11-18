import { BigInt, Address, dataSource } from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawalEvent,
  SimpleStream,
} from "../generated/Stream/SimpleStream";
import {
  Stream,
  Builder,
  Funder,
  Deposit,
  Withdrawal,
} from "../generated/schema";

export function handleDeposit(event: DepositEvent): void {
  let streamAddress = dataSource.address();

  let stream = Stream.load(streamAddress.toHexString());

  if (stream == null) {
    stream = new Stream(streamAddress.toHexString());

    let contract = SimpleStream.bind(streamAddress);
    let builderAddress = contract.toAddress();
    let cap = contract.cap();
    let frequency = contract.frequency();

    stream.builder = builderAddress.toHexString();
    stream.cap = cap;
    stream.frequency = frequency;
    stream.createdAt = event.block.timestamp;
    stream.totalDeposited = event.params.amount;
    stream.totalWithdrawn = BigInt.fromI32(0);

    let builder = Builder.load(builderAddress.toHexString());

    if (builder == null) {
      builder = new Builder(builderAddress.toHexString());
      builder.totalWithdrawn = BigInt.fromI32(0);
      builder.save();
    }
  } else {
    stream.totalDeposited = stream.totalDeposited.plus(event.params.amount);
  }

  let funder = Funder.load(event.params.from.toHexString());
  if (funder == null) {
    funder = new Funder(event.params.from.toHexString());
    funder.totalDeposited = event.params.amount;
    funder.createdAt = event.block.timestamp;
  } else {
    funder.totalDeposited = funder.totalDeposited.plus(event.params.amount);
  }

  let deposit = new Deposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  deposit.stream = streamAddress.toHexString();
  deposit.amount = event.params.amount;
  deposit.funder = event.params.from.toHexString();
  deposit.createdAt = event.block.timestamp;
  deposit.reason = event.params.reason;
  deposit.transactionHash = event.transaction.hash.toHex();

  stream.save();
  funder.save();
  deposit.save();
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  let streamAddress = dataSource.address();

  let builder = Builder.load(event.params.to.toHexString());
  if (builder !== null) {
    builder.totalWithdrawn = builder.totalWithdrawn.plus(event.params.amount);
    builder.save();
  }

  let stream = Stream.load(streamAddress.toHexString());
  if (stream !== null) {
    stream.totalWithdrawn = stream.totalWithdrawn.plus(event.params.amount);
    stream.save();
  }

  let withdrawal = new Withdrawal(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  withdrawal.stream = streamAddress.toHexString();
  withdrawal.amount = event.params.amount;
  withdrawal.builder = event.params.to.toHexString();
  withdrawal.createdAt = event.block.timestamp;
  withdrawal.reason = event.params.reason;
  withdrawal.transactionHash = event.transaction.hash.toHex();

  withdrawal.save();
}

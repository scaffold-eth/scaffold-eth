import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  YourContract,
  SetPurpose
} from "../generated/YourContract/YourContract"
import { Purpose, Sender } from "../generated/schema"

export function handleLock(event: timelockCreated): void {

  // let senderString = event.params.sender.toHexString()
  //
  // let sender = Sender.load(senderString)
  
  let timeLock = TimeLock.load()//should be something pointing to user/asset



  if (sender == null) {
    sender = new Sender(senderString)
    sender.address = event.params.sender
    sender.createdAt = event.block.timestamp
    sender.purposeCount = BigInt.fromI32(1)
  }
  else {
    sender.purposeCount = sender.purposeCount.plus(BigInt.fromI32(1))
  }

  let purpose = new Purpose(event.transaction.hash.toHex() + "-" + event.logIndex.toString())

  purpose.purpose = event.params.purpose
  purpose.sender = senderString
  purpose.createdAt = event.block.timestamp
  purpose.transactionHash = event.transaction.hash.toHex()

  purpose.save()
  sender.save()

}

import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Noun,
  WillCreated,
  WillFunded,
  WillDeFunded
} from "../generated/Noun/Noun"
import { Will } from "../generated/schema"

export function handleWillCreated(event: WillCreated): void {
  let id = event.params.index.minus(BigInt.fromI32(1)).toHexString()
  let will = new Will(id)

  will.owner = event.params.owner
  will.beneficiary = event.params.beneficiary
  will.deadline = event.params.deadline
  will.index = event.params.index
  will.value = event.params.value
  will.transactionHash = event.transaction.hash.toHex()
  will.save()
}

export function handleWillDeFunded(event: WillDeFunded): void {
  let id = event.params.index.toHexString()
  let will = Will.load(id)
  will.value = will.value.minus(event.params.amount)
  will.save()
}

export function handleWillFunded(event: WillFunded): void {
  let id = event.params.index.toHexString()
  let will = Will.load(id)
  will.value = will.value.plus(event.params.amount)
  will.save()
}

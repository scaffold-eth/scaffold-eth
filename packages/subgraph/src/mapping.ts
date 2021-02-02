import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Noun,
  NewWillCreated,
  WillCreated,
  WillFunded,
  WillDeFunded,
  TokensDepositedToWill,
  TokensWithdrawnFromWill,
  BenifitedTokens,
  BeneficiarySet,
  DeadlineUpdated
} from "../generated/Noun/Noun"
import { Will } from "../generated/schema"

export function handleNewWillCreated(event: NewWillCreated): void {
  let id = event.params.index.minus(BigInt.fromI32(1)).toHexString()
  let will = new Will(id)

  will.owner = event.params.owner
  will.beneficiary = event.params.beneficiary
  will.deadline = event.params.deadline
  will.index = event.params.index
  will.token = event.params.tokenAddress
  // will.tokenBalance = 0
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


export function handleTokensDepositedToWill(event: TokensDepositedToWill): void {
  let id = event.params.willIndex.toHexString()
  let will = Will.load(id)
  if(will.token == null){
    will.token = event.params.tokenAddress
  }
  will.tokenBalance = will.tokenBalance.plus(event.params.value)
  will.save()
}

export function handleTokensWithdrawnFromWill(event: TokensWithdrawnFromWill): void {
  let id = event.params.willIndex.toHexString()
  let will = Will.load(id)
  will.tokenBalance = will.tokenBalance.minus(event.params.value)
  will.save()
}

export function handleBenifitedTokens(event: BenifitedTokens): void {
  let id = event.params.willIndex.toHexString()
  let will = Will.load(id)
  will.tokenBalance = will.tokenBalance.minus(event.params.value)
  will.save()
}



export function handleBeneficiarySet(event: BeneficiarySet): void {
  let id = event.params.index.toHexString()
  let will = Will.load(id)
  will.beneficiary = event.params.beneficiary
  will.save()
}

export function handleDeadlineUpdated(event: DeadlineUpdated): void {
  let id = event.params.index.toHexString()
  let will = Will.load(id)
  will.deadline = event.params.new_value
  will.save()
}

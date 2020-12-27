import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  YourContract,
  Minted,
  Burned
} from "../generated/YourContract/YourContract"
import { User } from "../generated/schema"

export function handleMinted(event: Minted): void {

  let sender = event.params.sender.toHex()

  let user = User.load(sender)

  if (user == null) {
    user = new User(sender)
    user.reserveBalance = event.params.deposit.toBigDecimal()
    user.bondingCurveTokenBalance = event.params.amount.toBigDecimal()
  }
  else {
    user.reserveBalance = event.params.deposit.toBigDecimal().plus(user.reserveBalance);
    user.bondingCurveTokenBalance = event.params.amount.toBigDecimal().plus(user.bondingCurveTokenBalance);
  }
  user.save()
}

export function handleBurned(event: Burned): void {

  let sender = event.params.sender.toHex()

  let user = User.load(sender)
  user.reserveBalance = user.reserveBalance.minus(event.params.refund.toBigDecimal());
  user.bondingCurveTokenBalance = user.bondingCurveTokenBalance.minus(event.params.amount.toBigDecimal());
  user.save()
}

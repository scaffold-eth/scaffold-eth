import { ethers } from 'hardhat'

export function hashToken(account: string) {
  return Buffer.from(ethers.utils.solidityKeccak256(['address'], [account]).slice(2), 'hex')
}

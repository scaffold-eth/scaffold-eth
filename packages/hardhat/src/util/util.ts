import { ethers } from 'hardhat'
import MerkleTree from 'merkletreejs';

export function hashToken(account: string) {
  return Buffer.from(ethers.utils.solidityKeccak256(["address"], [account]).slice(2), "hex");
}

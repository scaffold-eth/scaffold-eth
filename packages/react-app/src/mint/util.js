import { ethers } from "ethers";
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const allowlist = require('../tokens.json')

export function hashToken(account) {
  return Buffer.from(ethers.utils.solidityKeccak256(["address"], [account]).slice(2), "hex");
}

export const merkleTree = new MerkleTree(
  allowlist.addresses.map(token => hashToken(token)),
  keccak256,
  { sortPairs: true },
);

export const getProof = (account) => {
  const proof = merkleTree.getHexProof(hashToken(account))
  return proof
}

export const premintAddresses = allowlist.addresses
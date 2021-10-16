import { ethers } from 'hardhat'
import { solidity } from 'ethereum-waffle'
import { use, expect } from 'chai'
import { MerkleTree } from 'merkletreejs'
import { keccak256 } from 'keccak256'

const allowlist = require('./tokens.json')
import {Bufficorn} from '../src/types/Bufficorn'
import { hashToken } from '../src/util/util'

use(solidity)

describe('Bufficorn', function () {
  let myContract: Bufficorn
  let merkleTree: MerkleTree

  this.beforeAll(async function () {
    merkleTree = new MerkleTree(
      allowlist.addresses.map((token: string) => hashToken(token)),
      keccak256,
      { sortPairs: true }
    )
    console.log({ merkleTree })
  })

  describe('Configuration', function () {
    it('Should deploy YourContract', async function () {
      const YourContract = await ethers.getContractFactory('Bufficorn')

      myContract = (await YourContract.deploy('test', merkleTree.getHexRoot())) as Bufficorn
    })
  })
})

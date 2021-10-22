import { ethers } from 'hardhat'
import { solidity } from 'ethereum-waffle'
import { use, expect } from 'chai'

const allowlist = require('./tokens.json')
import { Pokemol } from '../src/types/Pokemol'
import { NonReceiver } from '../src/types/NonReceiver'
import { hashToken } from '../src/util/util'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import keccak256 from 'keccak256'
import { BaseProvider } from '@ethersproject/providers'

use(solidity)

describe('Pokemol', function () {
  let pokemol: Pokemol
  let accounts: SignerWithAddress[]

  let deployer: SignerWithAddress
  let preminter: SignerWithAddress
  let publicMinter: SignerWithAddress

  let provider: BaseProvider

  this.beforeAll(async function () {
    accounts = await ethers.getSigners()

    deployer = accounts[0]

    provider = ethers.provider
  })

  this.beforeEach(async function () {
    const Pokemol = await ethers.getContractFactory('Pokemol')

    pokemol = (await Pokemol.deploy(
    )) as Pokemol

  })

  describe('Token URI', function () {
    it('should construct uri', async function () {
      await pokemol.mintDemo()
      const uri = await pokemol.tokenURI(1)
      console.log({uri})
    })

  })

})

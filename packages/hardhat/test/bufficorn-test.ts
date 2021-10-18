import { ethers } from 'hardhat'
import { solidity } from 'ethereum-waffle'
import { use, expect } from 'chai'
import { MerkleTree } from 'merkletreejs'

const allowlist = require('./tokens.json')
import { Bufficorn } from '../src/types/Bufficorn'
import { NonReceiver } from '../src/types/NonReceiver'
import { hashToken } from '../src/util/util'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import keccak256 from 'keccak256'
import { BaseProvider } from '@ethersproject/providers'

use(solidity)

const testConfiguration = {
  baseUri: 'test:',
  reserved: 25,
  presale: 50,
  public: 75,
  ethSink: '0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6',
}

const premintPrice = ethers.utils.parseEther('0.0528')
const publicPrice = ethers.utils.parseEther('0.1')

describe('Bufficorn', function () {
  let bufficorn: Bufficorn
  let merkleTree: MerkleTree
  let accounts: SignerWithAddress[]

  let deployer: SignerWithAddress
  let preminter: SignerWithAddress
  let publicMinter: SignerWithAddress

  let bufficornAsPreminter: Bufficorn
  let bufficornAsPublic: Bufficorn

  let provider: BaseProvider

  this.beforeAll(async function () {
    merkleTree = new MerkleTree(
      allowlist.addresses.map((token: string) => hashToken(token)),
      keccak256,
      {
        duplicateOdd: false,
        hashLeaves: false,
        isBitcoinTree: false,
        sortLeaves: false,
        sortPairs: true,
        sort: false,
      }
    )
    accounts = await ethers.getSigners()

    deployer = accounts[0]
    preminter = accounts[1]
    publicMinter = accounts[2]

    provider = ethers.provider
  })

  this.beforeEach(async function () {
    const Bufficorn = await ethers.getContractFactory('Bufficorn')

    const root = merkleTree.getHexRoot()
    bufficorn = (await Bufficorn.deploy(
      testConfiguration.baseUri,
      root,
      testConfiguration.reserved,
      testConfiguration.presale,
      testConfiguration.public,
      testConfiguration.ethSink
    )) as Bufficorn

    bufficornAsPreminter = await bufficorn.connect(preminter)
    bufficornAsPublic = await bufficorn.connect(publicMinter)

    await bufficorn.setContractState(0, true)
    await bufficorn.setContractState(1, true)
  })

  describe('Configuration', function () {
    it('Should setup tests', async function () {
      expect(await bufficorn.contractState(0)).to.be.equal(true)
      expect(await bufficorn.contractState(1)).to.be.equal(true)
    })
  })

  describe('Receive ETH', function () {
    it('Fails if receiver cannot receive eth', async function () {
      const NonReceiver = await ethers.getContractFactory('NonReceiver')
      const Bufficorn = await ethers.getContractFactory('Bufficorn')

      const nonReceiver = await NonReceiver.deploy()
      const root = merkleTree.getHexRoot()

      bufficorn = (await Bufficorn.deploy(
        testConfiguration.baseUri,
        root,
        testConfiguration.reserved,
        testConfiguration.presale,
        testConfiguration.public,
        nonReceiver.address
      )) as Bufficorn
      await bufficorn.setContractState(1, true)

      expect(bufficorn.mintOpensale(1, { value: publicPrice })).to.be.revertedWith('could not send')
    })

    it('Should send eth to the sink', async function () {
      const balanceBefore = await provider.getBalance(testConfiguration.ethSink)
      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      await bufficornAsPreminter.mintPresale(1, proof, { value: premintPrice })
      const balanceAfter = await provider.getBalance(testConfiguration.ethSink)

      expect(balanceAfter.sub(balanceBefore)).to.equal(premintPrice)
    })
  })

  describe('Minting Presale', function () {
    it('Should allow whitelisted address to mint presale', async function () {
      const balanceBefore = await provider.getBalance(testConfiguration.ethSink)
      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      await bufficornAsPreminter.mintPresale(1, proof, { value: premintPrice })
      const balanceAfter = await provider.getBalance(testConfiguration.ethSink)

      expect(await bufficorn.balanceOf(preminter.address)).to.equal(1)
      expect(balanceAfter.sub(balanceBefore)).to.equal(premintPrice)
    })

    it('Fails if presale not enabled', async function () {
      await bufficorn.setContractState(0, false)
      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      expect(bufficornAsPreminter.mintPresale(1, proof, { value: premintPrice })).to.be.revertedWith('!round')
    })

    it('Should not allow proof for another user to mint', async function () {
      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      expect(bufficornAsPublic.mintPresale(1, proof, { value: premintPrice })).to.be.revertedWith('revert Invalid merkle proof')
      expect(await bufficorn.balanceOf(publicMinter.address)).to.equal(0)
    })

    it('Should fail if eth less than required amount', async function () {
      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      expect(bufficornAsPreminter.mintPresale(1, proof, { value: ethers.utils.parseEther('0.05') })).to.be.revertedWith('NOT ENOUGH')
      expect(await bufficorn.balanceOf(preminter.address)).to.equal(0)
    })

    it('Should succeed if greater than required eth amount', async function () {
      const balanceBefore = await provider.getBalance(testConfiguration.ethSink)
      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      await bufficornAsPreminter.mintPresale(1, proof, { value: ethers.utils.parseEther('0.07') })
      const balanceAfter = await provider.getBalance(testConfiguration.ethSink)

      expect(await bufficorn.balanceOf(preminter.address)).to.equal(1)
      expect(balanceAfter.sub(balanceBefore)).to.equal(ethers.utils.parseEther('0.07'))
    })

    it('Should allow minter to mint up to 20 at once', async function () {
      const totalPrice = premintPrice.mul(20)

      const balanceBefore = await provider.getBalance(testConfiguration.ethSink)
      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      await bufficornAsPreminter.mintPresale(20, proof, { value: totalPrice })
      const balanceAfter = await provider.getBalance(testConfiguration.ethSink)

      expect(await bufficorn.balanceOf(preminter.address)).to.equal(20)
      expect(balanceAfter.sub(balanceBefore)).to.equal(totalPrice)
    })

    it('Should fail if total price is not high enough', async function () {
      const totalPrice = premintPrice.mul(20)

      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      expect(bufficornAsPreminter.mintPresale(20, proof, { value: totalPrice.sub(1) })).to.be.revertedWith('NOT ENOUGH')
    })

    it('Should fail if more than 20 attempted', async function () {
      const totalPrice = premintPrice.mul(21)

      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      expect(bufficornAsPreminter.mintPresale(21, proof, { value: totalPrice })).to.be.revertedWith('TOO MUCH')
    })

    it('Should fail if more than total presale cap', async function () {
      const totalPrice10 = premintPrice.mul(10)
      const totalPrice16 = premintPrice.mul(16)
      const totalPrice15 = premintPrice.mul(15)

      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      await bufficornAsPreminter.mintPresale(10, proof, { value: totalPrice10 })

      expect(bufficornAsPreminter.mintPresale(16, proof, { value: totalPrice16 })).to.be.revertedWith('EXCEEDS CAP')

      await bufficornAsPreminter.mintPresale(15, proof, { value: totalPrice15 })

      expect(await bufficorn.balanceOf(preminter.address)).to.equal(25)
    })

    // max limits per presale
  })

  describe('Minting Public', function () {
    it('Should allow anyone to mint in public round', async function () {
      await bufficornAsPublic.mintOpensale(1, { value: publicPrice })
      expect(await bufficorn.balanceOf(publicMinter.address)).to.equal(1)
    })

    it('Fails if public sale not enabled', async function () {
      await bufficorn.setContractState(1, false)
      expect(bufficornAsPublic.mintOpensale(1, { value: publicPrice })).to.be.revertedWith('!round')
    })

    it('Should fail if eth less than required amount', async function () {
      expect(bufficornAsPublic.mintOpensale(1, { value: ethers.utils.parseEther('0.09') })).to.be.revertedWith('NOT ENOUGH')
      expect(await bufficorn.balanceOf(publicMinter.address)).to.equal(0)
    })

    it('Should succeed if greater than required eth amount', async function () {
      const balanceBefore = await provider.getBalance(testConfiguration.ethSink)
      await bufficornAsPublic.mintOpensale(1, { value: ethers.utils.parseEther('0.15') })
      const balanceAfter = await provider.getBalance(testConfiguration.ethSink)

      expect(await bufficorn.balanceOf(publicMinter.address)).to.equal(1)
      expect(balanceAfter.sub(balanceBefore)).to.equal(ethers.utils.parseEther('0.15'))
    })

    it('Should fail if more than 20 attempted', async function () {
      const totalPrice = publicPrice.mul(21)

      expect(bufficornAsPublic.mintOpensale(21, { value: totalPrice })).to.be.revertedWith('TOO MUCH')
    })

    it('Should fail if more than total presale cap', async function () {
      const totalPrice20 = publicPrice.mul(20)
      const totalPrice10 = publicPrice.mul(10)
      const totalPrice11 = publicPrice.mul(11)

      const presalePrice10 = premintPrice.mul(10)

      const proof = merkleTree.getHexProof(hashToken(preminter.address))
      await bufficornAsPreminter.mintPresale(10, proof, { value: presalePrice10 })

      await bufficornAsPublic.mintOpensale(20, { value: totalPrice20 })
      await bufficornAsPublic.mintOpensale(10, { value: totalPrice11 })

      expect(bufficornAsPublic.mintOpensale(11, { value: totalPrice11 })).to.be.revertedWith('EXCEEDS CAP')

      await bufficornAsPublic.mintOpensale(10, { value: totalPrice10 })

      expect(await bufficorn.balanceOf(preminter.address)).to.equal(10)
      expect(await bufficorn.balanceOf(publicMinter.address)).to.equal(40)
    })
  })

  describe('Minting Special', function () {
    it('Should allow the owner to mint special', async function () {
      await bufficorn.mintSpecial(1)
      expect(await bufficorn.balanceOf(deployer.address)).to.equal(1)
    })

    it('Does not allow anyone else ot mint special', async function () {
      expect(bufficornAsPublic.mintSpecial(1)).to.be.revertedWith('Ownable: caller is not the owner')
      expect(bufficornAsPreminter.mintSpecial(1)).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('Should allow owner to mint up to reserve cap', async function () {
      await bufficorn.mintSpecial(25)
      expect(await bufficorn.balanceOf(deployer.address)).to.equal(25)
    })

    it('Should not allow owner to mint more than reserve cap', async function () {
      expect(bufficorn.mintSpecial(26)).to.be.revertedWith('EXCEEDS CAP')
    })
  })

  describe('Access control', function () {
    it('Allows owner to change owner', async function () {
      await bufficorn.transferOwnership(preminter.address)
      expect(await bufficorn.owner()).to.equal(preminter.address)
    })
  })

  describe('Configuration', function () {
    it('Allows owner to set contract state', async function () {
      expect(await bufficorn.contractState(0)).to.equal(true)
      await bufficorn.setContractState(0, false)
      expect(await bufficorn.contractState(0)).to.equal(false)

      expect(await bufficorn.contractState(1)).to.equal(true)
      await bufficorn.setContractState(1, false)
      expect(await bufficorn.contractState(1)).to.equal(false)
    })

    it('Does not allow out of bounds state', async function () {
      expect(bufficorn.setContractState(2, false)).to.be.reverted
    })

    it('Allows owner to change baseUri', async function () {
      await bufficorn.mintSpecial(1)
      expect(await bufficorn.tokenURI(1)).to.equal('test:1')

      await bufficorn.setBaseURI('new:')
      expect(await bufficorn.baseURI()).to.equal('new:')

      expect(await bufficorn.tokenURI(1)).to.equal('new:1')
    })

    it('Allows owner to change root', async function () {
      expect(await bufficorn.root()).to.equal(merkleTree.getHexRoot())
      const newAllow = allowlist.addresses.slice(2)
      const newMerkle = new MerkleTree(
        newAllow.map((token: string) => hashToken(token)),
        keccak256,
        {
          duplicateOdd: false,
          hashLeaves: false,
          isBitcoinTree: false,
          sortLeaves: false,
          sortPairs: true,
          sort: false,
        }
      )

      await bufficorn.setRoot(newMerkle.getHexRoot())
      expect(await bufficorn.root()).to.equal(newMerkle.getHexRoot())
    })
  })
})

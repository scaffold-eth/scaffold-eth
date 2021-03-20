const { ethers } = require("hardhat");
const { expect } = require("chai");

const STATIC_OWNERSHIP = 0; // static balance
const DYNAMIC_OWNERSHIP = 1; // static balance
const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
const PAYMENT_GRACE_PERIOD = 1000 * 10; // 10 seconds

function delay(milisec) { 
    return new Promise(resolve => { 
        setTimeout(() => { resolve('') }, milisec); 
    }) 
} 

describe("GoodToken Create Tests", () => {
    let accounts;
    let deployAccount;
    let artistAccount;
    let personA, personB;
    let goodToken;
    let goodTokenFund;
    
    before(async () => {
        accounts = await ethers.getSigners();
        deployAccount = accounts[0];
        artistAccount = accounts[1];
        personA = accounts[2];
        personB = accounts[3];
    });

    beforeEach(async () => {
        const GoodToken = await ethers.getContractFactory("GoodToken");
        goodToken = await GoodToken.deploy();
        await goodToken.deployed();
        const GoodTokenFund = await ethers.getContractFactory("GoodTokenFund");
        goodTokenFund = await GoodTokenFund.deploy();
        await goodTokenFund.deployed();
    });


    async function mintArtwork(
        artist, 
        url, 
        revokeUrl,
        ownershipModel,
        benificiaryAddress,
        balanceRequirement,
        balanceDuration,
        price) {
        // ensure artist is whitelisted
        if(!(await goodToken.hasRole(minterRole, artist.address))) {
            await goodToken.whitelistArtist(artist.address, true);
        }

        // create new artwork
        await goodToken.connect(artist).createArtwork(
            url, 
            revokeUrl,
            ownershipModel,
            benificiaryAddress,
            balanceRequirement,
            balanceDuration,
            price
        ).then(tx => tx.wait);

    }

    it("Should allow artwork to be purchase if ownership is revoked", async () => {

        // create test artwork
        const testPrice = ethers.constants.WeiPerEther;
        const minBalance = ethers.constants.WeiPerEther;
        await mintArtwork(
            artistAccount,
            "",
            "",
            STATIC_OWNERSHIP,
            goodTokenFund.address,
            minBalance,
            0,
            testPrice
        );

        // have personA purchase artwork
        const tokenId = 0;
        const tx = await goodToken.connect(personA).buyArtwork(tokenId, {value: testPrice});

        await tx.wait();

        // ensure ownership is ownerA
        expect(await goodToken.ownerOf(tokenId)).to.equal(personA.address);

        // personB attemp to purchase
        await expect(goodToken.connect(personB)
            .buyArtwork(tokenId, {value: 0}))
            .to.be.revertedWith("GoodToken: Offer must meet minimum price");
        await expect(goodToken.connect(personB)
            .buyArtwork(tokenId, {value: testPrice}))
            .to.be.revertedWith("GoodToken: Artwork is not currently for sale");
        
        // wait for grace period to be over
        await delay(PAYMENT_GRACE_PERIOD * 1.5);

        await expect(goodToken.connect(personB)
        .buyArtwork(tokenId, {value: testPrice}))
        .to.not.be.reverted;
    
        expect(await goodToken.ownerOf(tokenId)).to.equal(personB.address);
    
    });


    it("Should not allow artwork to be purchased if ownership is earned", async () => {
        // create test artwork
        const testPrice = ethers.constants.WeiPerEther;
        const minBalance = ethers.constants.WeiPerEther.mul(2);
        await mintArtwork(
            artistAccount,
            "",
            "",
            STATIC_OWNERSHIP,
            goodTokenFund.address,
            minBalance,
            0,
            testPrice
        );

        // have personA purchase artwork
        const tokenId = 0;
        const tx = await goodToken.connect(personA).buyArtwork(tokenId, {value: testPrice});

        await tx.wait();

        // person A now secures the required token balance
        await goodTokenFund.connect(personA).mint({value: minBalance});

        // wait for grace period to be over
        await delay(PAYMENT_GRACE_PERIOD * 1.5);

        await expect(goodToken.connect(personB)
        .buyArtwork(tokenId, {value: testPrice}))
        .to.be.reverted;

    });


    it("Should properly calculate dynamic balance required", async () => {
        // create test artwork
        const testPrice = ethers.constants.WeiPerEther;
        const minBalance = ethers.constants.WeiPerEther.mul(1).div(100); // 0.01 incriments
        const timePeriod = 10; // need to have 0.01 more every 10 seconds
        let elapsedTime = 0;
        await mintArtwork(
            artistAccount,
            "",
            "",
            DYNAMIC_OWNERSHIP,
            goodTokenFund.address,
            minBalance,
            timePeriod,
            testPrice
        );
 
        // have personA purchase artwork
        const tokenId = 0;
        const tx = await goodToken.connect(personA).buyArtwork(tokenId, {value: testPrice});
 
        await tx.wait();

        expect(await goodToken.isRevoked(tokenId)).to.equal(false);

        const delayTime = PAYMENT_GRACE_PERIOD * 1.5;
        await delay(delayTime);
        elapsedTime += delayTime;

        await goodTokenFund.mint({value: 1}).then(t => t.wait);
        expect(await goodToken.isRevoked(tokenId)).to.equal(true);

        await delay(delayTime);
        elapsedTime += delayTime;

        await goodTokenFund.mint({value: 1}).then(t => t.wait);        
        expect(await goodToken.isRevoked(tokenId)).to.equal(true);
        
        // restore ownership due to donation
        const paymentCycles = (elapsedTime / 1000 / timePeriod ) + 1;
        await goodTokenFund.connect(personA).mint({value: minBalance.mul(paymentCycles)});
        expect(await goodToken.isRevoked(tokenId)).to.equal(false);

    });


    
});
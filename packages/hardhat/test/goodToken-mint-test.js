const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("GoodToken Create Tests", () => {
    let accounts;
    let goodToken;
    
    before(async () => {
        accounts = await ethers.getSigners();
    });

    beforeEach(async () => {
        const GoodToken = await ethers.getContractFactory("GoodToken");
        goodToken = await GoodToken.deploy();
        await goodToken.deployed();
    });
    
    const imgUrl = "hello";
    it("Should revert if artist unauthorized", async () => {
        const artistAccount = accounts[1];
        await expect(goodToken.connect(artistAccount).createArtwork(
            imgUrl,
            imgUrl,
            0,
            goodToken.address,
            100,
            100,
            100
        )).to.be.reverted;
    });
    
    async function createSampleArtwork(price) {
        const artistAccount = accounts[1];
        const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
        
        // Ensure whitelisting works correctly
        expect(await goodToken.hasRole(minterRole, artistAccount.address)).to.equal(false);
        await goodToken.whitelistArtist(artistAccount.address, true);
        expect(await goodToken.hasRole(minterRole, artistAccount.address)).to.equal(true);
        const tx = await goodToken.connect(artistAccount).createArtwork(
            imgUrl,
            imgUrl,
            0,
            goodToken.address,
            100,
            100,
            price
        );
        await tx.wait();
    }

    it("Should allow authorized artist to mint a new artwork", async () => {
        await createSampleArtwork(ethers.constants.WeiPerEther);
    });


    it("Should buy a newly create artwork", async () => {
        await createSampleArtwork(ethers.constants.WeiPerEther);

        const buyer = accounts[2];
        await expect(goodToken.connect(buyer).buyArtwork(0, {value: 0})).to.be.reverted;

        const tx = await goodToken.connect(buyer).buyArtwork(0, {value: ethers.constants.WeiPerEther});
        await tx.wait();
    });


})
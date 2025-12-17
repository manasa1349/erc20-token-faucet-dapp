const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenFaucet – full test suite", function () {
  let token, faucet;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("YourToken");
    const Faucet = await ethers.getContractFactory("TokenFaucet");

    // Deploy Token with owner as temporary minter
    token = await Token.deploy(owner.address);
    await token.waitForDeployment();

    // Deploy Faucet with token address
    faucet = await Faucet.deploy(await token.getAddress());
    await faucet.waitForDeployment();

    // Transfer minting rights to faucet
    await token.setMinter(await faucet.getAddress());
  });

  it("deploys token and faucet correctly", async function () {
    expect(await token.minter()).to.equal(await faucet.getAddress());
    expect(await faucet.admin()).to.equal(owner.address);
    expect(await faucet.isPaused()).to.equal(false);
  });

  it("allows a user to successfully claim tokens", async function () {
    const amount = await faucet.FAUCET_AMOUNT();

    await faucet.connect(user1).requestTokens();

    expect(await token.balanceOf(user1.address)).to.equal(amount);
    expect(await faucet.totalClaimed(user1.address)).to.equal(amount);
    expect(await faucet.lastClaimAt(user1.address)).to.be.gt(0);
  });

  it("enforces 24-hour cooldown between claims", async function () {
    await faucet.connect(user1).requestTokens();

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Cooldown period not elapsed");

    await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await faucet.connect(user1).requestTokens();
  });

  it("enforces lifetime claim limit", async function () {
    const amount = await faucet.FAUCET_AMOUNT();
    const max = await faucet.MAX_CLAIM_AMOUNT();
    const claimsNeeded = max / amount;

    for (let i = 0; i < claimsNeeded; i++) {
      await faucet.connect(user1).requestTokens();
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
    }

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Lifetime claim limit reached");
  });

  it("allows admin to pause and unpause faucet", async function () {
    await faucet.setPaused(true);
    expect(await faucet.isPaused()).to.equal(true);

    await faucet.setPaused(false);
    expect(await faucet.isPaused()).to.equal(false);
  });

  it("prevents non-admin from pausing faucet", async function () {
    await expect(
      faucet.connect(user1).setPaused(true)
    ).to.be.revertedWith("Only admin");
  });

  it("prevents claiming when faucet is paused", async function () {
    await faucet.setPaused(true);

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Faucet is paused");
  });

  it("allows multiple users to claim independently", async function () {
    const amount = await faucet.FAUCET_AMOUNT();

    await faucet.connect(user1).requestTokens();
    await faucet.connect(user2).requestTokens();

    expect(await token.balanceOf(user1.address)).to.equal(amount);
    expect(await token.balanceOf(user2.address)).to.equal(amount);
  });
});
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", balance.toString());

  // 1. Deploy Token with deployer as temporary minter
  const Token = await hre.ethers.getContractFactory("YourToken");
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();

  console.log("Token deployed to:", await token.getAddress());

  // 2. Deploy Faucet with token address
  const Faucet = await hre.ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(await token.getAddress());
  await faucet.waitForDeployment();

  console.log("Faucet deployed to:", await faucet.getAddress());

  // 3. Transfer minting rights to faucet
  const tx = await token.setMinter(await faucet.getAddress());
  await tx.wait();

  console.log("Minter role transferred to Faucet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
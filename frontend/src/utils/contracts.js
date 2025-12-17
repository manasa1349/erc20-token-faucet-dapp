import { ethers } from "ethers";
import tokenAbi from "./tokenAbi.json";
import faucetAbi from "./faucetAbi.json";

let provider;

/**
 * Get browser provider (MetaMask)
 */
function getProvider() {
  if (!provider) {
    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }
    provider = new ethers.BrowserProvider(window.ethereum);
  }
  return provider;
}

/**
 * Get signer (connected wallet)
 */
async function getSigner() {
  const provider = getProvider();
  return await provider.getSigner();
}

/**
 * Token contract (read-only)
 */
function getTokenContract() {
  return new ethers.Contract(
    import.meta.env.VITE_TOKEN_ADDRESS,
    tokenAbi,
    getProvider()
  );
}

/**
 * Faucet contract (read-only)
 */
function getFaucetContract() {
  return new ethers.Contract(
    import.meta.env.VITE_FAUCET_ADDRESS,
    faucetAbi,
    getProvider()
  );
}

/**
 * Faucet contract (write)
 */
async function getFaucetWithSigner() {
  const signer = await getSigner();
  return new ethers.Contract(
    import.meta.env.VITE_FAUCET_ADDRESS,
    faucetAbi,
    signer
  );
}

export async function getBalance(address) {
  const balance = await getTokenContract().balanceOf(address);
  return balance.toString();
}

export async function requestTokens() {
  const faucet = await getFaucetWithSigner();
  const tx = await faucet.requestTokens();
  await tx.wait();
  return tx.hash;
}

export async function canClaim(address) {
  return await getFaucetContract().canClaim(address);
}

export async function getRemainingAllowance(address) {
  const value = await getFaucetContract().remainingAllowance(address);
  return value.toString();
}
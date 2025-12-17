export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const sepoliaChainId = "0xaa36a7"; // 11155111 in hex

  try {
    // Try switching to Sepolia
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: sepoliaChainId }],
    });
  } catch (switchError) {
    // If Sepolia is not added, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: sepoliaChainId,
            chainName: "Sepolia Testnet",
            rpcUrls: [
              "https://eth-sepolia.g.alchemy.com/v2/ayv9jfxnEeJlI61hCWYFN",
            ],
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }

  // Request account connection
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts[0];
}
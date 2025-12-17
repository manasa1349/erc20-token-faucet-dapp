import { useEffect, useState } from "react";
import { connectWallet } from "./utils/wallet";
import {
  getBalance,
  requestTokens,
  canClaim,
  getRemainingAllowance,
} from "./utils/contracts";
import "./utils/eval";

export default function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState("0");
  const [eligible, setEligible] = useState(false);
  const [remaining, setRemaining] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadData(addr) {
    setBalance(await getBalance(addr));
    setEligible(await canClaim(addr));
    setRemaining(await getRemainingAllowance(addr));
  }

  async function handleConnect() {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      await loadData(addr);
    } catch (e) {
      setError(e.message || "Wallet connection failed");
    }
  }

    
  async function handleClaim() {
    setLoading(true);
    setError("");
    try {
      await requestTokens();
      await loadData(address);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <h1>ERC20 Faucet</h1>

      {!address ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <>
          <p><b>Address:</b> {address}</p>
          <p><b>Balance:</b> {balance}</p>
          <p><b>Remaining Allowance:</b> {remaining}</p>

          <button
            disabled={!eligible || loading}
            onClick={handleClaim}
          >
            {loading ? "Claiming..." : "Request Tokens"}
          </button>
        </>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
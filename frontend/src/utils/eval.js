import { connectWallet } from "./wallet";
import {
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
} from "./contracts";

window.__EVAL__ = {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  getContractAddresses: async () => ({
    token: import.meta.env.VITE_TOKEN_ADDRESS,
    faucet: import.meta.env.VITE_FAUCET_ADDRESS,
  }),
};
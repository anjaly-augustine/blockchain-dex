import { ethers } from "ethers";
import { Sepolia } from "@usedapp/core";

// Sepolia RPC
export const SEPOLIA_RPC_URL =
  "https://eth-sepolia.g.alchemy.com/v2/7xdYr5rq23QhXbuEVXHsZ";

// Deployed contract addresses
export const TOKEN_X_ADDRESS = "0x70589a36ABdcF20a743aedcC770B1dd838651AC8";
export const TOKEN_Y_ADDRESS = "0x89c64d66706FD5995a16821Da6B0e5fC4688Fbf9";
export const DEX_ADDRESS     = "0x79e84dCBF7668B04565D4a8F970C067B2b59d101";

// ✅ useDApp config (THIS WAS MISSING)
export const DAPP_CONFIG = {
  readOnlyChainId: Sepolia.chainId,
  readOnlyUrls: {
    [Sepolia.chainId]: SEPOLIA_RPC_URL,
  },
};

// ✅ ethers v5 provider helper
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
};


import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

export const opBNBTestnet = defineChain({
  id: 5611,
  name: "opBNB Testnet",
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://opbnb-testnet-rpc.bnbchain.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "opBNBScan",
      url: "https://testnet.opbnbscan.com",
    },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: "Meshmind ZK-Escrow",
  projectId: "991e0a293817f8b91938b8d910293817", // Public demo ProjectId
  chains: [opBNBTestnet],
  ssr: true,
});

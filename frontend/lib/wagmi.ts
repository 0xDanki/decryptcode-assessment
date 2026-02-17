"use client";

import { createConfig, http } from "wagmi";
import { hardhat, baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? "31337", 10);

// Local Hardhat chain config (matches hardhat node)
const localhost = {
  ...hardhat,
  id: 31337,
  name: "Localhost",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
};

export const config = createConfig({
  chains: [localhost, baseSepolia],
  connectors: [
    injected({ target: "metaMask" }),
  ],
  transports: {
    [localhost.id]: http(),
    [baseSepolia.id]: http(),
  },
});

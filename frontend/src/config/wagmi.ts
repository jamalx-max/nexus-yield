import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';
import { APP_INFO, CHAIN_CONFIG } from './constants';

export const wagmiConfig = getDefaultConfig({
  appName: APP_INFO.name,
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'apex-yield-demo',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(CHAIN_CONFIG.ethereum.rpcUrl),
  },
  ssr: false,
});

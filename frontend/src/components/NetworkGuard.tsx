import { useAccount, useChainId } from 'wagmi';
import { AlertTriangle } from 'lucide-react';
import { CHAIN_CONFIG } from '../config/constants';

export function NetworkGuard() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const requiredChainId = CHAIN_CONFIG.ethereum.chainId; // Sepolia

  if (!isConnected) return null;
  if (chainId === requiredChainId) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg border border-destructive-foreground/20 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 animate-pulse" />
        <div>
          <p className="font-bold text-sm">Wrong Network Detected</p>
          <p className="text-xs opacity-90">Please switch to {CHAIN_CONFIG.ethereum.name} to use the bridge.</p>
        </div>
      </div>
    </div>
  );
}

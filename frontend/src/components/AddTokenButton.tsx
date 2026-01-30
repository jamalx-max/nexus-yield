import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useWalletClient } from 'wagmi';
import { ADDRESSES } from '../config/constants';

export function AddTokenButton() {
  const { data: walletClient } = useWalletClient();

  const handleAddToken = async () => {
    if (!walletClient) return;
    
    try {
      await walletClient.watchAsset({
        type: 'ERC20',
        options: {
          address: ADDRESSES.USDC,
          symbol: 'USDC',
          decimals: 6,
        },
      });
    } catch (error) {
      console.error('Failed to add token', error);
    }
  };

  if (!walletClient) return null;

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleAddToken}
      className="text-xs text-muted-foreground hover:text-primary gap-1"
    >
      <Plus className="h-3 w-3" />
      Add USDC to Wallet
    </Button>
  );
}

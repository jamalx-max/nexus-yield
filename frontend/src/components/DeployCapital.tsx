import { useState, useEffect, useCallback } from 'react';
import { Rocket, CheckCircle, Loader2, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useStacksWallet } from '../providers/StacksWalletProvider';
import { useUSDCxBalance } from '../hooks/useUSDCxBalance';
import { formatNumber, formatUSD } from '../lib/utils';
import { ADDRESSES } from '../config/constants';

interface DeployCapitalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploySuccess?: () => void;
}

export function DeployCapital({ isOpen, onClose, onDeploySuccess }: DeployCapitalProps) {
  const [amount, setAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { address: stacksAddress } = useStacksWallet();
  
  // Get real-time USDCx balance
  const { balance: usdcxBalance, refetch: refetchUSDCx, isLoading: isLoadingUSDCx } = useUSDCxBalance();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(usdcxBalance.toString());
      setIsDepositing(false);
      setIsSuccess(false);
    }
  }, [isOpen, usdcxBalance]);

  const handleDeploy = useCallback(async () => {
    if (!stacksAddress || !amount || Number(amount) <= 0) return;

    setIsDepositing(true);

    try {
      // Import Stacks transaction libraries dynamically
      const { openContractCall } = await import('@stacks/connect');
      const { 
        uintCV, 
        PostConditionMode, 
        makeStandardFungiblePostCondition,
        FungibleConditionCode,
        createAssetInfo 
      } = await import('@stacks/transactions');

      const amountMicroUsdc = Math.floor(Number(amount) * 1_000_000);
      const [vaultAddress, vaultName] = ADDRESSES.APEX_VAULT.split('.');
      const [tokenAddress, tokenName] = ADDRESSES.USDCX_TOKEN.split('.');

      await openContractCall({
        contractAddress: vaultAddress,
        contractName: vaultName,
        functionName: 'deposit',
        functionArgs: [uintCV(amountMicroUsdc)],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardFungiblePostCondition(
            stacksAddress,
            FungibleConditionCode.LessEqual,
            amountMicroUsdc,
            createAssetInfo(tokenAddress, tokenName, 'usdcx-token')
          ),
        ],
        onFinish: (data) => {
          console.log('Deposit TX submitted:', data.txId);
          setIsSuccess(true);
          setIsDepositing(false);
          refetchUSDCx(); // Refresh balance after deposit
          onDeploySuccess?.();
        },
        onCancel: () => {
          console.log('User cancelled deposit');
          setIsDepositing(false);
        },
      });
    } catch (error) {
      console.error('Deploy failed:', error);
      alert(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsDepositing(false);
    }
  }, [stacksAddress, amount, onDeploySuccess]);

  const previewShares = Number(amount) || 0; // 1:1 at start

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle className="h-5 w-5 text-accent" />
            ) : (
              <Rocket className="h-5 w-5 text-primary" />
            )}
            {isSuccess ? 'Capital Deployed!' : 'Deploy Capital to Vault'}
          </DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? 'Your USDCx is now earning yield in the Apex Vault.'
              : 'Your USDCx has arrived on Stacks. Deploy it to the vault to start earning yield.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isSuccess ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-accent/10 text-center">
                <p className="text-sm text-muted-foreground">Deposited</p>
                <p className="text-2xl font-number font-bold text-accent">
                  {formatNumber(Number(amount), 2)} USDCx
                </p>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Your capital is now earning ~13.5% APY</p>
                <p className="mt-1">Check your position on the dashboard.</p>
              </div>

              <Button onClick={onClose} className="w-full" size="lg">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Dashboard
              </Button>
            </div>
          ) : (
            <>
              {/* Available Balance */}
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Available USDCx</span>
                  <div className="flex items-center gap-1">
                    <span className="font-number font-semibold">{formatNumber(usdcxBalance, 2)}</span>
                    <button 
                      onClick={refetchUSDCx}
                      className="p-0.5 hover:bg-secondary rounded transition-colors ml-1"
                      title="Refresh balance"
                      disabled={isLoadingUSDCx}
                    >
                      <RefreshCw className={`h-3 w-3 ${isLoadingUSDCx ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Amount to Deploy</label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setAmount(value);
                      }
                    }}
                    className="pr-24 font-number"
                    max={usdcxBalance}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      onClick={() => setAmount(usdcxBalance.toString())}
                      className="text-xs text-primary hover:underline"
                    >
                      Max
                    </button>
                    <span className="text-sm text-muted-foreground">USDCx</span>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {Number(amount) > 0 && (
                <div className="p-3 rounded-lg bg-secondary/50 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You will receive</span>
                    <span className="font-number">{formatNumber(previewShares, 2)} apUSDCx</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projected APY</span>
                    <span className="font-number text-accent font-semibold">13.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. yearly earnings</span>
                    <span className="font-number text-accent">
                      +{formatUSD(Number(amount) * 0.135)}
                    </span>
                  </div>
                </div>
              )}

              {/* Deploy Button */}
              <Button 
                onClick={handleDeploy} 
                className="w-full" 
                size="lg" 
                variant="success"
                disabled={isDepositing || Number(amount) <= 0 || Number(amount) > usdcxBalance}
              >
                {isDepositing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    Deploy to Vault
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                This will deposit your USDCx into the Apex Yield Vault
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

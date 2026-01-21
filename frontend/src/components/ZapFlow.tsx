import { useState } from 'react';
import { ArrowDown, Zap, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { BridgeTracker } from './BridgeTracker';
import { useBridge } from '../hooks/useBridge';
import { useStacksWallet } from '../providers/StacksWalletProvider';
import { useAccount } from 'wagmi';
import { formatNumber } from '../lib/utils';

export function ZapFlow() {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'input' | 'approve' | 'bridge' | 'tracking'>('input');
  
  const { isConnected: ethConnected } = useAccount();
  const { isConnected: stacksConnected, address: stacksAddress } = useStacksWallet();
  const { 
    bridgeState, 
    usdcBalance, 
    approveUSDC, 
    bridgeToStacks, 
    hasAllowance,
    reset 
  } = useBridge();

  const handleOpenZap = () => {
    setIsOpen(true);
    setStep('input');
    reset();
  };

  const handleApprove = async () => {
    if (!amount) return;
    
    try {
      setStep('approve');
      await approveUSDC(amount);
      setStep('bridge');
    } catch (error) {
      console.error('Approval failed:', error);
      setStep('input');
    }
  };

  const handleBridge = async () => {
    if (!amount || !stacksAddress) return;
    
    try {
      setStep('tracking');
      await bridgeToStacks(amount, stacksAddress);
    } catch (error) {
      console.error('Bridge failed:', error);
      setStep('input');
    }
  };

  const handleComplete = () => {
    // Bridge completed - could trigger vault deposit here
    console.log('Bridge completed, ready for vault deposit');
  };

  const needsApproval = amount ? !hasAllowance(amount) : true;
  const canProceed = ethConnected && stacksConnected && amount && Number(amount) > 0;

  return (
    <>
      <Button onClick={handleOpenZap} className="gap-2" variant="default">
        <Zap className="h-4 w-4" />
        Zap from ETH
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Zap: ETH USDC → Stacks Vault
            </DialogTitle>
            <DialogDescription>
              Bridge USDC from Ethereum to Stacks and deposit into the yield vault in one flow.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Connection Status */}
            {(!ethConnected || !stacksConnected) && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-destructive">Wallets Required</p>
                  <p className="text-muted-foreground">
                    {!ethConnected && 'Connect your Ethereum wallet. '}
                    {!stacksConnected && 'Connect your Stacks wallet.'}
                  </p>
                </div>
              </div>
            )}

            {/* Input Step */}
            {step === 'input' && (
              <>
                {/* From */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">From (Ethereum)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pr-20 font-number"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">USDC</span>
                      {usdcBalance > 0 && (
                        <button
                          onClick={() => setAmount(usdcBalance.toString())}
                          className="text-xs text-primary hover:underline"
                        >
                          Max
                        </button>
                      )}
                    </div>
                  </div>
                  {ethConnected && (
                    <p className="text-xs text-muted-foreground">
                      Balance: {formatNumber(usdcBalance, 2)} USDC
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="p-2 rounded-full bg-secondary">
                    <ArrowDown className="h-4 w-4" />
                  </div>
                </div>

                {/* To */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">To (Stacks Vault)</label>
                  <div className="p-3 rounded-lg bg-secondary/50 border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">You'll receive</span>
                      <span className="font-number font-semibold">
                        ~{amount || '0'} USDCx
                      </span>
                    </div>
                    {stacksAddress && (
                      <p className="text-xs text-muted-foreground mt-2">
                        To: {stacksAddress.slice(0, 10)}...{stacksAddress.slice(-8)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {canProceed && needsApproval ? (
                  <Button onClick={handleApprove} className="w-full" size="lg">
                    Approve USDC
                  </Button>
                ) : canProceed ? (
                  <Button onClick={handleBridge} className="w-full" size="lg" variant="success">
                    <Zap className="h-4 w-4 mr-2" />
                    Bridge to Stacks
                  </Button>
                ) : (
                  <Button disabled className="w-full" size="lg">
                    {!ethConnected || !stacksConnected ? 'Connect Wallets' : 'Enter Amount'}
                  </Button>
                )}
              </>
            )}

            {/* Tracking Step */}
            {(step === 'tracking' || bridgeState.status !== 'idle') && (
              <BridgeTracker 
                bridgeState={bridgeState} 
                stacksRecipient={stacksAddress || ''}
                onComplete={handleComplete}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

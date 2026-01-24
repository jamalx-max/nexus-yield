import { useState } from 'react';
import { ArrowDown, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { BridgeTracker } from './BridgeTracker';
import { DeployCapital } from './DeployCapital';
import { useBridge } from '../hooks/useBridge';
import { useUSDCxBalance } from '../hooks/useUSDCxBalance';
import { useStacksWallet } from '../providers/StacksWalletProvider';
import { useAccount } from 'wagmi';
import { formatNumber } from '../lib/utils';

export function ZapFlow() {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'input' | 'tracking'>('input');
  const [showDeployModal, setShowDeployModal] = useState(false);
  
  const { isConnected: ethConnected } = useAccount();
  const { isConnected: stacksConnected, address: stacksAddress } = useStacksWallet();
  
  // Get USDCx balance on Stacks
  const { balance: usdcxBalance, refetch: refetchUSDCx, isLoading: isLoadingUSDCx } = useUSDCxBalance();
  
  const { 
    bridgeState, 
    usdcBalance,
    ethBalance,
    allowance,
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
      // Don't change step to 'approve', keep input UI visible
      await approveUSDC(amount);
      // After success, button will naturally switch to "Bridge" due to hasAllowance check
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  const handleBridge = async () => {
    if (!amount || !stacksAddress) return;
    
    try {
      await bridgeToStacks(amount, stacksAddress);
      setStep('tracking');
    } catch (error) {
      console.error('Bridge failed:', error);
    }
  };

  const handleBridgeComplete = () => {
    // Bridge completed - close zap modal and show deploy modal
    console.log('Bridge completed, showing deploy modal');
    setIsOpen(false);
    setShowDeployModal(true);
  };

  const handleDeploySuccess = () => {
    // Reset everything after successful deployment
    setShowDeployModal(false);
    setAmount('');
    setStep('input');
    reset();
  };

  const needsApproval = amount ? !hasAllowance(amount) : true;
  const canProceed = ethConnected && stacksConnected && amount && Number(amount) > 0;
  const isApproving = bridgeState.status === 'approving';
  const isBridging = bridgeState.status === 'depositing' || bridgeState.status === 'pending_attestation';

  return (
    <>
      <Button onClick={handleOpenZap} className="gap-2 w-full" variant="default" size="lg">
        <Zap className="h-4 w-4" />
        Zap from ETH
      </Button>

      {/* Zap Flow Modal */}
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

            {/* Error Status */}
            {bridgeState.status === 'failed' && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-destructive">Transaction Failed</p>
                  <p className="text-muted-foreground text-xs break-all">
                    {bridgeState.error || 'User rejected request or transaction failed.'}
                  </p>
                </div>
              </div>
            )}

            {/* Input Step */}
            {step === 'input' && (
              <>
                {/* From */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <label className="text-muted-foreground">From (Ethereum)</label>
                    {ethConnected && (
                      <div className="flex gap-3 text-xs">
                        <span className="text-muted-foreground">ETH: {formatNumber(ethBalance, 4)}</span>
                        <span className="text-primary font-mono">
                          Allowance: {formatNumber(allowance, 2)} USDC
                        </span>
                      </div>
                    )}
                  </div>
                  
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
                      className="pr-20 font-number"
                      disabled={isApproving}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">USDC</span>
                      {usdcBalance > 0 && (
                        <button
                          onClick={() => setAmount(usdcBalance.toString())}
                          className="text-xs text-primary hover:underline"
                          disabled={isApproving}
                        >
                          Max
                        </button>
                      )}
                    </div>
                  </div>
                  {ethConnected && (
                    <p className="text-xs text-muted-foreground text-right">
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
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-muted-foreground">To (Stacks Vault)</label>
                    {stacksConnected && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground">
                          Available: <span className="font-number font-semibold text-primary">
                            {formatNumber(usdcxBalance, 2)} USDCx
                          </span>
                        </span>
                        <button 
                          onClick={refetchUSDCx}
                          className="p-0.5 hover:bg-secondary rounded transition-colors"
                          title="Refresh balance"
                          disabled={isLoadingUSDCx}
                        >
                          <RefreshCw className={`h-3 w-3 ${isLoadingUSDCx ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    )}
                  </div>
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
                  <div className="space-y-2">
                    <Button onClick={handleApprove} className="w-full" size="lg" disabled={isApproving}>
                      {isApproving ? 'Approving...' : 'Step 1: Approve USDC'}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">
                      You must approve the bridge contract to spend your USDC.
                    </p>
                  </div>
                ) : canProceed ? (
                  <div className="space-y-2">
                    <Button onClick={handleBridge} className="w-full" size="lg" variant="success" disabled={isBridging}>
                      {isBridging ? 'Bridging...' : 'Step 2: Bridge to Stacks'}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">
                      This will burn USDC on Ethereum and mint USDCx on Stacks.
                    </p>
                  </div>
                ) : (
                  <Button disabled className="w-full" size="lg">
                    {!ethConnected || !stacksConnected ? 'Connect Wallets' : 'Enter Amount'}
                  </Button>
                )}
              </>
            )}

            {/* Tracking Step */}
            {step === 'tracking' && (
              <BridgeTracker 
                bridgeState={bridgeState} 
                stacksRecipient={stacksAddress || ''}
                onComplete={handleBridgeComplete}
                onMintDetected={refetchUSDCx}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Deploy Capital Modal - Shows after bridge completes */}
      <DeployCapital
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        onDeploySuccess={handleDeploySuccess}
      />
    </>
  );
}

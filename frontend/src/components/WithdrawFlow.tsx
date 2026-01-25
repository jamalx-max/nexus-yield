import { useState } from 'react';
import { ArrowDown, ArrowDownToLine, AlertCircle, ExternalLink, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useWithdraw } from '../hooks/useWithdraw';
import { useUSDCxBalance } from '../hooks/useUSDCxBalance';
import { useStacksWallet } from '../providers/StacksWalletProvider';
import { useAccount } from 'wagmi';
import { formatNumber } from '../lib/utils';
import { WITHDRAW_TIME_ESTIMATES } from '../lib/bridge';
import { shortenTxHash } from '../lib/bridge/address';

interface WithdrawFlowProps {
  className?: string;
}

export function WithdrawFlow({ className }: WithdrawFlowProps) {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const { isConnected: ethConnected, address: ethAddress } = useAccount();
  const { isConnected: stacksConnected } = useStacksWallet();
  
  // Get USDCx balance on Stacks
  const { balance: usdcxBalance, refetch: refetchUSDCx } = useUSDCxBalance();
  
  const { 
    withdrawState, 
    withdrawToEthereum, 
    reset,
    canWithdraw,
    minWithdrawAmount,
  } = useWithdraw();

  const handleOpenWithdraw = () => {
    setIsOpen(true);
    reset();
  };

  const handleWithdraw = async () => {
    if (!amount || !ethAddress) return;
    
    try {
      await withdrawToEthereum(amount, ethAddress);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Withdrawal failed: ${errorMessage}`);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setAmount('');
    reset();
    refetchUSDCx();
  };

  const amountNum = Number(amount) || 0;
  const isValidAmount = amountNum >= minWithdrawAmount && amountNum <= usdcxBalance;
  const isBurning = withdrawState.status === 'burning';
  const isPending = withdrawState.status === 'pending_attestation';
  const isCompleted = withdrawState.status === 'completed';
  const isFailed = withdrawState.status === 'failed';

  // Calculate fee (approximately $4.80 for testnet/mainnet)
  const withdrawFee = 4.80;
  const receiveAmount = Math.max(0, amountNum - withdrawFee);

  return (
    <>
      <Button 
        onClick={handleOpenWithdraw} 
        className={`gap-2 ${className}`} 
        variant="outline" 
        size="lg"
        disabled={!stacksConnected || usdcxBalance < minWithdrawAmount}
      >
        <ArrowDownToLine className="h-4 w-4" />
        Withdraw to ETH
      </Button>

      {/* Withdraw Flow Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownToLine className="h-5 w-5 text-primary" />
              Withdraw: Stacks USDCx → ETH USDC
            </DialogTitle>
            <DialogDescription>
              Burn USDCx on Stacks to receive USDC on Ethereum. Powered by Circle xReserve.
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
                    {!stacksConnected && 'Connect your Stacks wallet. '}
                    {!ethConnected && 'Connect your Ethereum wallet.'}
                  </p>
                </div>
              </div>
            )}

            {/* Error Status */}
            {isFailed && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-destructive">Withdrawal Failed</p>
                  <p className="text-muted-foreground text-xs break-all">
                    {withdrawState.error || 'Transaction was rejected or failed.'}
                  </p>
                </div>
              </div>
            )}

            {/* Input Step */}
            {withdrawState.status === 'idle' && (
              <>
                {/* From */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <label className="text-muted-foreground">From (Stacks)</label>
                    {stacksConnected && (
                      <span className="text-xs text-primary font-mono">
                        Balance: {formatNumber(usdcxBalance, 2)} USDCx
                      </span>
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
                      className="pr-24 font-number"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">USDCx</span>
                      {usdcxBalance > minWithdrawAmount && (
                        <button
                          onClick={() => setAmount(usdcxBalance.toString())}
                          className="text-xs text-primary hover:underline"
                        >
                          Max
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {amountNum > 0 && amountNum < minWithdrawAmount && (
                    <p className="text-xs text-destructive">
                      Minimum withdrawal: {minWithdrawAmount} USDCx
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
                    <label className="text-sm text-muted-foreground">To (Ethereum)</label>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">You'll receive</span>
                      <span className="font-number font-semibold">
                        ~{formatNumber(receiveAmount, 2)} USDC
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Bridge fee</span>
                      <span>~${withdrawFee.toFixed(2)}</span>
                    </div>
                    {ethAddress && (
                      <p className="text-xs text-muted-foreground mt-2">
                        To: {ethAddress.slice(0, 10)}...{ethAddress.slice(-8)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Time Estimate */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-secondary/30 rounded">
                  <Clock className="h-3 w-3" />
                  <span>Estimated time: {WITHDRAW_TIME_ESTIMATES.testnet}</span>
                </div>

                {/* Action Button */}
                {canWithdraw && isValidAmount ? (
                  <div className="space-y-2">
                    <Button 
                      onClick={handleWithdraw} 
                      className="w-full" 
                      size="lg" 
                      disabled={isBurning}
                    >
                      {isBurning ? 'Processing...' : 'Withdraw to Ethereum'}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">
                      This will burn USDCx on Stacks and release USDC on Ethereum.
                    </p>
                  </div>
                ) : (
                  <Button disabled className="w-full" size="lg">
                    {!stacksConnected || !ethConnected 
                      ? 'Connect Wallets' 
                      : amountNum < minWithdrawAmount 
                        ? `Min ${minWithdrawAmount} USDCx`
                        : amountNum > usdcxBalance
                          ? 'Insufficient Balance'
                          : 'Enter Amount'
                    }
                  </Button>
                )}
              </>
            )}

            {/* Pending/Tracking Step */}
            {(isPending || isCompleted) && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    {isPending ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-primary animate-pulse" />
                        </div>
                        <div>
                          <p className="font-medium">Withdrawal Processing</p>
                          <p className="text-xs text-muted-foreground">
                            Waiting for Circle attestation...
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium text-green-500">Withdrawal Complete</p>
                          <p className="text-xs text-muted-foreground">
                            USDC has been released to your Ethereum wallet
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-number">{withdrawState.amount} USDCx</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Receive</span>
                      <span className="font-number">
                        ~{formatNumber(Number(withdrawState.amount || 0) - withdrawFee, 2)} USDC
                      </span>
                    </div>
                    {withdrawState.stacksTxId && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Stacks TX</span>
                        <a
                          href={`https://explorer.hiro.so/txid/${withdrawState.stacksTxId}?chain=testnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {shortenTxHash(withdrawState.stacksTxId, 6)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {isPending && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span>Circle attestation in progress ({WITHDRAW_TIME_ESTIMATES.testnet})</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button onClick={handleClose} variant="outline" className="w-full">
                  {isCompleted ? 'Done' : 'Close'}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

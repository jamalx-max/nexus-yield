import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { checkMintStatus, getEstimatedBridgeTime, shortenTxHash, type BridgeState } from '../lib/bridge';
import { CHAIN_CONFIG } from '../config/constants';
import { Progress } from './ui/progress';

interface BridgeTrackerProps {
  bridgeState: BridgeState;
  stacksRecipient: string;
  onComplete?: () => void;
  onMintDetected?: () => Promise<void>;
}

export function BridgeTracker({ bridgeState, stacksRecipient, onComplete, onMintDetected }: BridgeTrackerProps) {
  const [mintStatus, setMintStatus] = useState<'pending' | 'checking' | 'completed' | 'failed'>('pending');
  const [stacksTxId, setStacksTxId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);

  // Poll for mint status
  useEffect(() => {
    if (bridgeState.status !== 'pending_attestation' && 
        bridgeState.status !== 'minting' && 
        bridgeState.status !== 'depositing') {
      return;
    }

    const checkStatus = async () => {
      if (!bridgeState.hookData) return;
      
      setMintStatus('checking');
      const result = await checkMintStatus(bridgeState.hookData, stacksRecipient);
      
      if (result.success) {
        setMintStatus('completed');
        setStacksTxId(result.txId || null);
        setProgress(100);
        
        // Refresh USDCx balance before showing deploy modal
        if (onMintDetected) {
          await onMintDetected();
        }
        
        // Call onComplete immediately when REAL mint is detected
        onComplete?.();
      } else {
        setMintStatus('pending');
      }
    };

    // Only start checking if we have a transaction hash
    if (!bridgeState.ethTxHash) return;

    // Check immediately
    checkStatus();
    
    // Then poll every 15 seconds
    const interval = setInterval(checkStatus, 15000);
    
    return () => clearInterval(interval);
  }, [bridgeState.status, bridgeState.hookData, bridgeState.ethTxHash, stacksRecipient, onComplete, onMintDetected]);

  // Track elapsed time and update progress
  useEffect(() => {
    if (bridgeState.status === 'pending_attestation' || 
        bridgeState.status === 'minting' || 
        bridgeState.status === 'depositing') {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        
        // Simulate progress based on 15 minute (900s) expected wait
        // Cap at 95% until actually complete
        setProgress(() => {
          if (mintStatus === 'completed') return 100;
          const estimatedTotal = 900; // 15 mins
          const newProgress = Math.min((elapsedTime / estimatedTotal) * 100, 95);
          return newProgress;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [bridgeState.status, elapsedTime, mintStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (bridgeState.status === 'idle') {
    return null;
  }

  return (
    <Card className="glass border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {bridgeState.status === 'completed' ? (
            <CheckCircle className="h-5 w-5 text-accent" />
          ) : bridgeState.status === 'failed' ? (
            <XCircle className="h-5 w-5 text-destructive" />
          ) : (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          )}
          Bridge Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {(bridgeState.status === 'pending_attestation' || bridgeState.status === 'minting') && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Estimated time: ~15 mins</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Progress Steps */}
        <div className="space-y-3">
          {/* Step 1: Ethereum Deposit */}
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              bridgeState.ethTxHash ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
            }`}>
              {bridgeState.ethTxHash ? <CheckCircle className="h-4 w-4" /> : '1'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Deposit on Ethereum</p>
              {bridgeState.ethTxHash && (
                <a 
                  href={`${CHAIN_CONFIG.ethereum.blockExplorer}/tx/${bridgeState.ethTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  {shortenTxHash(bridgeState.ethTxHash)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Step 2: Attestation */}
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              mintStatus === 'completed' ? 'bg-accent text-accent-foreground' : 
              bridgeState.ethTxHash ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}>
              {mintStatus === 'completed' ? <CheckCircle className="h-4 w-4" /> : 
               bridgeState.ethTxHash ? <Loader2 className="h-4 w-4 animate-spin" /> : '2'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Circle Attestation</p>
              {bridgeState.ethTxHash && mintStatus !== 'completed' && (
                <p className="text-xs text-muted-foreground">
                  Processing... (~{getEstimatedBridgeTime()})
                </p>
              )}
            </div>
          </div>

          {/* Step 3: Stacks Mint */}
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              mintStatus === 'completed' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
            }`}>
              {mintStatus === 'completed' ? <CheckCircle className="h-4 w-4" /> : '3'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Mint USDCx on Stacks</p>
              {stacksTxId && (
                <a 
                  href={`https://explorer.hiro.so/txid/${stacksTxId}?chain=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  {shortenTxHash(stacksTxId)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Timer */}
        {(bridgeState.status === 'pending_attestation' || 
          bridgeState.status === 'depositing' || 
          bridgeState.status === 'minting') && (
          <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
        )}

        {/* Amount */}
        {bridgeState.amount && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Bridging: </span>
            <span className="font-number font-semibold">{bridgeState.amount} USDC</span>
          </div>
        )}

        {/* Error */}
        {bridgeState.error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {bridgeState.error}
          </div>
        )}

        {/* Completion Message */}
        {mintStatus === 'completed' && (
          <div className="p-3 rounded-lg bg-accent/10 text-accent text-sm text-center">
            USDCx successfully minted! You can now deposit into the vault.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { TrendingUp, ArrowRight, Wallet, Loader2, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { useState } from 'react';
import { formatUSD, formatPercent, formatNumber } from '../lib/utils';
import { useStacksWallet } from '../providers/StacksWalletProvider';
import { useAccount } from 'wagmi';
import { useVaultData } from '../hooks';
import { ZapFlow } from './ZapFlow';
import { YieldChart } from './YieldChart';
import { ADDRESSES } from '../config/constants';

export function Dashboard() {
  const [depositAmount, setDepositAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { isConnected: stacksConnected, address: stacksAddress } = useStacksWallet();
  const { isConnected: ethConnected } = useAccount();

  // Use real vault data from the Stacks contract
  const vaultData = useVaultData();

  // Competition rates for comparison
  const rates = {
    aave: 4.2,
    apex: vaultData.apy,
    advantage: vaultData.apy - 4.2,
  };

  // Handle withdraw
  const handleWithdraw = async () => {
    if (!stacksAddress || vaultData.userShares <= 0) return;
    
    setIsWithdrawing(true);
    
    try {
      const { openContractCall } = await import('@stacks/connect');
      const { uintCV, PostConditionMode } = await import('@stacks/transactions');
      
      const [vaultAddress, vaultName] = ADDRESSES.APEX_VAULT.split('.');
      const sharesInMicro = Math.floor(vaultData.userShares * 1_000_000);
      
      await openContractCall({
        contractAddress: vaultAddress,
        contractName: vaultName,
        functionName: 'withdraw',
        functionArgs: [uintCV(sharesInMicro)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log('Withdraw TX submitted:', data.txId);
          setIsWithdrawing(false);
        },
        onCancel: () => {
          console.log('User cancelled withdrawal');
          setIsWithdrawing(false);
        },
      });
    } catch (error) {
      console.error('Withdraw failed:', error);
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Rate Comparison */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Earn More on Your{' '}
          <span className="gradient-text">USDCx</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Bridge USDC from Ethereum to Stacks and earn up to 3x higher yields
          through optimized DeFi strategies.
        </p>
        
        {/* Rate Comparison */}
        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Aave (Ethereum)</p>
            <p className="text-3xl font-number text-muted-foreground">{formatPercent(rates.aave)}</p>
          </div>
          <ArrowRight className="h-8 w-8 text-primary" />
          <div className="text-center">
            <p className="text-primary text-sm font-medium">Apex Yield (Stacks)</p>
            {vaultData.isLoading ? (
              <Skeleton className="h-10 w-24 mx-auto" />
            ) : (
              <p className="text-4xl font-number text-accent font-bold glow-accent">{formatPercent(rates.apex)}</p>
            )}
          </div>
        </div>
        <p className="text-sm text-accent">
          +{formatPercent(rates.advantage)} advantage
        </p>
      </div>

      {/* Demo Mode Banner */}
      <div className="max-w-3xl mx-auto">
        <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Hackathon Demo</p>
              <p className="text-muted-foreground mt-1">
                This demo uses <strong>simulated block-based yield</strong> (10 bps per 100 blocks = ~13.5% APY). 
                The bridge integration uses <strong>real Circle xReserve infrastructure</strong>. 
                Production deployment will integrate with Stacks lending protocols like Zest and Bitflow for actual borrower-backed yields.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Total Value Locked</CardDescription>
            {vaultData.isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <CardTitle className="text-2xl font-number">
                {formatUSD(vaultData.totalAssets)}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Exchange Rate</CardDescription>
            {vaultData.isLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <CardTitle className="text-2xl font-number">
                1 apUSDCx = {formatNumber(vaultData.exchangeRate, 4)} USDCx
              </CardTitle>
            )}
          </CardHeader>
        </Card>
        
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Current APY</CardDescription>
            {vaultData.isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <CardTitle className="text-2xl font-number text-accent">
                {formatPercent(vaultData.apy)}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>

      {/* Yield Comparison Chart */}
      <div className="max-w-3xl mx-auto">
        <YieldChart 
          initialInvestment={10000} 
          aaveApy={rates.aave} 
          apexApy={rates.apex} 
        />
      </div>

      {/* Error State */}
      {vaultData.error && (
        <Card className="max-w-md mx-auto border-destructive/50 bg-destructive/5">
          <CardContent className="pt-4">
            <p className="text-sm text-destructive text-center">
              Unable to fetch vault data. Using cached values.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Deposit Card */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Deposit USDCx
          </CardTitle>
          <CardDescription>
            Deposit USDCx to receive yield-bearing apUSDCx shares
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Amount</label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="pr-20 font-number"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                USDCx
              </span>
            </div>
          </div>

          {stacksConnected ? (
            <Button className="w-full" variant="success" size="lg" disabled={vaultData.isLoading}>
              {vaultData.isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2" />
              )}
              Deposit
            </Button>
          ) : ethConnected ? (
            <div className="space-y-2">
              {/* Zap Flow - Bridge from Ethereum */}
              <ZapFlow />
              <p className="text-xs text-muted-foreground text-center">
                One-click bridge from Ethereum USDC via Circle xReserve
              </p>
            </div>
          ) : (
            <Button className="w-full" variant="outline" size="lg" disabled>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet First
            </Button>
          )}

          {/* Preview */}
          {depositAmount && Number(depositAmount) > 0 && (
            <div className="p-3 rounded-lg bg-secondary/50 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">You will receive</span>
                <span className="font-number">
                  {formatNumber(Number(depositAmount) / vaultData.exchangeRate, 2)} apUSDCx
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current rate</span>
                <span className="font-number">
                  1:{formatNumber(vaultData.exchangeRate, 4)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Position */}
      {stacksConnected && vaultData.userShares > 0 && (
        <Card className="max-w-md mx-auto glass border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Your Position</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shares</span>
              <span className="font-number">{formatNumber(vaultData.userShares, 2)} apUSDCx</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Value</span>
              <span className="font-number text-accent">{formatUSD(vaultData.userAssets)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Earnings</span>
              <span className="font-number text-accent">
                +{formatUSD(vaultData.userAssets - vaultData.userShares)}
              </span>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={handleWithdraw}
              disabled={isWithdrawing || vaultData.userShares <= 0}
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Withdrawing...
                </>
              ) : (
                'Withdraw'
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

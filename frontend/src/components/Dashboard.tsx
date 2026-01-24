import { TrendingUp, Wallet, Loader2, Info, Lock, Activity, ArrowUpRight, RefreshCw, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { useState } from 'react';
import { formatUSD, formatPercent, formatNumber } from '../lib/utils';
import { useStacksWallet } from '../providers/StacksWalletProvider';
import { useAccount } from 'wagmi';
import { useVaultData, useUSDCxBalance } from '../hooks';
import { useBridge } from '../hooks/useBridge';
import { ZapFlow } from './ZapFlow';
import { YieldChart } from './YieldChart';
import { ADDRESSES } from '../config/constants';
import { showToast, shortenTxHash } from '../lib/toast';
import { CountUp } from './ui/count-up';

export function Dashboard() {
  const [depositAmount, setDepositAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isConnected: stacksConnected, address: stacksAddress } = useStacksWallet();
  const { isConnected: ethConnected } = useAccount();

  // Use real vault data from the Stacks contract
  const vaultData = useVaultData();
  
  // Get USDCx balance on Stacks
  const { balance: usdcxBalance, refetch: refetchUSDCx, isLoading: isLoadingUSDCx } = useUSDCxBalance();
  
  // Get ETH and USDC balances from bridge hook
  const { usdcBalance, ethBalance } = useBridge();

  // Competition rates for comparison
  const rates = {
    aave: 4.2,
    apex: vaultData.apy,
    advantage: vaultData.apy - 4.2,
  };

  // Calculate projected earnings
  const amount = Number(depositAmount) || 0;
  const dailyYield = (amount * (vaultData.apy / 100)) / 365;
  const weeklyYield = dailyYield * 7;
  const yearlyYield = amount * (vaultData.apy / 100);

  // Handle manual balance refresh
  const handleRefreshBalances = async () => {
    setIsRefreshing(true);
    try {
      await refetchUSDCx();
    } finally {
      // Keep spinner for at least 500ms for visual feedback
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    if (!stacksAddress || !depositAmount || Number(depositAmount) <= 0) return;

    setIsDepositing(true);

    try {
      const { openContractCall } = await import('@stacks/connect');
      const { 
        uintCV, 
        PostConditionMode, 
        makeStandardFungiblePostCondition,
        FungibleConditionCode,
        createAssetInfo 
      } = await import('@stacks/transactions');
      const network = await import('@stacks/network');

      const amountMicroUsdc = Math.floor(Number(depositAmount) * 1_000_000);
      const [vaultAddress, vaultName] = ADDRESSES.APEX_VAULT.split('.');
      const [tokenAddress, tokenName] = ADDRESSES.USDCX_TOKEN.split('.');

      await openContractCall({
        network: network.STACKS_TESTNET,
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
          showToast.success(`Deposit submitted! TX: ${shortenTxHash(data.txId)}`);
          setIsDepositing(false);
          setDepositAmount('');
          refetchUSDCx();
          vaultData.refetch(); // Refresh vault data (TVL, shares, etc.)
        },
        onCancel: () => {
          showToast.info('Deposit cancelled');
          setIsDepositing(false);
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast.error(`Deposit failed: ${errorMessage}`);
      setIsDepositing(false);
    }
  };

  // Handle withdraw
  const handleWithdraw = async () => {
    if (!stacksAddress || vaultData.userShares <= 0) return;
    
    setIsWithdrawing(true);
    
    try {
      const { openContractCall } = await import('@stacks/connect');
      const { uintCV, PostConditionMode } = await import('@stacks/transactions');
      const network = await import('@stacks/network');
      
      const [vaultAddress, vaultName] = ADDRESSES.APEX_VAULT.split('.');
      const sharesInMicro = Math.floor(vaultData.userShares * 1_000_000);
      
      await openContractCall({
        network: network.STACKS_TESTNET,
        contractAddress: vaultAddress,
        contractName: vaultName,
        functionName: 'withdraw',
        functionArgs: [uintCV(sharesInMicro)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          showToast.success(`Withdrawal submitted! TX: ${shortenTxHash(data.txId)}`);
          setIsWithdrawing(false);
          refetchUSDCx(); // Refresh USDCx balance (user now has more)
          vaultData.refetch(); // Refresh vault data (TVL, shares, etc.)
        },
        onCancel: () => {
          showToast.info('Withdrawal cancelled');
          setIsWithdrawing(false);
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast.error(`Withdrawal failed: ${errorMessage}`);
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tighter uppercase glitch" data-text="DASHBOARD">
            DASHBOARD
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            <span className="text-primary">●</span> LIVE_NET_STATUS: ONLINE
          </p>
        </div>
        
        {/* Market Advantage Pill */}
        <div className="flex items-center gap-4 bg-card border border-border px-4 py-2 rounded-none skew-x-[-10deg]">
          <div className="skew-x-[10deg] flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">MARKET_ADVANTAGE</span>
            <span className="font-heading font-bold text-accent">+{formatPercent(rates.advantage)}</span>
          </div>
        </div>
      </div>

      {/* Wallet Balances Section */}
      {(stacksConnected || ethConnected) && (
        <div className="border border-border/50 bg-card/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
              Wallet Balances
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefreshBalances}
              disabled={isRefreshing || isLoadingUSDCx}
              className="h-7 w-7 p-0 hover:bg-secondary"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing || isLoadingUSDCx ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
            <div className="p-3 bg-background/50 border border-border/30">
              <p className="text-muted-foreground text-xs mb-1">ETH (Sepolia)</p>
              <p className="font-semibold text-lg">
                {ethConnected ? formatNumber(ethBalance, 4) : '--'}
              </p>
            </div>
            <div className="p-3 bg-background/50 border border-border/30">
              <p className="text-muted-foreground text-xs mb-1">USDC (Sepolia)</p>
              <p className="font-semibold text-lg">
                {ethConnected ? formatNumber(usdcBalance, 2) : '--'}
              </p>
            </div>
            <div className="p-3 bg-background/50 border border-primary/20">
              <p className="text-muted-foreground text-xs mb-1">USDCx (Stacks)</p>
              <p className="font-semibold text-lg text-primary">
                {stacksConnected ? formatNumber(usdcxBalance, 2) : '--'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Banner - System Style */}
      <div className="border border-primary/30 bg-primary/5 p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm font-mono">
            <p className="font-bold text-primary uppercase mb-1">SYSTEM_NOTICE: DEMO_MODE</p>
            <p className="text-muted-foreground">
              Connected to <strong className="text-foreground">Circle USDCx Mainnet</strong> (Bridged via CCTP). 
              Yield simulation active (10bps/100blocks). 
              <span className="block mt-1 opacity-70">Pending dependency: Zest Protocol Mainnet Launch.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-mono text-xs text-muted-foreground uppercase">Total Value Locked</h3>
            <Lock className="w-4 h-4 text-primary" />
          </div>
          {vaultData.isLoading ? (
            <Skeleton className="h-8 w-32 bg-muted/20" />
          ) : (
            <div className="space-y-1">
              <p className="text-3xl font-heading font-bold text-foreground tracking-tight">
                <CountUp end={vaultData.totalAssets} prefix="$" />
              </p>
              <p className="text-xs font-mono text-primary">
                +12.5% <span className="text-muted-foreground">vs last epoch</span>
              </p>
            </div>
          )}
        </div>
        
        <div className="cyber-card p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-mono text-xs text-muted-foreground uppercase">Exchange Rate</h3>
            <Activity className="w-4 h-4 text-secondary" />
          </div>
          {vaultData.isLoading ? (
            <Skeleton className="h-8 w-40 bg-muted/20" />
          ) : (
            <div className="space-y-1">
              <p className="text-3xl font-heading font-bold text-foreground tracking-tight">
                <CountUp end={vaultData.exchangeRate} decimals={4} />
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                1 apUSDCx = {formatNumber(vaultData.exchangeRate, 4)} USDCx
              </p>
            </div>
          )}
        </div>
        
        <div className="cyber-card p-6 border-accent/50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-mono text-xs text-accent uppercase">Current Yield (APY)</h3>
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          {vaultData.isLoading ? (
            <Skeleton className="h-8 w-20 bg-muted/20" />
          ) : (
            <div className="space-y-1">
              <p className="text-3xl font-heading font-bold text-accent tracking-tight glow-accent">
                {formatPercent(vaultData.apy)}
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Optimized via Stacks L2
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="cyber-card p-1">
            <YieldChart 
              initialInvestment={10000} 
              aaveApy={rates.aave} 
              apexApy={rates.apex} 
            />
          </div>

          {/* User Position Card */}
          {stacksConnected && vaultData.userShares > 0 && (
            <div className="cyber-card p-6 border-l-4 border-l-primary">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading text-xl font-bold">YOUR_POSITION</h3>
                <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-mono">ACTIVE</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">SHARES</p>
                  <p className="font-number text-lg">{formatNumber(vaultData.userShares, 2)}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">VALUE</p>
                  <p className="font-number text-lg text-foreground">{formatUSD(vaultData.userAssets)}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-accent mb-1">EARNINGS</p>
                  <p className="font-number text-lg text-accent">+{formatUSD(vaultData.userAssets - vaultData.userShares)}</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-primary/50 text-primary hover:bg-primary hover:text-black font-bold font-mono rounded-none"
                onClick={handleWithdraw}
                disabled={isWithdrawing || vaultData.userShares <= 0}
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    PROCESSING_WITHDRAWAL...
                  </>
                ) : (
                  'INITIATE_WITHDRAWAL'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="space-y-6">
          <div className="cyber-card p-6">
            <h3 className="font-heading text-xl font-bold mb-1">DEPOSIT_ASSETS</h3>
            <p className="text-xs font-mono text-muted-foreground mb-6">Mint yield-bearing apUSDCx</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-mono text-muted-foreground">AMOUNT</label>
                  <button 
                    onClick={() => setDepositAmount(usdcxBalance.toString())}
                    className="text-xs font-mono text-primary hover:underline cursor-pointer"
                  >
                    MAX: {formatNumber(usdcxBalance, 2)}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setDepositAmount(value);
                      }
                    }}
                    className="pr-20 font-mono bg-background/50 border-border focus:border-primary rounded-none h-12 text-lg"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    USDCx
                  </span>
                </div>

                {/* Earnings Calculator */}
                {amount > 0 && (
                  <div className="bg-secondary/10 border border-secondary/20 p-3 rounded-none animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-2 text-xs text-secondary font-bold">
                      <Calculator className="w-3 h-3" />
                      PROJECTED RETURNS
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Daily:</span>
                        <span>{formatUSD(dailyYield)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weekly:</span>
                        <span>{formatUSD(weeklyYield)}</span>
                      </div>
                      <div className="col-span-2 flex justify-between border-t border-secondary/20 pt-1 mt-1">
                        <span className="text-muted-foreground">Yearly:</span>
                        <span className="text-secondary font-bold">{formatUSD(yearlyYield)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {stacksConnected ? (
                <div className="space-y-6">
                  <Button 
                    className="w-full h-12 bg-primary text-black hover:bg-white font-bold font-mono rounded-none text-base transition-all" 
                    onClick={handleDeposit}
                    disabled={isDepositing || Number(depositAmount) <= 0 || Number(depositAmount) > usdcxBalance}
                  >
                    {isDepositing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="h-5 w-5 mr-2" />
                        CONFIRM_DEPOSIT
                      </>
                    )}
                  </Button>

                  <div className="border-t border-dashed border-border pt-4">
                    <p className="text-[10px] font-mono text-center text-muted-foreground mb-3">
                      NEED ASSETS? BRIDGE FROM ETHEREUM
                    </p>
                    <ZapFlow />
                  </div>
                </div>
              ) : ethConnected ? (
                <div className="space-y-4">
                  <div className="p-4 border border-secondary/30 bg-secondary/5">
                    <ZapFlow />
                  </div>
                  <p className="text-[10px] font-mono text-center text-muted-foreground">
                    POWERED BY CIRCLE CCTP
                  </p>
                </div>
              ) : (
                <Button className="w-full h-12 border border-border bg-transparent hover:bg-muted text-muted-foreground font-mono rounded-none" disabled>
                  <Wallet className="h-4 w-4 mr-2" />
                  CONNECT_WALLET_REQUIRED
                </Button>
              )}

              {/* Preview */}
              {depositAmount && Number(depositAmount) > 0 && (
                <div className="mt-4 pt-4 border-t border-dashed border-border">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-muted-foreground">EST_RECEIVE:</span>
                    <span className="text-foreground">
                      {formatNumber(Number(depositAmount) / vaultData.exchangeRate, 2)} apUSDCx
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">RATE:</span>
                    <span className="text-accent">
                      1:{formatNumber(vaultData.exchangeRate, 4)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="cyber-card p-4 bg-muted/20">
            <h4 className="font-mono text-xs font-bold text-muted-foreground mb-3 uppercase">Protocol Specs</h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Strategy</span>
                <span>Lending Arbitrage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lock Period</span>
                <span>None (Liquid)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Rating</span>
                <span className="text-primary">Low-Medium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowRight, Zap, Layers, Lock, ChevronRight, Cpu, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary skew-x-[-10deg] flex items-center justify-center">
              <Cpu className="text-black w-6 h-6 skew-x-[10deg]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-heading font-bold text-xl leading-none tracking-tighter">APEX</span>
              <span className="font-mono text-xs text-primary tracking-widest">YIELD_PROTOCOL</span>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition-all rounded-none"
          >
            [ LAUNCH_APP ]
          </Button>
        </nav>

        {/* Hero Section */}
        <div className="py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-20">
            <div className="inline-block px-3 py-1 border border-accent/30 bg-accent/5 text-accent font-mono text-xs mb-4">
              /// STACKS_BUILD_2026
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-[0.9] tracking-tighter">
              PROGRAM<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent glitch" data-text="MONEY">
                MONEY
              </span>
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-lg leading-relaxed">
              Arbitrage the <span className="text-foreground font-bold">$25B gap</span> between Ethereum and Bitcoin DeFi. 
              Built on Stacks with Circle CCTP.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 h-14 rounded-none skew-x-[-5deg]"
              >
                START EARNING <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/why')}
                className="border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground font-mono h-14 rounded-none skew-x-[-5deg] transition-all"
              >
                WHY?
              </Button>
            </div>
          </div>

          <div className="relative">
            {/* Visual Abstract Chart */}
            <div className="relative z-10 bg-card border border-border p-6 md:p-8 skew-y-[-2deg] shadow-2xl shadow-primary/10 hover:skew-y-0 transition-transform duration-500">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="font-mono text-xs text-muted-foreground mb-1">CURRENT_YIELD</p>
                  <p className="font-heading text-5xl font-bold text-primary">13.5%</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-muted-foreground mb-1">VS_ETH_AAVE</p>
                  <p className="font-heading text-3xl font-bold text-muted-foreground line-through decoration-destructive">4.2%</p>
                </div>
              </div>
              <div className="h-4 bg-muted overflow-hidden">
                <div className="h-full bg-primary w-[85%] animate-pulse" />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 border border-border">
                  <p className="font-mono text-xs text-accent mb-1">PROTOCOL</p>
                  <p className="font-bold">Zest + Bitflow</p>
                </div>
                <div className="p-4 bg-background/50 border border-border">
                  <p className="font-mono text-xs text-accent mb-1">ASSET</p>
                  <p className="font-bold">USDCx</p>
                </div>
              </div>
            </div>
            
            {/* Decorative Background Card */}
            <div className="absolute top-4 left-4 w-full h-full border-2 border-dashed border-secondary/30 -z-10 skew-y-[-2deg]" />
          </div>
        </div>

        {/* SECTION 2: THE OPPORTUNITY (Visual Yield Comparison) */}
        <div className="py-16 border-t border-border/50">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">THE OPPORTUNITY</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ethereum stablecoin yields have collapsed. The smart money is moving to Bitcoin L2s.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none" />
            
            <div className="space-y-8">
              {/* Ethereum Bar */}
              <div>
                <div className="flex justify-between mb-2 font-mono text-sm">
                  <span className="text-muted-foreground">AAVE (ETH)</span>
                  <span className="text-muted-foreground">4.2%</span>
                </div>
                <div className="h-4 bg-secondary/10 rounded-sm overflow-hidden">
                  <div className="h-full bg-muted w-[30%]" />
                </div>
              </div>

              {/* Compound Bar */}
              <div>
                <div className="flex justify-between mb-2 font-mono text-sm">
                  <span className="text-muted-foreground">COMPOUND (ETH)</span>
                  <span className="text-muted-foreground">3.9%</span>
                </div>
                <div className="h-4 bg-secondary/10 rounded-sm overflow-hidden">
                  <div className="h-full bg-muted w-[28%]" />
                </div>
              </div>

              {/* Apex Bar */}
              <div className="relative">
                <div className="flex justify-between mb-2 font-mono text-sm">
                  <span className="text-primary font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4" /> APEX_VAULT (STACKS)
                  </span>
                  <span className="text-primary font-bold text-lg">13.5% + POINTS</span>
                </div>
                <div className="h-8 bg-secondary/10 rounded-sm overflow-hidden relative shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  <div className="h-full bg-gradient-to-r from-primary to-accent w-[95%] animate-pulse" />
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                </div>
                <p className="text-xs text-accent mt-2 font-mono text-right">
                  /// ALPHA_DETECTED: EARLY_ADOPTER_INCENTIVES
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: THE STRATEGY (Zest + Bitflow) */}
        <div className="py-16 border-t border-border/50">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">THE STRATEGY</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We aggregate yield from the leading protocols on Stacks. 
              We do the hard work of bridging, depositing, and auto-compounding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Zest Protocol */}
            <Card className="bg-card border-border group hover:border-primary/50 transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Zest Protocol</h3>
                <div className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono mb-4 rounded">
                  LENDING_MARKET
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  The first on-chain lending market on Stacks. Earn yield by supplying USDC to borrowers.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-primary" /> 
                    Supply APY: ~8-12%
                  </li>
                  <li className="flex items-center gap-2 text-accent">
                    <ChevronRight className="w-3 h-3" /> 
                    + Zest Points (Airdrop)
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Bitflow Finance */}
            <Card className="bg-card border-border group hover:border-secondary/50 transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Bitflow Finance</h3>
                <div className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary text-xs font-mono mb-4 rounded">
                  REAL_YIELD_DEX
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  The liquidity hub for Bitcoiners. Earn "Real Yield" from trading fees on stablecoin pools.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-secondary" /> 
                    aeUSDC-USDCx Pool
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-secondary" /> 
                    Yield in USDC (No dumps)
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Apex Vault */}
            <Card className="bg-card border-border group hover:border-accent/50 transition-all relative overflow-hidden shadow-lg shadow-accent/5">
              <div className="absolute top-0 right-0 p-2">
                <div className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded">
                  YOU ARE HERE
                </div>
              </div>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Apex Vault</h3>
                <div className="inline-block px-2 py-0.5 bg-accent/10 text-accent text-xs font-mono mb-4 rounded">
                  YIELD_AGGREGATOR
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  We automate the entire process. Deposit once, earn forever.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-accent" /> 
                    Auto-Compound Rewards
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-accent" /> 
                    Gas Optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-accent" /> 
                    Strategy Switching
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SECTION 4: THE MECHANICS (Vault Logic) */}
        <div className="py-16 border-t border-border/50">
           <div className="bg-card/30 border border-border/50 rounded-lg p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            
            <h2 className="font-heading text-2xl font-bold mb-8 text-center">THE VAULT LOGIC</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left relative z-10">
              <div className="flex flex-col items-center p-4 bg-background border border-border rounded-lg w-full md:w-48">
                <span className="font-mono text-xs text-muted-foreground mb-2">STEP 01</span>
                <span className="font-bold text-lg mb-1">DEPOSIT</span>
                <span className="text-sm text-muted-foreground">USDCx (Stacks)</span>
              </div>

              <ArrowRight className="text-muted-foreground rotate-90 md:rotate-0" />

              <div className="flex flex-col items-center p-4 bg-background border border-border rounded-lg w-full md:w-48">
                <span className="font-mono text-xs text-muted-foreground mb-2">STEP 02</span>
                <span className="font-bold text-lg mb-1">MINT</span>
                <span className="text-sm text-muted-foreground">apUSDC Shares</span>
              </div>

              <ArrowRight className="text-muted-foreground rotate-90 md:rotate-0" />

              <div className="flex flex-col items-center p-4 bg-background border border-primary/50 rounded-lg w-full md:w-48 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                <span className="font-mono text-xs text-primary mb-2">STEP 03</span>
                <span className="font-bold text-lg mb-1 text-primary">GROWTH</span>
                <span className="text-sm text-muted-foreground">Auto-Compound</span>
              </div>
            </div>

            <div className="mt-8 text-center max-w-2xl mx-auto text-sm text-muted-foreground relative z-10">
              <p>
                When you deposit, you receive <span className="font-mono text-foreground">apUSDC</span>. 
                The vault puts pooled capital into Zest & Bitflow. 
                As yield is generated, the vault uses it to buy <strong>more USDC</strong>. 
                Your <span className="font-mono text-foreground">apUSDC</span> is now worth more USDC than when you started.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5: THE ARCHITECTURE */}
        <div className="py-16 border-t border-border/50">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold mb-4">THE ARCHITECTURE</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We leverage Circle's Cross-Chain Transfer Protocol (CCTP) to bridge USDC securely, 
              then deploy into Stacks' emerging yield markets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:border-primary transition-colors group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <Layers className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3">Layer 2 Yield</h3>
                <p className="text-muted-foreground mb-4">
                  Bitcoin L2s like Stacks offer significantly higher borrower demand than saturated Ethereum markets.
                </p>
                <div className="font-mono text-xs text-primary flex items-center">
                  STATUS: LIVE_DEMO <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-secondary transition-colors group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                  <Zap className="w-6 h-6 text-secondary group-hover:text-secondary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3">Zero Slippage</h3>
                <p className="text-muted-foreground mb-4">
                  Using Circle CCTP means 1:1 mint/burn. No liquidity pools, no slippage, just pure transfer.
                </p>
                <div className="font-mono text-xs text-secondary flex items-center">
                  STATUS: INTEGRATED <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-accent transition-colors group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                  <Lock className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3">Feasibility</h3>
                <p className="text-muted-foreground mb-4">
                  Direct integration with lending protocols. Currently waiting for Zest USDCx pool mainnet launch.
                </p>
                <div className="font-mono text-xs text-accent flex items-center">
                  STATUS: PENDING_PARTNER <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground">
          <div className="font-mono">APEX_YIELD_v1.0.0</div>
          <div className="flex gap-6">
            <a href="https://github.com/man-croft/ApexYield" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GITHUB</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

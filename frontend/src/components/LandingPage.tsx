import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowRight, Zap, Layers, Lock, ChevronRight, Cpu, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollAnimation } from './ui/scroll-animation';

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
          <ScrollAnimation variant="slideRight" className="space-y-8 relative z-20">
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
          </ScrollAnimation>

          <ScrollAnimation variant="slideLeft" className="relative">
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
          </ScrollAnimation>
        </div>

        {/* SECTION 2: THE OPPORTUNITY (Visual Yield Comparison) */}
        <ScrollAnimation variant="fade" className="py-16 border-t border-border/50">
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
        </ScrollAnimation>

        {/* SECTION 3: THE YIELD STACK (Zest + Bitflow) */}
        <ScrollAnimation variant="slideUp" className="py-24 border-t border-border/50 bg-secondary/5">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-6">THE YIELD STACK</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We don't just bridge. We compose the best DeFi sources on Stacks into a single, optimized vault.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-4">
            {/* Left: The Stack Visual */}
            <div className="relative space-y-4">
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/50 to-accent/50 -z-10" />
              
              {/* Layer 3: The Aggregate */}
              <div className="ml-0 bg-card border border-primary/30 p-6 rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.1)] relative transform transition-transform hover:-translate-y-1 duration-300">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-heading text-xl font-bold text-primary">APEX VAULT</h3>
                  <span className="font-mono text-xl font-bold text-primary">~13.5% APY</span>
                </div>
                <p className="text-sm text-muted-foreground">Auto-compounding, gas-optimized, single-token receipt (apUSDC).</p>
              </div>

              {/* Connector Line */}
              <div className="ml-12 h-8 border-l-2 border-dashed border-muted-foreground/30" />

              {/* Layer 2: Bitflow */}
              <div className="ml-12 bg-card/50 border border-border p-5 rounded-lg relative hover:bg-card transition-colors">
                <div className="absolute -left-[2.1rem] top-1/2 -translate-y-1/2 w-4 h-4 bg-secondary rounded-full border-4 border-background" />
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-secondary" /> Bitflow Finance
                  </h4>
                  <span className="font-mono text-secondary text-sm">+ ~5.5%</span>
                </div>
                <p className="text-xs text-muted-foreground">Real Yield from stablecoin swap fees (USDC/stX).</p>
              </div>

              {/* Connector Line */}
              <div className="ml-12 h-4 border-l-2 border-dashed border-muted-foreground/30" />

              {/* Layer 1: Zest */}
              <div className="ml-12 bg-card/50 border border-border p-5 rounded-lg relative hover:bg-card transition-colors">
                <div className="absolute -left-[2.1rem] top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background" />
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" /> Zest Protocol
                  </h4>
                  <span className="font-mono text-accent text-sm">+ ~8.0%</span>
                </div>
                <p className="text-xs text-muted-foreground">Base lending APY + Early Adopter Points.</p>
              </div>
            </div>

            {/* Right: The Explanation */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-primary" />
                  Why Stacks Yields Are Higher
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bitcoin is a $1 Trillion asset class with almost zero native yield. 
                  Stacks brings smart contracts to Bitcoin.
                  <br /><br />
                  Borrowers on Stacks are willing to pay <strong className="text-foreground">premium rates (12-15%)</strong> to borrow stablecoins against their BTC collateral. 
                  Ethereum markets are saturated; Stacks markets are starving for liquidity.
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Institutional Safety
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Assets secured by <strong>Bitcoin finality</strong> via Stacks Nakamoto Release.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span><strong>Circle CCTP</strong> ensures 1:1 bridging (no bridge hacks).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Non-custodial vault logic (auditable Clarity code).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* SECTION 4: THE MECHANICS (Vault Logic) */}
        <ScrollAnimation variant="scale" className="py-16 border-t border-border/50">
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
        </ScrollAnimation>

        {/* SECTION 5: THE ARCHITECTURE */}
        <ScrollAnimation variant="slideUp" className="py-16 border-t border-border/50">
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
        </ScrollAnimation>

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

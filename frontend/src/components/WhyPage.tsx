import { ArrowRight, TrendingUp, ShieldCheck, Zap, ChevronRight, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { ScrollAnimation } from './ui/scroll-animation';

export function WhyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-12">
          <Link to="/">
            <Button 
              variant="ghost" 
              className="font-mono text-muted-foreground hover:text-primary pl-0 hover:bg-transparent"
            >
              {'< RETURN_TO_BASE'}
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          <ScrollAnimation variant="slideRight">
            <div className="inline-block px-3 py-1 border border-destructive/30 bg-destructive/5 text-destructive font-mono text-xs mb-4">
              /// MARKET_ALERT: SATURATION_DETECTED
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              ESCAPE THE <br />
              <span className="text-muted-foreground line-through decoration-destructive decoration-4">LOW YIELD</span>
              <span className="text-primary block mt-2">TRAP</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Ethereum stablecoin yields have collapsed to <span className="text-foreground font-bold">~4.2%</span>. 
              Capital is abundant, but opportunity is scarce. 
              <br /><br />
              The smart money is moving to where the demand is: <span className="text-foreground font-bold">Bitcoin L2s</span>.
            </p>
            <Button onClick={() => navigate('/dashboard')} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-14 px-8 font-bold text-lg skew-x-[-5deg]">
              DEPLOY_CAPITAL <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </ScrollAnimation>

          {/* Comparative Chart */}
          <ScrollAnimation variant="slideLeft" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full opacity-30" />
            <Card className="bg-card/50 backdrop-blur-sm border-border relative overflow-hidden">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-mono text-sm text-muted-foreground">YIELD_ANALYSIS_V1</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-primary/50" />
                  </div>
                </div>

                <div className="space-y-6">
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

                  {/* Stacks Bar */}
                  <div className="relative">
                    <div className="flex justify-between mb-2 font-mono text-sm">
                      <span className="text-primary font-bold flex items-center gap-2">
                        <Zap className="w-3 h-3" /> APEX_VAULT (STACKS)
                      </span>
                      <span className="text-primary font-bold text-lg">13.5% + POINTS</span>
                    </div>
                    <div className="h-6 bg-secondary/10 rounded-sm overflow-hidden relative">
                      <div className="h-full bg-gradient-to-r from-primary to-accent w-[95%] animate-pulse" />
                      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                    </div>
                    <p className="text-xs text-accent mt-2 font-mono text-right">
                      /// ALPHA_DETECTED: EARLY_ADOPTER_INCENTIVES
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>

        {/* The Strategy Section */}
        <ScrollAnimation variant="fade" className="mb-24">
          <div className="text-center mb-16">
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
            <Card className="bg-card border-border group hover:border-accent/50 transition-all relative overflow-hidden">
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
        </ScrollAnimation>

        {/* How It Works (The Logic) */}
        <ScrollAnimation variant="scale" className="bg-card/30 border border-border/50 rounded-lg p-8 md:p-12">
          <h2 className="font-heading text-2xl font-bold mb-8 text-center">THE VAULT LOGIC</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
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

          <div className="mt-8 text-center max-w-2xl mx-auto text-sm text-muted-foreground">
            <p>
              When you deposit, you receive <span className="font-mono text-foreground">apUSDC</span>. 
              The vault puts pooled capital into Zest & Bitflow. 
              As yield is generated, the vault uses it to buy <strong>more USDC</strong>. 
              Your <span className="font-mono text-foreground">apUSDC</span> is now worth more USDC than when you started.
            </p>
          </div>
        </ScrollAnimation>

        {/* Footer CTA */}
        <ScrollAnimation variant="slideUp" className="mt-24 text-center">
          <p className="font-mono text-sm text-muted-foreground mb-6">
            /// READY_TO_INITIATE_SEQUENCE?
          </p>
          <Button onClick={() => navigate('/dashboard')} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-16 px-12 font-bold text-xl skew-x-[-5deg] shadow-lg shadow-primary/20">
            LAUNCH APP_
          </Button>
        </ScrollAnimation>
      </div>
    </div>
  );
}

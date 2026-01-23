import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowRight, Zap, Layers, Lock, ChevronRight, Cpu } from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
}

export function LandingPage({ onLaunch }: LandingPageProps) {
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
            onClick={onLaunch}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition-all rounded-none"
          >
            [ LAUNCH_APP ]
          </Button>
        </nav>

        {/* Hero Section */}
        <div className="py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-20">
            <div className="inline-block px-3 py-1 border border-accent/30 bg-accent/5 text-accent font-mono text-xs mb-4">
              /// HACKATHON_BUILD_2026
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
                onClick={onLaunch}
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 h-14 rounded-none skew-x-[-5deg]"
              >
                START EARNING <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-border hover:border-accent text-muted-foreground hover:text-accent font-mono h-14 rounded-none skew-x-[-5deg]"
              >
                READ_DOCS
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

        {/* Feasibility / Tech Stack */}
        <div className="py-24 border-t border-border/50">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-4xl font-bold mb-4">THE ARCHITECTURE</h2>
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
            <a href="#" className="hover:text-primary transition-colors">GITHUB</a>
            <a href="#" className="hover:text-primary transition-colors">TWITTER</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

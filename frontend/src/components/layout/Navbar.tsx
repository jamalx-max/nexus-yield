import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, Cpu } from 'lucide-react';
import { Button } from '../ui/button';
import { useStacksWallet } from '../../providers/StacksWalletProvider';
import { shortenAddress } from '../../lib/utils';

interface NavbarProps {
  onBrandClick?: () => void;
}

export function Navbar({ onBrandClick }: NavbarProps) {
  const { isConnected: stacksConnected, address: stacksAddress, connect: connectStacks, disconnect: disconnectStacks } = useStacksWallet();

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button onClick={onBrandClick} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary skew-x-[-10deg] flex items-center justify-center group-hover:bg-accent transition-colors">
              <Cpu className="text-black w-6 h-6 skew-x-[10deg]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-heading font-bold text-xl leading-none tracking-tighter">APEX</span>
              <span className="font-mono text-xs text-primary tracking-widest group-hover:text-accent transition-colors">YIELD_PROTOCOL</span>
            </div>
          </button>

          {/* Rate Ticker */}
          <div className="hidden md:flex items-center gap-8 text-sm border-x border-border/50 px-8 h-full bg-background/50">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">Aave / Eth</span>
              <span className="font-mono text-muted-foreground line-through decoration-destructive">4.2%</span>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex flex-col">
              <span className="text-primary text-[10px] font-mono uppercase tracking-wider">Apex / Stx</span>
              <span className="font-mono text-primary font-bold text-lg glow-primary">13.5%</span>
            </div>
          </div>

          {/* Wallet Connections */}
          <div className="flex items-center gap-3">
            {/* Ethereum Wallet (RainbowKit) */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            variant="outline"
                            size="sm"
                            className="gap-2 font-mono text-xs border-border hover:border-primary hover:text-primary rounded-none"
                          >
                            <Wallet className="h-4 w-4" />
                            <span className="hidden sm:inline">CONNECT_ETH</span>
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button onClick={openChainModal} variant="destructive" size="sm" className="rounded-none font-mono text-xs">
                            WRONG_NET
                          </Button>
                        );
                      }

                      return (
                        <Button
                          onClick={openAccountModal}
                          variant="secondary"
                          size="sm"
                          className="gap-2 font-mono text-xs bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 rounded-none"
                        >
                          <div className="w-2 h-2 bg-secondary animate-pulse" />
                          {account.displayName}
                        </Button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>

            {/* Stacks Wallet */}
            {stacksConnected ? (
              <Button
                onClick={disconnectStacks}
                variant="secondary"
                size="sm"
                className="gap-2 font-mono text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-none"
              >
                <div className="w-2 h-2 bg-primary animate-pulse" />
                {shortenAddress(stacksAddress || '')}
              </Button>
            ) : (
              <Button
                onClick={connectStacks}
                variant="default"
                size="sm"
                className="gap-2 font-mono text-xs bg-primary text-black hover:bg-accent hover:text-black rounded-none"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">CONNECT_STX</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

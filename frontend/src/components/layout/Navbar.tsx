import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';
import { Button } from '../ui/button';
import { useStacksWallet } from '../../providers/StacksWalletProvider';
import { shortenAddress } from '../../lib/utils';

export function Navbar() {
  const { isConnected: stacksConnected, address: stacksAddress, connect: connectStacks, disconnect: disconnectStacks } = useStacksWallet();

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AY</span>
            </div>
            <span className="font-semibold text-lg">Apex Yield</span>
          </div>

          {/* Rate Ticker */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Aave:</span>
              <span className="font-number text-muted-foreground">4.2%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Apex:</span>
              <span className="font-number text-accent font-semibold">13.5%</span>
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
                            className="gap-2"
                          >
                            <Wallet className="h-4 w-4" />
                            <span className="hidden sm:inline">ETH</span>
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button onClick={openChainModal} variant="destructive" size="sm">
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <Button
                          onClick={openAccountModal}
                          variant="secondary"
                          size="sm"
                          className="gap-2 font-mono"
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500" />
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
                className="gap-2 font-mono"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                {shortenAddress(stacksAddress || '')}
              </Button>
            ) : (
              <Button
                onClick={connectStacks}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">STX</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

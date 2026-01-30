import { useEffect, useState } from 'react';
import { History, ArrowUpRight, ArrowDownToLine, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getTransactions, type BridgeTransaction } from '../lib/history';
import { shortenTxHash } from '../lib/bridge/address';
import { CHAIN_CONFIG } from '../config/constants';

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);

  useEffect(() => {
    setTransactions(getTransactions());
    
    // Listen for storage events (if we update from another tab/hook)
    const handleStorage = () => setTransactions(getTransactions());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (transactions.length === 0) return null;

  return (
    <Card className="cyber-card mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-muted-foreground font-mono text-xs uppercase">
          <History className="h-3 w-3" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between text-sm font-mono">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-full ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                  {tx.type === 'deposit' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownToLine className="h-3 w-3" />}
                </div>
                <div>
                  <p className="font-bold">{tx.type === 'deposit' ? 'Bridged to Stacks' : 'Withdrawn to ETH'}</p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p>{tx.amount} USDC</p>
                <a 
                  href={tx.type === 'deposit' 
                    ? `${CHAIN_CONFIG.ethereum.blockExplorer}/tx/${tx.txHash}`
                    : `${CHAIN_CONFIG.stacks.explorerUrl.split('&')[0]}/txid/${tx.txHash}?chain=testnet`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center justify-end gap-1"
                >
                  {shortenTxHash(tx.txHash, 4)}
                  <ExternalLink className="h-2 w-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

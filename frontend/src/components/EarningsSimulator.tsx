import { useState } from 'react';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { calculateProjections, formatCurrency } from '../lib/yield-math';

interface EarningsSimulatorProps {
  apy: number;
}

export function EarningsSimulator({ apy }: EarningsSimulatorProps) {
  const [amount, setAmount] = useState<number>(10000);
  const projections = calculateProjections(amount, apy);

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-mono text-sm uppercase">
          <Calculator className="h-4 w-4" />
          Earnings Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-muted-foreground">DEPOSIT_AMOUNT (USDC)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="pl-9 font-mono text-lg bg-background/50"
            />
          </div>
          <input
            type="range"
            min="100"
            max="100000"
            step="100"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary/20 rounded border border-border/50">
            <p className="text-xs text-muted-foreground font-mono mb-1">Monthly Earnings</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(projections.monthly)}</p>
          </div>
          <div className="p-3 bg-secondary/20 rounded border border-border/50">
            <p className="text-xs text-muted-foreground font-mono mb-1">Yearly Earnings</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(projections.yearly)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/10 p-2 rounded">
          <TrendingUp className="h-3 w-3 text-accent" />
          <span>Based on current APY of {apy}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

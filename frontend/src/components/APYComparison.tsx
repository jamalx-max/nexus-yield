import { BarChart3, Building2, Landmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface APYComparisonProps {
  apexApy: number;
}

export function APYComparison({ apexApy }: APYComparisonProps) {
  const comparisonData = [
    { name: 'Traditional Bank', apy: 0.5, icon: Landmark, color: 'bg-muted-foreground' },
    { name: 'Aave (Optimism)', apy: 4.2, icon: Building2, color: 'bg-blue-500' },
    { name: 'Apex Yield', apy: apexApy, icon: BarChart3, color: 'bg-primary' },
  ];

  // Find max APY to scale bars
  const maxApy = Math.max(...comparisonData.map(d => d.apy));

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-mono text-sm uppercase">
          <BarChart3 className="h-4 w-4" />
          Market Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {comparisonData.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="h-3 w-3" />
                {item.name}
              </span>
              <span className="font-bold">{item.apy.toFixed(2)}% APY</span>
            </div>
            <div className="h-4 bg-secondary/30 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                style={{ width: `${(item.apy / maxApy) * 100}%` }}
              />
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs font-mono text-muted-foreground text-center">
            Apex Yield offers <span className="text-primary font-bold">{(apexApy / 0.5).toFixed(1)}x</span> higher returns than traditional banks.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

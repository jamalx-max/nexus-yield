import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { formatUSD } from '../lib/utils';

interface YieldChartProps {
  initialInvestment?: number;
  aaveApy?: number;
  apexApy?: number;
}

export function YieldChart({ 
  initialInvestment = 10000, 
  aaveApy = 4.2, 
  apexApy = 13.5 
}: YieldChartProps) {
  // Generate projected yield data over 12 months
  const data = useMemo(() => {
    const months = [];
    
    for (let month = 0; month <= 12; month++) {
      const years = month / 12;
      
      // Compound interest formula: A = P * (1 + r)^t
      const aaveValue = initialInvestment * Math.pow(1 + aaveApy / 100, years);
      const apexValue = initialInvestment * Math.pow(1 + apexApy / 100, years);
      
      months.push({
        month: month === 0 ? 'Now' : `M${month}`,
        monthNum: month,
        aave: Math.round(aaveValue * 100) / 100,
        apex: Math.round(apexValue * 100) / 100,
      });
    }
    
    return months;
  }, [initialInvestment, aaveApy, apexApy]);

  // Calculate final values for summary
  const finalAave = data[data.length - 1].aave;
  const finalApex = data[data.length - 1].apex;
  const advantage = finalApex - finalAave;

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg">Projected Yield Comparison</CardTitle>
        <CardDescription>
          ${formatUSD(initialInvestment).replace('$', '')} invested over 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                domain={['dataMin - 100', 'dataMax + 200']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => [
                  formatUSD(value),
                  name === 'apex' ? 'Apex Yield' : 'Aave'
                ]}
              />
              <Legend 
                formatter={(value) => value === 'apex' ? 'Apex Yield (13.5%)' : 'Aave (4.2%)'}
              />
              <Line 
                type="monotone" 
                dataKey="aave" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="apex" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Aave (1yr)</p>
            <p className="font-number text-muted-foreground">{formatUSD(finalAave)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Apex (1yr)</p>
            <p className="font-number text-accent font-semibold">{formatUSD(finalApex)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Extra Earnings</p>
            <p className="font-number text-accent font-bold">+{formatUSD(advantage)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

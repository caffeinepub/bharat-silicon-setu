import { useMemo } from 'react';
import { useRevenueTotal, useAllRevenue } from '../hooks/useRevenue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function Revenue() {
  const { data: totalRevenue = 0, isLoading: totalLoading, error: totalError } = useRevenueTotal();
  const { data: allRevenue = [], isLoading: allLoading, error: allError } = useAllRevenue();

  const isLoading = totalLoading || allLoading;
  const error = totalError || allError;

  const monthlyBreakdown = useMemo(() => {
    const monthMap = new Map<string, number>();
    
    allRevenue.forEach(revenue => {
      const date = new Date(Number(revenue.timestamp) / 1000000);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const currentTotal = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, currentTotal + revenue.totalRevenue);
    });
    
    return Array.from(monthMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 6);
  }, [allRevenue]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading revenue data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-white">Failed to load revenue data. You may not have permission to view this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Revenue</h1>
          <p className="text-white">Track platform revenue and financial metrics</p>
        </div>

        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All-time platform earnings
            </p>
          </CardContent>
        </Card>

        {/* Monthly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Monthly Revenue Breakdown</CardTitle>
            <CardDescription className="text-white">Revenue by month (last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyBreakdown.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-white">No revenue data available yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyBreakdown.map(([monthKey, amount]) => (
                  <div key={monthKey} className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-white font-medium">{formatMonth(monthKey)}</p>
                        <p className="text-xs text-muted-foreground">Monthly total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{formatCurrency(amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Revenue Insights</CardTitle>
            <CardDescription className="text-white">Key financial metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-white">{allRevenue.length}</p>
              </div>
              <div className="p-4 bg-muted/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Average Transaction</p>
                <p className="text-2xl font-bold text-white">
                  {allRevenue.length > 0 
                    ? formatCurrency(totalRevenue / allRevenue.length)
                    : formatCurrency(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

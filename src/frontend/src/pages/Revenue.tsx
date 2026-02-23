import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';

export default function Revenue() {
  // Mock revenue data
  const totalRevenue = 125000;
  const monthlyRevenue = [
    { month: 'Jan', amount: 8500 },
    { month: 'Feb', amount: 12000 },
    { month: 'Mar', amount: 15000 },
    { month: 'Apr', amount: 18500 },
    { month: 'May', amount: 22000 },
    { month: 'Jun', amount: 25000 }
  ];
  
  const subscriptionTiers = [
    { tier: 'Basic', count: 45, revenue: 22500 },
    { tier: 'Professional', count: 28, revenue: 56000 },
    { tier: 'Enterprise', count: 12, revenue: 46500 }
  ];

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Revenue</h1>
          <p className="text-white">Track platform financial metrics and growth</p>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="py-4">
            <p className="text-white text-sm">
              <strong>Note:</strong> This is mock financial data for demonstration. Backend revenue tracking integration is pending.
            </p>
          </CardContent>
        </Card>

        {/* Revenue Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-white mt-1">+20% from last quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${monthlyRevenue[monthlyRevenue.length - 1].amount.toLocaleString()}</div>
              <p className="text-xs text-white mt-1">Current month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {subscriptionTiers.reduce((sum, tier) => sum + tier.count, 0)}
              </div>
              <p className="text-xs text-white mt-1">Across all tiers</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Monthly Revenue Breakdown</CardTitle>
            <CardDescription className="text-white">Revenue trends over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyRevenue.map((month) => (
                <div key={month.month} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <span className="text-white font-medium">{month.month}</span>
                  <span className="text-white font-bold">${month.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Tiers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Subscription Tier Statistics</CardTitle>
            <CardDescription className="text-white">Revenue distribution by subscription level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptionTiers.map((tier) => (
                <div key={tier.tier} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">{tier.tier}</p>
                      <p className="text-sm text-white">{tier.count} subscribers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${tier.revenue.toLocaleString()}</p>
                    <p className="text-sm text-white">
                      {((tier.revenue / totalRevenue) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Revenue Growth Chart</CardTitle>
            <CardDescription className="text-white">Visual representation of revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-white">Chart visualization placeholder</p>
                <p className="text-sm text-white mt-2">Integration with charting library pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

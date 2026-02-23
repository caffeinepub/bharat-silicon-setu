import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Activity, Download, Users, Briefcase, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

// Mock activity data
const mockActivities = [
  { id: '1', user: 'Rajesh Kumar', action: 'Applied to project', timestamp: '2 hours ago', type: 'application' },
  { id: '2', user: 'TechCorp Industries', action: 'Posted new project', timestamp: '4 hours ago', type: 'project' },
  { id: '3', user: 'Priya Sharma', action: 'Updated skill profile', timestamp: '6 hours ago', type: 'profile' },
  { id: '4', user: 'SemiCon Solutions', action: 'Sent message to applicant', timestamp: '8 hours ago', type: 'message' },
  { id: '5', user: 'Amit Patel', action: 'Completed project', timestamp: '1 day ago', type: 'completion' }
];

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Mock engagement metrics
  const metrics = {
    dailyActiveUsers: 342,
    projectApplications: 156,
    messagesSent: 89
  };

  const handleExport = () => {
    const reportData = {
      dateRange,
      metrics,
      activities: mockActivities
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `platform-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully!');
  };

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Reports</h1>
          <p className="text-white">Platform activity reports and analytics</p>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="py-4">
            <p className="text-white text-sm">
              <strong>Note:</strong> Activity logging backend integration is pending. Currently showing mock data.
            </p>
          </CardContent>
        </Card>

        {/* Date Range Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Report Period</CardTitle>
            <CardDescription className="text-white">Select date range for custom reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-white">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-white">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="text-white"
                />
              </div>
            </div>
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Daily Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.dailyActiveUsers}</div>
              <p className="text-xs text-white mt-1">+15% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Project Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.projectApplications}</div>
              <p className="text-xs text-white mt-1">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Messages Sent</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.messagesSent}</div>
              <p className="text-xs text-white mt-1">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-white">Latest platform actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                  <Activity className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.user}</p>
                    <p className="text-sm text-white">{activity.action}</p>
                  </div>
                  <span className="text-sm text-white">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

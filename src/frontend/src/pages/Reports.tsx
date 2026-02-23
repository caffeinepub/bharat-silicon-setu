import { useState, useMemo } from 'react';
import { useAllReports } from '../hooks/useReports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileDown, BarChart3, Users, Briefcase, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const { data: reports = [], isLoading, error } = useAllReports();

  const aggregatedMetrics = useMemo(() => {
    if (reports.length === 0) {
      return {
        totalActiveUsers: 0,
        totalApplications: 0,
        totalMessages: 0
      };
    }

    return reports.reduce((acc, report) => ({
      totalActiveUsers: acc.totalActiveUsers + Number(report.dailyActiveUsers),
      totalApplications: acc.totalApplications + Number(report.projectApplications),
      totalMessages: acc.totalMessages + Number(report.messagesSent)
    }), {
      totalActiveUsers: 0,
      totalApplications: 0,
      totalMessages: 0
    });
  }, [reports]);

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(reports, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `platform-reports-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
      console.error('Export error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading reports...</div>
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
              <p className="text-white">Failed to load reports. You may not have permission to view this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">Reports</h1>
            <p className="text-white">Platform activity and engagement reports</p>
          </div>
          <Button onClick={handleExport} disabled={reports.length === 0}>
            <FileDown className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{aggregatedMetrics.totalActiveUsers}</div>
              <p className="text-xs text-muted-foreground">
                Across all reporting periods
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Project Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{aggregatedMetrics.totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                Total applications submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Messages Sent</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{aggregatedMetrics.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                Platform communications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Activity Reports</CardTitle>
            <CardDescription className="text-white">Detailed platform activity by date range</CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-white">No reports available yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Reports will appear here as platform activity is tracked
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <div key={index} className="p-4 bg-muted/10 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">Report #{index + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Number(report.startDate) / 1000000).toLocaleDateString()} - {new Date(Number(report.endDate) / 1000000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Daily Active Users</p>
                        <p className="text-lg font-bold text-white">{Number(report.dailyActiveUsers)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Applications</p>
                        <p className="text-lg font-bold text-white">{Number(report.projectApplications)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Messages</p>
                        <p className="text-lg font-bold text-white">{Number(report.messagesSent)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

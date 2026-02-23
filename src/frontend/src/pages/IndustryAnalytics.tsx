import { useAnalyticsData } from '../hooks/useAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, Users, Briefcase, Activity } from 'lucide-react';

export default function IndustryAnalytics() {
  const { data: analytics, isLoading, error } = useAnalyticsData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading analytics...</div>
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
              <p className="text-white">Failed to load analytics data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalApplicants = analytics?.projectApplicantCounts.reduce((sum, [_, count]) => sum + Number(count), 0) || 0;
  const activeProjects = Number(analytics?.activeProjects || 0);
  const engagementRate = analytics?.engagementRate || 0;

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Analytics</h1>
          <p className="text-white">Track your project performance and engagement</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Applicants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalApplicants}</div>
              <p className="text-xs text-muted-foreground">
                Across all your projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                Currently accepting applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Engagement Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{engagementRate.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Average applicants per project
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Project Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Project Performance</CardTitle>
            <CardDescription className="text-white">Application counts by project</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics && analytics.projectApplicantCounts.length > 0 ? (
              <div className="space-y-4">
                {analytics.projectApplicantCounts.map(([projectPrincipal, count], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        Project {index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {projectPrincipal.toString().slice(0, 20)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{Number(count)}</p>
                      <p className="text-xs text-muted-foreground">applicants</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-white">No project data available yet</p>
            )}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Insights</CardTitle>
            <CardDescription className="text-white">Key takeaways from your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-white font-medium">Project Visibility</p>
                <p className="text-sm text-muted-foreground">
                  {activeProjects > 0 
                    ? `You have ${activeProjects} active ${activeProjects === 1 ? 'project' : 'projects'} attracting talent`
                    : 'Create more projects to increase visibility'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-white font-medium">Talent Pool</p>
                <p className="text-sm text-muted-foreground">
                  {totalApplicants > 0
                    ? `${totalApplicants} ${totalApplicants === 1 ? 'student has' : 'students have'} shown interest in your projects`
                    : 'Start receiving applications by creating projects'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

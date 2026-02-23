import { useGetUserProjects } from '../hooks/useProjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, Users, Briefcase, Activity } from 'lucide-react';

export default function IndustryAnalytics() {
  const { data: projects = [], isLoading } = useGetUserProjects();
  
  const activeProjects = projects.filter(p => p.approved).length;
  const totalApplicants = 47; // Mock data
  const engagementRate = 68; // Mock data

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Analytics</h1>
          <p className="text-white">Track your project performance and engagement</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Applicants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalApplicants}</div>
              <p className="text-xs text-white mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeProjects}</div>
              <p className="text-xs text-white mt-1">{projects.length} total projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Engagement Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{engagementRate}%</div>
              <p className="text-xs text-white mt-1">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Application Trends</CardTitle>
            <CardDescription className="text-white">Monthly application growth over time</CardDescription>
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

        {/* Project Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Project Performance</CardTitle>
            <CardDescription className="text-white">Individual project metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project, index) => (
                <div key={index} className="flex justify-between items-center p-4 border border-border rounded-lg">
                  <div>
                    <p className="text-white font-medium">{project.title}</p>
                    <p className="text-sm text-white">
                      {Math.floor(Math.random() * 20) + 5} applicants
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {Math.floor(Math.random() * 30) + 60}% match rate
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

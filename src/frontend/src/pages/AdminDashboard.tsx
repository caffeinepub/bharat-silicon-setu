import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Shield, Users, Briefcase, LogOut, TrendingUp, Activity, Target } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { usePlatformMetrics } from '../hooks/usePlatformMetrics';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clear } = useInternetIdentity();
  const { data: metrics, isLoading: metricsLoading } = usePlatformMetrics();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const totalUsers = metrics?.totalUsers ?? 0;
  const totalProjects = metrics?.totalProjects ?? 0;

  return (
    <div className="min-h-screen bg-background dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-display font-bold text-white">Admin Portal</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium">
            <Target className="h-5 w-5" />
            <span className="text-white">Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-white">
            <Users className="h-5 w-5" />
            <span>Users</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-white">
            <Briefcase className="h-5 w-5" />
            <span>Projects</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-white">
            <Activity className="h-5 w-5" />
            <span>Activity</span>
          </button>
        </nav>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">Admin Dashboard</h1>
            <p className="text-white">Platform overview and management</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {metricsLoading ? (
                  <div className="text-2xl font-bold text-white">...</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-white">{totalUsers}</div>
                    <p className="text-xs text-white mt-1">Registered users</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {metricsLoading ? (
                  <div className="text-2xl font-bold text-white">...</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-white">{totalProjects}</div>
                    <p className="text-xs text-white mt-1">All projects</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Today</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">42</div>
                <p className="text-xs text-white mt-1">Users online</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">+23%</div>
                <p className="text-xs text-white mt-1">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
              <TabsTrigger value="users" className="text-white">Users</TabsTrigger>
              <TabsTrigger value="projects" className="text-white">Projects</TabsTrigger>
              <TabsTrigger value="activity" className="text-white">Activity</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-white">Platform Statistics</CardTitle>
                    <CardDescription className="text-white">Key metrics at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white">Students</span>
                      <span className="font-semibold text-white">{Math.floor(totalUsers * 0.7)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white">Industry Partners</span>
                      <span className="font-semibold text-white">{Math.floor(totalUsers * 0.25)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white">Admins</span>
                      <span className="font-semibold text-white">{Math.floor(totalUsers * 0.05)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="text-sm text-white">Approved Projects</span>
                      <span className="font-semibold text-white">{Math.floor(totalProjects * 0.8)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white">Pending Approval</span>
                      <span className="font-semibold text-white">{Math.floor(totalProjects * 0.2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-white">Latest platform events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm text-white">New user registered</p>
                          <p className="text-xs text-white">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Project submitted for approval</p>
                          <p className="text-xs text-white">15 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Student applied to project</p>
                          <p className="text-xs text-white">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Growth Chart</CardTitle>
                  <CardDescription className="text-white">User and project growth over time</CardDescription>
                </CardHeader>
                <CardContent className="py-12 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-white">Chart visualization coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">User Management</CardTitle>
                  <CardDescription className="text-white">Manage platform users</CardDescription>
                </CardHeader>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-white">User management interface coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Project Management</CardTitle>
                  <CardDescription className="text-white">Review and approve projects</CardDescription>
                </CardHeader>
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-white">Project management interface coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Activity Log</CardTitle>
                  <CardDescription className="text-white">Detailed platform activity</CardDescription>
                </CardHeader>
                <CardContent className="py-12 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-white">Activity log coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

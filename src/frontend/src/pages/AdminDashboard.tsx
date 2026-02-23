import { useNavigate, Link, useLocation } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Shield, Users, Briefcase, DollarSign, FileText, LogOut, Target, Settings } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { usePlatformMetrics } from '../hooks/usePlatformMetrics';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Outlet } from '@tanstack/react-router';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { clear } = useInternetIdentity();
  const { data: metrics, isLoading } = usePlatformMetrics();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const isActive = (path: string) => location.pathname === path;

  // Check if we're on a sub-route
  const isSubRoute = location.pathname !== '/admin-dashboard';

  // If on a sub-route, render the Outlet
  if (isSubRoute) {
    return (
      <div className="min-h-screen bg-background dark">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-display font-bold text-white">Admin Portal</span>
          </div>
          
          <nav className="flex-1 space-y-2">
            <Link
              to="/admin-dashboard"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin-dashboard') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <Target className="h-5 w-5" />
              <span className="text-white">Dashboard</span>
            </Link>
            <Link
              to="/admin/users"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/users') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="text-white">Users</span>
            </Link>
            <Link
              to="/admin/projects"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/projects') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-white">Projects</span>
            </Link>
            <Link
              to="/admin/revenue"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/revenue') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-white">Revenue</span>
            </Link>
            <Link
              to="/admin/reports"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/reports') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="text-white">Reports</span>
            </Link>
            <Link
              to="/admin/settings"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/settings') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="text-white">Settings</span>
            </Link>
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
        <main className="ml-64">
          <Outlet />
        </main>
      </div>
    );
  }

  const totalUsers = metrics ? Number(metrics[0]) : 0;
  const totalProjects = metrics ? Number(metrics[1]) : 0;

  return (
    <div className="min-h-screen bg-background dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-display font-bold text-white">Admin Portal</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link
            to="/admin-dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
          >
            <Target className="h-5 w-5" />
            <span className="text-white">Dashboard</span>
          </Link>
          <Link
            to="/admin/users"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Users className="h-5 w-5" />
            <span className="text-white">Users</span>
          </Link>
          <Link
            to="/admin/projects"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Briefcase className="h-5 w-5" />
            <span className="text-white">Projects</span>
          </Link>
          <Link
            to="/admin/revenue"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <DollarSign className="h-5 w-5" />
            <span className="text-white">Revenue</span>
          </Link>
          <Link
            to="/admin/reports"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span className="text-white">Reports</span>
          </Link>
          <Link
            to="/admin/settings"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="text-white">Settings</span>
          </Link>
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

          {/* Platform Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {isLoading ? '...' : totalUsers}
                </div>
                <p className="text-xs text-white mt-1">Registered on platform</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {isLoading ? '...' : totalProjects}
                </div>
                <p className="text-xs text-white mt-1">Posted by industry partners</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-white">Latest platform events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-white font-medium">New user registered</p>
                    <p className="text-sm text-white">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-white font-medium">New project posted</p>
                    <p className="text-sm text-white">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-white font-medium">Project application submitted</p>
                    <p className="text-sm text-white">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Platform Growth</CardTitle>
              <CardDescription className="text-white">User and project trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
                <p className="text-white">Chart visualization placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Cpu, Home, Users, Briefcase, BarChart3, Settings, LogOut, TrendingUp, Activity } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePlatformMetrics } from '../hooks/usePlatformMetrics';
import { Skeleton } from '../components/ui/skeleton';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { clear } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: metrics, isLoading: metricsLoading } = usePlatformMetrics();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-background dark flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Cpu className="h-8 w-8 text-primary" />
            <span className="text-lg font-display font-bold">Silicon Setu</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'users' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Users</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'projects' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span className="font-medium">Projects</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'analytics' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome, {profileLoading ? '...' : userProfile?.name || 'Admin'}
            </p>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  {metricsLoading ? (
                    <Skeleton className="h-10 w-24" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold">{metrics?.totalUsers || 0}</p>
                      <p className="text-xs text-success mt-1">Platform registered users</p>
                    </>
                  )}
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Projects</h3>
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  {metricsLoading ? (
                    <Skeleton className="h-10 w-24" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold">{metrics?.totalProjects || 0}</p>
                      <p className="text-xs text-success mt-1">Active and pending projects</p>
                    </>
                  )}
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Growth Rate</h3>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">--</p>
                  <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
                </div>
              </div>

              {/* Platform Activity */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {metricsLoading ? (
                    <>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </>
                  ) : (metrics?.totalUsers || 0) === 0 && (metrics?.totalProjects || 0) === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No activity yet</p>
                      <p className="text-sm mt-2">Platform activity will appear here</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Platform Statistics</p>
                          <p className="text-sm text-muted-foreground">
                            {metrics?.totalUsers || 0} users and {metrics?.totalProjects || 0} projects on the platform
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Growth Chart Placeholder */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Platform Growth</h2>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Growth chart coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">User Management</h2>
                <p className="text-muted-foreground">User management interface coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Project Management</h2>
                <p className="text-muted-foreground">Project approval and management interface coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Advanced Analytics</h2>
                <p className="text-muted-foreground">Detailed analytics dashboard coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Platform Settings</h2>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Cpu, Home, Briefcase, MessageSquare, User, Settings, LogOut, TrendingUp, Award, Clock } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUserProfile } from '../hooks/useUserProfile';
import { useGetApprovedProjects } from '../hooks/useProjects';
import { useGetContactRequests } from '../hooks/useContactRequests';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Skeleton } from '../components/ui/skeleton';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { clear } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: projects = [], isLoading: projectsLoading } = useGetApprovedProjects();
  const { data: messages = [], isLoading: messagesLoading } = useGetContactRequests();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  // Calculate profile completion (simplified)
  const profileCompletion = userProfile ? 75 : 0;

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
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'projects' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span className="font-medium">Projects</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'messages' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">Messages</span>
            {messages.length > 0 && (
              <Badge variant="destructive" className="ml-auto">{messages.length}</Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="font-medium">Profile</span>
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
              Welcome back, {profileLoading ? '...' : userProfile?.name || 'Student'}!
            </h1>
            <p className="text-muted-foreground">Track your progress and explore new opportunities</p>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Profile Completion */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Profile Completion</h2>
                  <span className="text-2xl font-bold text-primary">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="mb-4" />
                <p className="text-sm text-muted-foreground">
                  Complete your profile to unlock more opportunities and improve project matching
                </p>
              </div>

              {/* Skills */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">VLSI Design</Badge>
                  <Badge variant="secondary">Verilog</Badge>
                  <Badge variant="secondary">SystemVerilog</Badge>
                  <Badge variant="secondary">Digital Design</Badge>
                  <Badge variant="secondary">FPGA</Badge>
                  <Badge variant="secondary">ASIC</Badge>
                </div>
                <Link to="/ai-skill-mapping" className="inline-block mt-4 text-sm text-primary hover:underline">
                  Update skills with AI →
                </Link>
              </div>

              {/* Available Projects */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Available Projects</h2>
                {projectsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No projects available yet</p>
                    <p className="text-sm mt-1">Check back soon for new opportunities</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{project.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(Math.random() * 30 + 70)}% Match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.skillsRequired.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Messages */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Mentor Messages</h2>
                {messagesLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm mt-1">Connect with mentors to get guidance</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.slice(0, 3).map((msg, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-sm">Industry Mentor</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">All Available Projects</h2>
                {projectsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No projects available yet</p>
                    <p className="text-sm mt-2">Check back soon for new opportunities</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projects.map((project, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {Math.floor(Math.random() * 30 + 70)}% Match
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.skillsRequired.map((skill, i) => (
                            <Badge key={i} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                          Apply Now
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Messages</h2>
                {messagesLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No messages yet</p>
                    <p className="text-sm mt-2">Connect with mentors to get guidance</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Industry Mentor</p>
                            <p className="text-xs text-muted-foreground">From: {msg.from.toString().slice(0, 10)}...</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>
                {profileLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="text-lg">{userProfile?.name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-lg">{userProfile?.email || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Role</label>
                      <p className="text-lg capitalize">{userProfile?.role || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Principal ID</label>
                      <p className="text-sm font-mono break-all">{userProfile?.principalId.toString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Settings</h2>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

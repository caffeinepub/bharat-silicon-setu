import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Cpu, Home, Briefcase, Users, BarChart3, Settings, LogOut, Plus, TrendingUp } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUserProfile } from '../hooks/useUserProfile';
import { useGetUserProjects, useSaveProject } from '../hooks/useProjects';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Skeleton } from '../components/ui/skeleton';
import { AppUserRole } from '../backend';

export default function IndustryDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectSkills, setProjectSkills] = useState('');
  
  const { clear, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: projects = [], isLoading: projectsLoading } = useGetUserProjects();
  const saveProjectMutation = useSaveProject();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identity) return;

    const skillsArray = projectSkills.split(',').map(s => s.trim()).filter(Boolean);
    
    try {
      await saveProjectMutation.mutateAsync({
        title: projectTitle,
        description: projectDescription,
        skillsRequired: skillsArray,
        createdBy: identity.getPrincipal(),
        approved: false
      });
      
      setShowProjectModal(false);
      setProjectTitle('');
      setProjectDescription('');
      setProjectSkills('');
    } catch (error) {
      console.error('Failed to create project:', error);
    }
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
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'projects' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span className="font-medium">My Projects</span>
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'applicants' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Applicants</span>
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">
                Welcome, {profileLoading ? '...' : userProfile?.name || 'Partner'}!
              </h1>
              <p className="text-muted-foreground">Manage your projects and find top semiconductor talent</p>
            </div>
            <Button onClick={() => setShowProjectModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post Project
            </Button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Analytics Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{projectsLoading ? '...' : projects.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {projects.filter(p => p.approved).length} approved
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Applicants</h3>
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-xs text-success mt-1">No applicants yet</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Engagement Rate</h3>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">0%</p>
                  <p className="text-xs text-muted-foreground mt-1">Post projects to track</p>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
                {projectsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No projects yet</p>
                    <p className="text-sm mt-2 mb-4">Create your first project to start finding talent</p>
                    <Button onClick={() => setShowProjectModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{project.title}</h3>
                          <Badge variant={project.approved ? 'default' : 'secondary'}>
                            {project.approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.skillsRequired.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">All Projects</h2>
                  <Button onClick={() => setShowProjectModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
                {projectsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No projects yet</p>
                    <p className="text-sm mt-2">Create your first project to start finding talent</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projects.map((project, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          </div>
                          <Badge variant={project.approved ? 'default' : 'secondary'}>
                            {project.approved ? 'Approved' : 'Pending Review'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.skillsRequired.map((skill, i) => (
                            <Badge key={i} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>0 applicants</span>
                          <span>•</span>
                          <span>Posted recently</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'applicants' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Applicants</h2>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No applicants yet</p>
                  <p className="text-sm mt-2">Applicants will appear here once students apply to your projects</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Analytics</h2>
                <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
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

      {/* Create Project Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post a New Project</DialogTitle>
            <DialogDescription>
              Create a project to find skilled semiconductor talent
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="e.g., VLSI Design Engineer Needed"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the project requirements and objectives..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills (comma-separated)</Label>
              <Input
                id="skills"
                placeholder="e.g., Verilog, SystemVerilog, FPGA, ASIC"
                value={projectSkills}
                onChange={(e) => setProjectSkills(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowProjectModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveProjectMutation.isPending}>
                {saveProjectMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

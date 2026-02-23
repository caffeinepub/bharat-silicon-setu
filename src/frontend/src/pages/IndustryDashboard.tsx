import { useState } from 'react';
import { useNavigate, Link, useLocation } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Building2, Briefcase, Users, LogOut, Plus, TrendingUp, Target, Settings } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserProjects, useSaveProject } from '../hooks/useProjects';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Outlet } from '@tanstack/react-router';

export default function IndustryDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { clear, identity } = useInternetIdentity();
  const { data: projects = [], isLoading: projectsLoading } = useGetUserProjects();
  const saveProjectMutation = useSaveProject();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    skillsRequired: ''
  });

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleCreateProject = async () => {
    if (!identity) return;

    const skillsArray = newProject.skillsRequired
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      await saveProjectMutation.mutateAsync({
        title: newProject.title,
        description: newProject.description,
        skillsRequired: skillsArray,
        createdBy: identity.getPrincipal(),
        approved: false
      });

      setIsCreateDialogOpen(false);
      setNewProject({ title: '', description: '', skillsRequired: '' });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Check if we're on a sub-route
  const isSubRoute = location.pathname !== '/industry-dashboard';

  // If on a sub-route, render the Outlet
  if (isSubRoute) {
    return (
      <div className="min-h-screen bg-background dark">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-display font-bold text-white">Industry Portal</span>
          </div>
          
          <nav className="flex-1 space-y-2">
            <Link
              to="/industry-dashboard"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/industry-dashboard') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <Target className="h-5 w-5" />
              <span className="text-white">Dashboard</span>
            </Link>
            <Link
              to="/industry/post-project"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/industry/post-project') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-white">Post Project</span>
            </Link>
            <Link
              to="/industry/applicants"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/industry/applicants') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="text-white">Applicants</span>
            </Link>
            <Link
              to="/industry/analytics"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/industry/analytics') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-white">Analytics</span>
            </Link>
            <Link
              to="/industry/settings"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/industry/settings') ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
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

  return (
    <div className="min-h-screen bg-background dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-display font-bold text-white">Industry Portal</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link
            to="/industry-dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
          >
            <Target className="h-5 w-5" />
            <span className="text-white">Dashboard</span>
          </Link>
          <Link
            to="/industry/post-project"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Briefcase className="h-5 w-5" />
            <span className="text-white">Post Project</span>
          </Link>
          <Link
            to="/industry/applicants"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <Users className="h-5 w-5" />
            <span className="text-white">Applicants</span>
          </Link>
          <Link
            to="/industry/analytics"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-white">Analytics</span>
          </Link>
          <Link
            to="/industry/settings"
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 text-white">Industry Dashboard</h1>
              <p className="text-white">Manage your projects and find talent</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Project</DialogTitle>
                  <DialogDescription className="text-white">
                    Post a new project to find talented students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Project Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., VLSI Design Internship"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the project requirements..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      rows={4}
                      className="text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-white">Required Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., VLSI, Verilog, SystemVerilog"
                      value={newProject.skillsRequired}
                      onChange={(e) => setNewProject({ ...newProject, skillsRequired: e.target.value })}
                      className="text-white"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateProject}
                    disabled={saveProjectMutation.isPending}
                    className="w-full"
                  >
                    {saveProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Analytics Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{projects.length}</div>
                <p className="text-xs text-white mt-1">Active postings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Applicants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">47</div>
                <p className="text-xs text-white mt-1">Across all projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">Avg Match Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">82%</div>
                <p className="text-xs text-white mt-1">Quality candidates</p>
              </CardContent>
            </Card>
          </div>

          {/* Projects List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Your Projects</CardTitle>
              <CardDescription className="text-white">Manage your posted projects</CardDescription>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="text-center py-12 text-white">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-white">No projects yet</p>
                  <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                    Post Your First Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold">{project.title}</h3>
                        <Badge variant={project.approved ? 'default' : 'secondary'} className="text-white">
                          {project.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-white text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.skillsRequired.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-white">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
